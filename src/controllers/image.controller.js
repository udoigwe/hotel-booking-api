const db = require('../utils/dbConfig');
const util = require('util');
const fs = require('fs').promises;
const FS = require('fs');
const { slugify, uuidv4 } = require('../utils/functions');
const sharp = require('sharp');

module.exports = {
    createRoomCategoryImages: async (req, res) => {
        const { room_category_id } = req.body;

        const uploadPath = 'public/images/rooms/';
        const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if room category exists
            const rooms = await util.promisify(connection.query).bind(connection)(`SELECT * FROM room_categories WHERE room_category_id = ? LIMIT 1`, [ room_category_id ]);

            if(rooms.length === 0)
            {
                throw new Error(`The selected room category does not exist`);
            }

            if(!req.files || !req.files.images)
            {
                throw new Error('No room images uploaded');
            }

            //check if uploaded images is more than one file
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            //validate images
            for(let i = 0; i < files.length; i++)
            {
                let file = files[i];

                //check if uploaded image is an acceptable format
                if(acceptedMimeTypes.indexOf(file.mimetype) === -1)
                {
                    //delete tempfile from server
                    await fs.unlink(file.tempFilePath);

                    throw new Error(`${file.name} is not accepted. Image must be jpeg, png or jpg format`)
                }

                /* check for size */
                if(file.size > 5000000)
                {
                    //delete tempfile from server
                    await fs.unlink(file.tempFilePath);

                    throw new Error(`${file.name} should not be more that 5MB in size`)
                }
            }

            //Insert images
            for(let i = 0; i < files.length; i++)
            {
                const file = files[i];
                const filename = file.name;
                const fileMimeType = file.mimetype;
                const filePath = file.tempFilePath;
                const extensionPosition = filename.lastIndexOf('.');
                const extension = filename.substr(extensionPosition).toLowerCase();
                const newFileName = uuidv4() + extension;

                //upload portrait version of image
                await sharp(filePath).resize({height:1200, width:900, fit:'cover'}).toFile(uploadPath + 'portrait/' + newFileName);
                //upload landscape version of image
                await sharp(filePath).resize({height:1280, width:1920, fit:'cover'}).toFile(uploadPath + 'landscape/' + newFileName);
                //delete tempfile from server
                await fs.unlink(filePath);

                //insert portrait image into database
                await util.promisify(connection.query).bind(connection)(`
                    INSERT INTO room_category_images
                    ( 
                        room_category_id,
                        room_category_image_filename,
                        room_category_image_mimetype,
                        room_category_image_type
                    )
                    VALUES (?, ?, ?, 'Portrait')
                `, [ room_category_id, newFileName, fileMimeType ])

                //insert landscape image into database
                await util.promisify(connection.query).bind(connection)(`
                    INSERT INTO room_category_images
                    ( 
                        room_category_id,
                        room_category_image_filename,
                        room_category_image_mimetype,
                        room_category_image_type
                    )
                    VALUES (?, ?, ?, 'Landscape')
                `, [ room_category_id, newFileName, fileMimeType ])
            }

            res.json({
                error: false,
                message:"Room category images uploaded successfully"
            })
        }
        catch(e)
        {
            res.json({
                error: true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    getRoomCategoryImages: async (req, res) => {
        const {
            room_category_id,
            room_category_image_status,
            room_category_image_type
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT a.*, 
            b.room_category_name 
            FROM room_category_images a LEFT JOIN room_categories b 
            ON a.room_category_id = b.room_category_id 
            WHERE 1 = 1
        `;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM room_category_images a LEFT JOIN room_categories b 
            ON a.room_category_id = b.room_category_id 
            WHERE 1 = 1
        `;

        const queryParams2 = [];

        if(room_category_id)
        {
            query += " AND a.room_category_id = ?";
            queryParams.push(room_category_id);

            query2 += " AND a.room_category_id = ?";
            queryParams2.push(room_category_id);
        }

        if(room_category_image_status)
        {
            query += " AND a.room_category_image_status = ?";
            queryParams.push(room_category_image_status);

            query2 += " AND a.room_category_image_status = ?";
            queryParams2.push(room_category_image_status);
        }

        if(room_category_image_type)
        {
            query += " AND a.room_category_image_type = ?";
            queryParams.push(room_category_image_type);

            query2 += " AND a.room_category_image_type = ?";
            queryParams2.push(room_category_image_type);
        }

        query += " ORDER BY room_category_image_id DESC";

        if(page && perPage)
        {
            const offset = (page - 1) * perPage;
            query += " LIMIT ?, ?";
            queryParams.push(offset);
            queryParams.push(perPage);
        }

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const data = await util.promisify(connection.query).bind(connection)(query, queryParams);
            const total = await util.promisify(connection.query).bind(connection)(query2, queryParams2);

            /* PAGINATION DETAILS */

            //total records
            const totalRecords = parseInt(total[0].total_records);

            // Calculate total pages if perPage is specified
            const totalPages = perPage ? Math.ceil(totalRecords / perPage) : null;

            // Calculate next and previous pages based on provided page and totalPages
            const nextPage = page && totalPages && page < totalPages ? page + 1 : null;
            const prevPage = page && page > 1 ? page - 1 : null;

            res.json({
                error: false,
                data,
                paginationData: {
                    totalRecords,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: perPage,
                    nextPage,
                    prevPage
                }
            })
        }
        catch(e)
        {
            res.json({
                error: true,
                message: e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    getForDataTable: async (req, res) => {
        //dataTable Server-Side parameters
        var columns = [
            'room_category_image_id',
            'room_category_name', 
            'room_category_image_filename', 
            'room_category_image_mimetype', 
            'room_category_image_type', 
            'room_category_image_status'
        ];

        var draw = parseInt(req.query.draw);
        var start = parseInt(req.query.start);
        var length = parseInt(req.query.length);
        var orderCol = req.query.order[0].column;
        var orderDir = req.query.order[0].dir;
        var search = req.query.search.value;

        var dTData = dTNumRows = dNumRowsFiltered = where = "";
        var filter = search == "" || search == null ? false : true;
        orderCol = columns[orderCol];
        var columnsJoined = columns.join(', ') 

        const { 
            room_category_id,
            room_category_image_status,
            room_category_image_type
        } = req.query;

        let query = `
            SELECT a.*, 
            b.room_category_name 
            FROM room_category_images a LEFT JOIN room_categories b 
            ON a.room_category_id = b.room_category_id 
            WHERE 1 = 1
        `;
        const queryParams = [];

        if(room_category_id)
        {
            query += ' AND a.room_category_id = ?';
            queryParams.push(room_category_id);
        }
        
        if(room_category_image_status)
        {
            query += ' AND a.room_category_image_status = ?';
            queryParams.push(room_category_image_status);
        }
        
        if(room_category_image_type)
        {
            query += ' AND a.room_category_image_type = ?';
            queryParams.push(room_category_image_type);
        }

        query += ' ORDER BY room_category_image_id DESC'; 

        const connection = await util.promisify(db.getConnection).bind(db)();
        
        try
        {    
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            dTNumRows = rows.length;

            if(filter)
            {
                where += "WHERE ";
                var i = 0;
                var len = columns.length - 1;

                for(var x = 0; x < columns.length; x++)
                {
                    if(i == len)
                    {
                        where += `${columns[x]} LIKE '%${search}%'`;
                    }
                    else
                    {
                        where += `${columns[x]} LIKE '%${search}%' OR `;
                    }

                    i++;
                }

                const rows1 = await util.promisify(connection.query).bind(connection)(`SELECT * FROM (${query})X ${where}`, queryParams);

                dNumRowsFiltered = rows1.length;
            }
            else
            {
                dNumRowsFiltered = dTNumRows;
            }

            const rows2 = await util.promisify(connection.query).bind(connection)(`SELECT ${columns} FROM (${query})X ${where} ORDER BY ${orderCol} ${orderDir} LIMIT ${length} OFFSET ${start}`, queryParams);

            if(rows2.length > 0)
            {
                var data = [];
                var rtData = rows2;

                for(var i = 0; i < rtData.length; i++) 
                {
                    rtData[i].DT_RowId = rtData[i].room_category_image_id;
                    data.push(rtData[i]);
                };

                dTData = data;
            }
            else
            {
                dTData = [];  
            }

            var responseData = {
                draw:draw,
                recordsTotal:dTNumRows,
                recordsFiltered:dNumRowsFiltered,
                data:dTData
            }

            res.send(responseData);

        }
        catch(e)
        {
            console.log(e.message)
        }
        finally
        {
            connection.release();
        }
    },
    getSingleRoomCategoryImage: async (req, res) => {
        const roomCategoryImageID = req.params.image_id;

        let query = `
            SELECT a.*, b.room_category_name 
            FROM room_category_images a LEFT JOIN room_categories b 
            ON a.room_category_id = b.room_category_id 
            WHERE a.room_category_image_id = ? LIMIT 1
        `;
        const queryParams = [roomCategoryImageID];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const images = await util.promisify(connection.query).bind(connection)(query, queryParams);

            if(images.length === 0)
            {
                throw new Error("Image not found found")
            }

            const image = images[0];
            
            res.json({
                error:false,
                image
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message: e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    updateRoomCategoryImage: async (req, res) => {
        const room_category_image_id = req.params.image_id;
        const {
            room_category_id,
            room_category_image_status
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if room category image exists
            const images = await util.promisify(connection.query).bind(connection)(`SELECT * FROM room_category_images WHERE room_category_image_id = ?  LIMIT 1`, [ room_category_image_id ]);

            //check if room category exists
            const rooms = await util.promisify(connection.query).bind(connection)(`SELECT * FROM room_categories WHERE room_category_id = ? LIMIT 1`, [ room_category_id ]);

            if(images.length === 0)
            {
                throw new Error(`The selected image does not exist`);
            }

            if(rooms.length === 0)
            {
                throw new Error(`The selected room category does not exist`)
            }

            //update room category image
            await util.promisify(connection.query).bind(connection)(`
                UPDATE room_category_images SET
                room_category_id = ?, 
                room_category_image_status = ?
                WHERE room_category_image_id = ?
            `, [ 
                    room_category_id, 
                    room_category_image_status, 
                    room_category_image_id
                ]
            );

            res.json({
                error: false,
                message: "Room category Image updated successfully"
            })
        }
        catch(e)
        {
            res.json({
                error: true,
                message: e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    deleteRoomCategoryImage: async (req, res) => {

        const room_category_image_id  = req.params.image_id;

        const uploadPath = 'public/images/rooms/';

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //start db transaction
            await util.promisify(connection.query).bind(connection)('START TRANSACTION');

            //check if image exists
            const images = await util.promisify(connection.query).bind(connection)(`SELECT * FROM room_category_images WHERE room_category_image_id = ? LIMIT 1`, [room_category_image_id]);

            if(images.length === 0)
            {
                throw new Error(`The selected images does not exist.`)
            }

            const image = images[0];
            const imageFullPath = image.room_category_image_type === 'Landscape' ? uploadPath + '/landscape/' + image.room_category_image_filename : uploadPath + '/portrait/' + image.room_category_image_filename;

            //delete query
            let query = `DELETE FROM room_category_images WHERE room_category_image_id = ?`; 
            const queryParams = [ room_category_image_id ];

            //delete the room category
            await util.promisify(connection.query).bind(connection)(query, queryParams);

            //check if the image exists in server storage and remove it
            if(FS.existsSync(imageFullPath))
            {
                //delete current avatar file
                await fs.unlink(imageFullPath);
            }

            //commit db changes
            await util.promisify(connection.query).bind(connection)("COMMIT");

            res.json({
                error: false,
                message: 'Room category image deleted successfully'
            })
        }
        catch(e)
        {
            //rollback db changes
            await util.promisify(connection.query).bind(connection)("ROLLBACK");

            res.json({
                error:true,
                message:e.message
            });
        }
        finally
        {
            connection.release();
        }
    },
}
const db = require('../utils/dbConfig');
const util = require('util');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const sharp = require('sharp');
const { validateLeadingZeros, validateEmail, logActivity, stripHtmlTags, uuidv4 } = require('../utils/functions');

module.exports = {
    create: async (req, res) => {
        const now = Math.floor(Date.now() / 1000);
        const { 
            user_firstname, 
            user_lastname, 
            user_email, 
            user_phone, 
            user_role,
            password
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //get encrypted user password
            const encPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET).toString();

            //check if user email exists
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_email = ? LIMIT 1", [user_email]);

            if(users.length > 0)
            {
                throw new Error('Preffered email address already exists');
            }

            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO users 
                (
                    user_firstname, 
                    user_lastname, 
                    user_email, 
                    user_phone, 
                    user_role, 
                    plain_password, 
                    enc_password, 
                    user_created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                [
                    user_firstname, 
                    user_lastname, 
                    user_email, 
                    user_phone, 
                    user_role, 
                    password, 
                    encPassword, 
                    now
                ]
            );

            res.json({
                error:false,
                message:'User created successfully'
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    getUsers: async (req, res) => {
        const {
            user_status,
            user_role
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = "SELECT * FROM users WHERE 1 = 1";
        const queryParams = [];

        let query2 = "SELECT COUNT(*) AS total_records FROM users WHERE 1 = 1";
        const queryParams2 = [];

        if(user_role)
        {
            query += " AND user_role = ?";
            queryParams.push(user_role);

            query2 += " AND user_role = ?";
            queryParams2.push(user_role);
        }

        if(user_status)
        {
            query += ' AND user_status = ?';
            queryParams.push(user_status);
            
            query2 += ' AND user_status = ?';
            queryParams2.push(user_status);
        }

        query += " ORDER BY user_id DESC";

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
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    getUser: async (req, res) => {
        const userID = req.params.user_id;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_id = ? LIMIT 1", [userID]);

            if(users.length == 0)
            {
                throw new Error('User not found');
            }

            res.json({
                error:false,
                user:users[0]
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
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
            'user_id', 
            'user_firstname', 
            'user_lastname', 
            'user_role', 
            'user_phone', 
            'user_email', 
            'user_created_at', 
            'user_status'
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
            user_role, 
            user_status 
        } = req.query;

        let query = "SELECT * FROM users WHERE 1 = 1";
        const queryParams = [];

        if(user_role)
        {
            query += ' AND user_role = ?';
            queryParams.push(user_role);
        }

        if(user_status)
        {
            query += ' AND user_status = ?';
            queryParams.push(user_status);
        }

        query += ' ORDER BY user_id DESC'; 

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
                    rtData[i].DT_RowId = rtData[i].user_id;
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
    update: async (req, res) => {
        const userID = req.params.user_id;
        const { 
            user_firstname, 
            user_lastname, 
            user_email, 
            user_phone, 
            user_status, 
            user_role
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_id = ? LIMIT 1", [userID]);

            if(users.length == 0)
            {
                throw new Error('User not found');
            }

            const user = users[0];

            const users1 = await util.promisify(connection.query).bind(connection)("SELECT user_id FROM users WHERE user_email = ? AND user_id != ? LIMIT 1", [user_email, userID]);

            if(users1.length > 0)
            {
                throw new Error('The preffered email address already exists')
            }

            let updateQuery = `
                UPDATE 
                    users 
                SET 
                    user_firstname = ?, 
                    user_lastname = ?, 
                    user_email = ?, 
                    user_phone = ?, 
                    user_role = ?,
                    user_status = ?
                WHERE
                    user_id = ?
            `
            let updateQueryParams = [
                user_firstname, 
                user_lastname, 
                user_email, 
                user_phone, 
                user_role, 
                user_status,
                userID
            ];

            await util.promisify(connection.query).bind(connection)(updateQuery, updateQueryParams);

            res.json({
                error:false,
                message:'User updated successfully'
            })
        }
        catch(e)
        {
            console.log(e.stack)
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    delete: async (req, res) => {
        const userID = req.params.user_id;
        
        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_id = ? LIMIT 1", [userID]);

            if(users.length == 0)
            {
                throw new Error('User not found')
            }

            const user = users[0];

            await util.promisify(connection.query).bind(connection)("DELETE FROM users WHERE user_id = ?", [userID]);

            res.json({
                error:false,
                message:'User deleted successfully'
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    }
}
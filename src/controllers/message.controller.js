const db = require('../utils/dbConfig');
const util = require('util');

module.exports = {
    create: async(req, res) => {
        const {
            sender,
            sender_email,
            sender_phone,
            subject,
            message
        } = req.body;

        const now = Math.floor(Date.now() / 1000);
        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //insert message into database
            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO messages 
                (
                    sender,
                    sender_phone,
                    sender_email,
                    subject,
                    message,
                    message_created_at
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [ 
                sender, 
                sender_phone, 
                sender_email, 
                subject, 
                message,
                now
            ]);

            res.json({
                error: false,
                message: `Message sent successfully. We will get back to you as soon as possible`
            })
        }
        catch(e)
        {
            res.json({
                error: true,
                messsage:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    getMessages: async (req, res) => {
        const {
            message_status
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `SELECT * FROM messages WHERE 1 = 1`;
        const queryParams = [];

        let query2 = `SELECT COUNT(*) AS total_records FROM messages WHERE 1 = 1`;
        const queryParams2 = [];

        if(message_status)
        {
            query += " AND message_status = ?";
            queryParams.push(message_status);

            query2 += " AND message_status = ?";
            queryParams2.push(message_status);
        }

        query += " ORDER BY message_id DESC";

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
            'message_id',
            'sender',
            'sender_phone',
            'sender_email',
            'subject',
            'message_created_at',
            'message_status'
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
            message_status
        } = req.query;

        let query = `SELECT * FROM messages WHERE 1 = 1`;
        const queryParams = [];

        if(message_status)
        {
            query += " AND message_status = ?";
            queryParams.push(message_status);
        }

        query += " ORDER BY message_status DESC";

        const connection = await util.promisify(db.getConnection).bind(db)();
        
        try
        {    
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);
            //console.log(query, queryParams)

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
                    rtData[i].DT_RowId = rtData[i].message_id;
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
    getMessage: async (req, res) => {
        const messageID = req.params.message_id;

        let query = `SELECT * FROM messages WHERE message_id = ? 
            LIMIT 1
        `;
        const queryParams = [messageID];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const messages = await util.promisify(connection.query).bind(connection)(query, queryParams);

            if(messages.length === 0)
            {
                throw new Error("Message not found")
            }

            const message = messages[0];

            //if the message exists it means it has been read. Mark it as read
            await util.promisify(connection.query).bind(connection)(`
                UPDATE messages
                SET
                    message_status = 'Read'
                WHERE
                    message_id = ?
            `, [ messageID ]);
            
            res.json({
                error:false,
                message
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
    deleteMessage: async (req, res) => {

        const { message_id } = req.params;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if message exists
            const messages = await util.promisify(connection.query).bind(connection)(`
                SELECT * FROM messages WHERE message_id = ? LIMIT 1
            `, [message_id]);

            if(messages.length === 0)
            {
                throw new Error(`Message not found.`)
            }

            //delete query
            let query = `DELETE FROM messages WHERE message_id = ?`; 
            const queryParams = [ message_id ];

            //delete the message
            await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error: false,
                message: 'Message deleted successfully'
            })
        }
        catch(e)
        {
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
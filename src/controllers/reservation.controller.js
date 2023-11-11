const db = require('../utils/dbConfig');
const util = require('util');
const moment = require('moment');

module.exports = {
    create: async (req, res) => {
        const {
            room_category_id,
            check_in_date,
            check_out_date,
            customer_fullname,
            customer_email,
            customer_phone,
            adults_per_room,
            children_per_room,
            no_of_rooms,
            remarks
        } = req.body;

        const now = Math.floor(Date.now() / 1000);

        const checkIn = moment(check_in_date, 'YYYY-MM-DD').startOf('day');
        const checkOut = moment(check_out_date, 'YYYY-MM-DD').startOf('day');
        const reservedDays = checkOut.diff(checkIn, 'days') === 0 ? 1 : checkOut.diff(checkIn, 'days');

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if room category exists and get all details
            const rooms = await util.promisify(connection.query).bind(connection)("SELECT * FROM room_categories WHERE room_category_id = ? LIMIT 1", [ room_category_id]);

            if(rooms.length === 0)
            {
                throw new Error("The preffered room category does not exist");
            }

            const room = rooms[0];
            const totalAmount = room.room_category_price * no_of_rooms * reservedDays;

            //count number of available rooms in this category to check for availability
            const sum = await util.promisify(connection.query).bind(connection)(`
                SELECT SUM(no_of_rooms) AS total_reserved 
                FROM reservations 
                WHERE (
                    ? BETWEEN check_in_date AND check_out_date
                    OR ? BETWEEN check_in_date AND check_out_date
                    OR check_in_date BETWEEN ? AND ?
                    OR check_out_date BETWEEN ? AND ?
                )
                AND room_category_id = ? 
                AND reservation_status = 'Reserved'`, 
                [ 
                    check_in_date,
                    check_out_date,
                    check_in_date,
                    check_out_date,
                    check_in_date,
                    check_out_date,
                    room_category_id 
                ]
            );

            const totalBooked = sum[0].total_reserved || 0;
            const availableRooms = parseInt(room.no_of_rooms) - totalBooked;

            if(parseInt(no_of_rooms) > availableRooms)
            {
                throw new Error(`${room.room_category_name} has ${availableRooms} unreserved rooms(s) currently available for the provided dates`)
            }

            //insert reservation into database
            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO reservations 
                (
                    room_category_id,
                    check_in_date,
                    check_out_date,
                    reservation_timestamp,
                    total_amount,
                    customer_fullname,
                    customer_email,
                    customer_phone,
                    adults_per_room,
                    children_per_room,
                    no_of_rooms,
                    remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                room_category_id,
                check_in_date,
                check_out_date,
                now,
                totalAmount,
                customer_fullname,
                customer_email,
                customer_phone,
                adults_per_room,
                children_per_room,
                no_of_rooms,
                remarks
            ]);

            res.json({
                error:false,
                message:"Reservation submitted successfully"
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
    getReservations: async (req, res) => {
        const {
            room_category_id,
            check_in_date,
            check_out_date,
            reservation_date,
            from_check_in_date,
            to_check_in_date,
            from_check_out_date,
            to_check_out_date,
            from_reservation_date,
            to_reservation_date,
            reservation_status
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT a.*, b.room_category_name 
            FROM reservations a 
            LEFT JOIN room_categories b 
            ON a.room_category_id = b.room_category_id 
            WHERE 1 = 1
        `;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM reservations a 
            LEFT JOIN room_categories b 
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

        if(check_in_date)
        {
            query += " AND a.check_in_date = ?";
            queryParams.push(check_in_date);

            query2 += " AND a.check_in_date = ?";
            queryParams2.push(check_in_date);
        }

        if(check_out_date)
        {
            query += " AND a.check_out_date = ?";
            queryParams.push(check_out_date);

            query2 += " AND a.check_out_date = ?";
            queryParams2.push(check_out_date);
        }
        
        if(reservation_date)
        {
            query += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') = ?";
            queryParams.push(reservation_date);

            query2 += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') = ?";
            queryParams2.push(reservation_date);
        }

        if(from_reservation_date)
        {
            query += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') >= ?";
            queryParams.push(from_reservation_date);

            query2 += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') >= ?";
            queryParams2.push(from_reservation_date);
        }

        if(to_reservation_date)
        {
            query += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') <= ?";
            queryParams.push(to_reservation_date);

            query2 += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') <= ?";
            queryParams2.push(to_reservation_date);
        }

        if(from_check_in_date)
        {
            query += " AND a.check_in_date >= ?";
            queryParams.push(from_check_in_date);

            query2 += " AND a.check_in_date >= ?";
            queryParams2.push(from_check_in_date);
        }

        if(to_check_in_date)
        {
            query += " AND a.check_in_date <= ?";
            queryParams.push(to_check_in_date);

            query2 += " AND a.check_in_date <= ?";
            queryParams2.push(to_check_in_date);
        }

        if(from_check_out_date)
        {
            query += " AND a.check_out_date >= ?";
            queryParams.push(from_check_out_date);

            query2 += " AND a.check_out_date >= ?";
            queryParams2.push(from_check_out_date);
        }

        if(to_check_out_date)
        {
            query += " AND a.check_out_date <= ?";
            queryParams.push(to_check_out_date);

            query2 += " AND a.check_out_date <= ?";
            queryParams2.push(to_check_out_date);
        }

        if(reservation_status)
        {
            query += " AND a.reservation_status = ?";
            queryParams.push(reservation_status);

            query2 += " AND a.reservation_status = ?";
            queryParams2.push(reservation_status);
        }

        query += " ORDER BY reservation_id DESC";

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
            'reservation_id',
            'room_category_id',
            'check_in_date',
            'check_out_date',
            'reservation_timestamp',
            'total_amount',
            'customer_fullname',
            'customer_email',
            'customer_phone',
            'adults_per_room',
            'children_per_room',
            'no_of_rooms',
            'reservation_status',
            'room_category_name'
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
            check_in_date,
            check_out_date,
            reservation_date,
            from_check_in_date,
            to_check_in_date,
            from_check_out_date,
            to_check_out_date,
            from_reservation_date,
            to_reservation_date,
            reservation_status
        } = req.query;

        let query = `
            SELECT a.*, b.room_category_name 
            FROM reservations a 
            LEFT JOIN room_categories b 
            ON a.room_category_id = b.room_category_id 
            WHERE 1 = 1
        `;
        const queryParams = [];

        if(room_category_id)
        {
            query += " AND a.room_category_id = ?";
            queryParams.push(room_category_id);
        }

        if(check_in_date)
        {
            query += " AND a.check_in_date = ?";
            queryParams.push(check_in_date);
        }

        if(check_out_date)
        {
            query += " AND a.check_out_date = ?";
            queryParams.push(check_out_date);
        }
        
        if(reservation_date)
        {
            query += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') = ?";
            queryParams.push(reservation_date);
        }

        if(from_reservation_date)
        {
            query += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') >= ?";
            queryParams.push(from_reservation_date);
        }

        if(to_reservation_date)
        {
            query += " AND FROM_UNIXTIME(a.reservation_timestamp,'%Y-%m-%d') <= ?";
            queryParams.push(to_reservation_date);
        }

        if(from_check_in_date)
        {
            query += " AND a.check_in_date >= ?";
            queryParams.push(from_check_in_date);
        }

        if(to_check_in_date)
        {
            query += " AND a.check_in_date <= ?";
            queryParams.push(to_check_in_date);
        }

        if(from_check_out_date)
        {
            query += " AND a.check_out_date >= ?";
            queryParams.push(from_check_out_date);
        }

        if(to_check_out_date)
        {
            query += " AND a.check_out_date <= ?";
            queryParams.push(to_check_out_date);
        }

        /* if(reservation_status)
        {
            query += " AND a.reservation_status = ?";
            queryParams.push(reservation_status);
        } */

        query += " ORDER BY a.reservation_id DESC";

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
                    rtData[i].DT_RowId = rtData[i].reservation_id;
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
    getReservation: async (req, res) => {
        const reservationID = req.params.reservation_id;

        let query = `
            SELECT a.*, b.room_category_name 
            FROM reservations a 
            LEFT JOIN room_categories b 
            ON a.room_category_id = b.room_category_id 
            WHERE a.reservation_id = ? 
            LIMIT 1
        `;
        const queryParams = [reservationID];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const reservations = await util.promisify(connection.query).bind(connection)(query, queryParams);

            if(reservations.length === 0)
            {
                throw new Error("Reservation not found")
            }

            const reservation = reservations[0];
            
            res.json({
                error:false,
                reservation
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
    deleteReservation: async (req, res) => {

        const { reservation_id } = req.params;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if reservation exists
            const reservations = await util.promisify(connection.query).bind(connection)(`
                SELECT a.*, b.booking_id 
                FROM reservations a LEFT JOIN bookings b 
                ON a.reservation_id = b.reservation_id 
                WHERE a.reservation_id = ? 
                LIMIT 1
            `, [reservation_id]);

            if(reservations.length === 0)
            {
                throw new Error(`Reservation not found.`)
            }

            if(reservations[0].booking_id)
            {
                throw new Error("Booking existing for this reservation. Call administrator")
            }

            //delete query
            let query = `DELETE FROM reservations WHERE reservation_id = ?`; 
            const queryParams = [ reservation_id ];

            //delete the reservation
            await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error: false,
                message: 'Reservation deleted successfully'
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
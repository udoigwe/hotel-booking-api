const db = require('../utils/dbConfig');
const util = require('util');

module.exports = {
    createBooking: async (req, res) => {
        const {
            reservation_id,
            amount_paid,
            remarks
        } = req.body;

        const now = Math.floor(Date.now() / 1000);

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //Start database transaction
            await util.promisify(connection.query).bind(connection)("START TRANSACTION");

            //check if reservation exists
            const reservations = await util.promisify(connection.query).bind(connection)(`
                SELECT a.*, b.room_category_name, b.no_of_rooms AS room_category_total_rooms
                FROM reservations a LEFT JOIN room_categories b
                ON a.room_category_id = b.room_category_id
                WHERE a.reservation_id = ? LIMIT 1
            `, [ reservation_id ]);

            if(reservations.length === 0)
            {
                throw new Error("Reservation not found");
            }

            const reservation = reservations[0];

            //check if booking exists for this reservation
            const bookings = await util.promisify(connection.query).bind(connection)(`
                SELECT booking_id FROM bookings WHERE reservation_id = ? LIMIT 1
            `, [ reservation_id ]);

            if(bookings.length > 0)
            {
                throw new Error(`This reservation is already booked`);
            }

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
                    reservation.check_in_date,
                    reservation.check_out_date,
                    reservation.check_in_date,
                    reservation.check_out_date,
                    reservation.check_in_date,
                    reservation.check_out_date,
                    reservation.room_category_id 
                ]
            );

            const totalBooked = sum[0].total_reserved || 0;
            const availableRooms = parseInt(reservation.room_category_total_rooms) - totalBooked;

            if(parseInt(reservation.no_of_rooms) > availableRooms)
            {
                throw new Error(`${reservation.room_category_name} has ${availableRooms} unreserved rooms(s) currently available for the provided dates`)
            }

            const balance = parseFloat(reservation.total_amount) - parseFloat(amount_paid);

            /* update reservation and create a new booking */
            await util.promisify(connection.query).bind(connection)(`
                UPDATE reservations
                SET reservation_status = 'Reserved'
                WHERE reservation_id = ?
            `, [ reservation_id ]);

            await util.promisify(connection.query).bind(connection)(`
                INSERT INTO bookings 
                (
                    reservation_id,
                    booking_timestamp,
                    expected_amount,
                    amount_paid,
                    balance,
                    remarks
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [ 
                reservation_id,
                now,
                reservation.total_amount,
                amount_paid,
                balance,
                remarks
            ])

            //commit to database
            await util.promisify(connection.query).bind(connection)(`COMMIT`)

            res.json({
                error: false,
                message: "Reservation booked successfully"
            })
        }
        catch(e)
        {
            //rollback from database
            await util.promisify(connection.query).bind(connection)(`ROLLBACK`);

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
    getBookings: async (req, res) => {
        const {
            reservation_id,
            booking_date,
            from_booking_date,
            to_booking_date,
            booking_status,
            room_category_id,
            check_in_date,
            check_out_date,
            from_check_in_date,
            to_check_in_date,
            from_check_out_date,
            to_check_out_date
        } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT a.*, b.*, c.room_category_name 
            FROM bookings a 
            LEFT JOIN reservations b 
            ON a.reservation_id = b.reservation_id
            LEFT JOIN room_categories c
            ON b.room_category_id = c.room_category_id 
            WHERE 1 = 1
        `;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM bookings a 
            LEFT JOIN reservations b 
            ON a.reservation_id = b.reservation_id 
            LEFT JOIN room_categories c
            ON b.room_category_id = c.room_category_id 
            WHERE 1 = 1
        `;
        const queryParams2 = [];

        if(reservation_id)
        {
            query += " AND a.reservation_id = ?";
            queryParams.push(reservation_id);

            query2 += " AND a.reservation_id = ?";
            queryParams2.push(reservation_id);
        }

        if(booking_date)
        {
            query += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') = ?";
            queryParams.push(booking_date);

            query2 += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') = ?";
            queryParams2.push(booking_date);
        }

        if(from_booking_date)
        {
            query += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') >= ?";
            queryParams.push(from_booking_date);

            query2 += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') >= ?";
            queryParams2.push(from_booking_date);
        }

        if(to_booking_date)
        {
            query += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') <= ?";
            queryParams.push(to_booking_date);

            query2 += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') <= ?";
            queryParams2.push(to_booking_date);
        }

        if(booking_status)
        {
            query += " AND a.booking_status = ?";
            queryParams.push(booking_status);

            query2 += " AND a.booking_status = ?";
            queryParams2.push(booking_status);
        }

        if(room_category_id)
        {
            query += " AND b.room_category_id = ?";
            queryParams.push(room_category_id);

            query2 += " AND b.room_category_id = ?";
            queryParams2.push(room_category_id);
        }

        if(check_in_date)
        {
            query += " AND b.check_in_date = ?";
            queryParams.push(check_in_date);

            query2 += " AND b.check_in_date = ?";
            queryParams2.push(check_in_date);
        }

        if(check_out_date)
        {
            query += " AND b.check_out_date = ?";
            queryParams.push(check_out_date);

            query2 += " AND b.check_out_date = ?";
            queryParams2.push(check_out_date);
        }

        if(from_check_in_date)
        {
            query += " AND b.check_in_date >= ?";
            queryParams.push(from_check_in_date);

            query2 += " AND b.check_in_date >= ?";
            queryParams2.push(from_check_in_date);
        }

        if(to_check_in_date)
        {
            query += " AND b.check_in_date <= ?";
            queryParams.push(to_check_in_date);

            query2 += " AND b.check_in_date <= ?";
            queryParams2.push(to_check_in_date);
        }

        if(from_check_out_date)
        {
            query += " AND b.check_out_date >= ?";
            queryParams.push(from_check_out_date);

            query2 += " AND b.check_out_date >= ?";
            queryParams2.push(from_check_out_date);
        }

        if(to_check_out_date)
        {
            query += " AND b.check_out_date <= ?";
            queryParams.push(to_check_out_date);

            query2 += " AND b.check_out_date <= ?";
            queryParams2.push(to_check_out_date);
        }

        query += " ORDER BY booking_id DESC";

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
            'booking_id',
            'check_in_date',
            'check_out_date',
            'booking_timestamp',
            'expected_amount',
            'amount_paid',
            'balance',
            'customer_fullname',
            'customer_email',
            'customer_phone',
            'no_of_rooms',
            'booking_status',
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
            reservation_id,
            booking_date,
            from_booking_date,
            to_booking_date,
            booking_status,
            room_category_id,
            check_in_date,
            check_out_date,
            from_check_in_date,
            to_check_in_date,
            from_check_out_date,
            to_check_out_date
        } = req.query;

        let query = `
            SELECT 
                a.*,

                b.room_category_id, 
                b.check_in_date, 
                b.check_out_date, 
                b.customer_fullname, 
                b.customer_phone, 
                b.customer_email, 
                b.no_of_rooms,

                c.room_category_name 
            FROM bookings a 
            LEFT JOIN reservations b 
            ON a.reservation_id = b.reservation_id
            LEFT JOIN room_categories c
            ON b.room_category_id = c.room_category_id 
            WHERE 1 = 1
        `;
        const queryParams = [];

        if(reservation_id)
        {
            query += " AND a.reservation_id = ?";
            queryParams.push(reservation_id);
        }

        if(booking_date)
        {
            query += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') = ?";
            queryParams.push(booking_date);
        }

        if(from_booking_date)
        {
            query += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') >= ?";
            queryParams.push(from_booking_date);
        }

        if(to_booking_date)
        {
            query += " AND FROM_UNIXTIME(a.booking_timestamp,'%Y-%m-%d') <= ?";
            queryParams.push(to_booking_date);
        }

        /* if(booking_status)
        {
            query += " AND a.booking_status = ?";
            queryParams.push(booking_status);
        } */

        if(room_category_id)
        {
            query += " AND b.room_category_id = ?";
            queryParams.push(room_category_id);
        }

        if(check_in_date)
        {
            query += " AND b.check_in_date = ?";
            queryParams.push(check_in_date);
        }

        if(check_out_date)
        {
            query += " AND b.check_out_date = ?";
            queryParams.push(check_out_date);
        }

        if(from_check_in_date)
        {
            query += " AND b.check_in_date >= ?";
            queryParams.push(from_check_in_date);
        }

        if(to_check_in_date)
        {
            query += " AND b.check_in_date <= ?";
            queryParams.push(to_check_in_date);
        }

        if(from_check_out_date)
        {
            query += " AND b.check_out_date >= ?";
            queryParams.push(from_check_out_date);
        }

        if(to_check_out_date)
        {
            query += " AND b.check_out_date <= ?";
            queryParams.push(to_check_out_date);
        }

        query += " ORDER BY booking_id DESC";

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
                    rtData[i].DT_RowId = rtData[i].booking_id;
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
    getBooking: async (req, res) => {
        const bookingID = req.params.booking_id;

        let query = `
            SELECT a.*, b.*, c.room_category_name 
            FROM bookings a 
            LEFT JOIN reservations b 
            ON a.reservation_id = b.reservation_id
            LEFT JOIN room_categories c
            ON b.room_category_id = c.room_category_id 
            WHERE a.booking_id = ? 
            LIMIT 1
        `;
        const queryParams = [bookingID];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const bookings = await util.promisify(connection.query).bind(connection)(query, queryParams);

            if(bookings.length === 0)
            {
                throw new Error("Booking not found")
            }

            const booking = bookings[0];
            
            res.json({
                error:false,
                booking
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
    updateBooking: async (req, res) => {
        const { booking_id } = req.params;
        const {
            booking_status,
            amount_paid,
            remarks
        } = req.body;

        const now = Math.floor(Date.now() / 1000);

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if booking exists
            const bookings = await util.promisify(connection.query).bind(connection)(`SELECT * FROM bookings WHERE booking_id = ? LIMIT 1`, [ booking_id ]);

            if(bookings.length === 0)
            {
                throw new Error(`Booking not found`);
            }

            const booking = bookings[0];
            const amountPaid = booking.balance === 0 ? booking.amount_paid : amount_paid; 
            const balance = booking.balance === 0 ? booking.balance : booking.balance - parseFloat(amount_paid);

            //update booking
            await util.promisify(connection.query).bind(connection)(`
                UPDATE bookings
                SET booking_status = ?, amount_paid = ?, balance = ?, remarks = ?
                WHERE booking_id = ?
            `, [ booking_status, amountPaid, balance, remarks, booking_id ]);

            res.json({
                error: false,
                message:'Booking updated successfully'
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
    deleteBooking: async (req, res) => {

        const { booking_id } = req.params;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //check if booking exists
            const bookings = await util.promisify(connection.query).bind(connection)(`
                SELECT * 
                FROM bookings
                WHERE booking_id = ? 
                LIMIT 1
            `, [booking_id]);

            if(bookings.length === 0)
            {
                throw new Error(`Booking not found.`)
            }

            //delete query
            let query = `DELETE FROM bookings WHERE booking_id = ?`; 
            const queryParams = [ booking_id ];

            //delete the booking
            await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error: false,
                message: 'Booking deleted successfully'
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
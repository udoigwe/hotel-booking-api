const db = require('../utils/dbConfig');
const util = require('util');
const moment = require('moment');
const { sumArray } = require('../utils/functions');

module.exports = {
    dashboard: async (req, res) => {
        const year = moment().format('YYYY');
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const reservedArray = [];
        const unreservedArray = [];
        const monthLabelsArray = [];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            //get user count
            const users = await util.promisify(connection.query).bind(connection)(`SELECT COUNT(*) AS user_count FROM users`);
            //get room features count
            const features =  await util.promisify(connection.query).bind(connection)(`SELECT COUNT(*) AS feature_count FROM room_features`);
            //get image gallery count
            const images =  await util.promisify(connection.query).bind(connection)(`SELECT COUNT(*) AS image_count FROM room_category_images`);
            //get room categories count
            const rooms =  await util.promisify(connection.query).bind(connection)(`SELECT COUNT(*) AS room_count FROM room_categories`);
            //get reservations
            const reservations =  await util.promisify(connection.query).bind(connection)(`
                SELECT a.*, b.room_category_name 
                FROM reservations a 
                LEFT JOIN room_categories b 
                ON a.room_category_id = b.room_category_id
                WHERE FROM_UNIXTIME(a.reservation_timestamp,'%Y') = '${year}'
            `);
            //get bookings
            const bookings =  await util.promisify(connection.query).bind(connection)(`SELECT COUNT(*) AS booking_count FROM bookings`);
            //get messages count
            const messages =  await util.promisify(connection.query).bind(connection)(`SELECT COUNT(*) AS unread_count FROM messages WHERE message_status = 'Unread'`);
            //get reservations count
            const unreserved =  await util.promisify(connection.query).bind(connection)(`SELECT COUNT(*) AS unreserved_count FROM reservations WHERE reservation_status = 'Unreserved'`);

            //get reservation chart data
            for(let i = 0; i < months.length; i++)
            {
                const month = months[i];

                const period = year + "-" + month;
                let reserved = 0;
                let unreserved = 0;
                let formattedMonth = moment(period).format('MMM');

                for(let j = 0; j < reservations.length; j++)
                {
                    const reservation = reservations[j];

                    if(moment.unix(reservation.reservation_timestamp).format('YYYY-MM') === period && reservation.reservation_status === "Unreserved")
                    {
                        unreserved++;
                    }
    
                    if(moment.unix(reservation.reservation_timestamp).format('YYYY-MM') === period && reservation.reservation_status === "Reserved")
                    {
                        reserved++;
                    }
                }

                unreservedArray.push(unreserved);
                reservedArray.push(reserved);
                monthLabelsArray.push(formattedMonth);
            }

            var totalReservations = sumArray([reservedArray, unreservedArray]);

            const chartData = {
                unreserved_data: unreservedArray,
                reserved_data: reservedArray,
                months_data: monthLabelsArray,
                total_reservations: totalReservations
            }

            const dashboard = {
                user_count: users[0].user_count,
                feature_count: features[0].feature_count,
                image_count: images[0].image_count,
                room_count: rooms[0].room_count,
                booking_count: bookings[0].booking_count,
                reservations: reservations.slice(0, 10),
                chart_data: chartData,
                unread_count: messages[0].unread_count,
                unreserved_count: unreserved[0].unreserved_count,
            }

            res.json({
                error: false,
                dashboard
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
const { body, param } = require("express-validator");
const moment = require('moment');
const { isValidDate } = require("../utils/functions");

module.exports = {
    create: [
        body("room_category_id")
			.exists({ checkFalsy: true })
			.withMessage("Room Category ID is required")
            .isNumeric()
            .withMessage("Room Category ID must be a number"),
		body("check_in_date")
		 	.exists({ checkFalsy: true})
			.withMessage("Checkin Date is required")
            .isDate({ format: "YYYY-MM-DD" })
            .withMessage("Checkin Time must be a valid date string with format 'YYYY-MM-DD'")
            .custom((value, { req }) => {
                const dateFormat = 'YYYY-MM-DD';
                const checkinDate = moment(value, dateFormat).startOf('day');
                const today = moment().startOf('day');
                const checkoutDate = req.body.check_out_date && isValidDate(req.body.check_out_date) ? moment(req.body.check_out_date, dateFormat).startOf('day') : null;

                if(!checkoutDate)
                {
                    throw new Error("Checkout Date is required and must be a valid date string")
                }
                
                if(today > checkinDate)
                {
                    throw new Error("Your Checkin date cannot be in the past");
                }

                if(checkinDate > checkoutDate)
                {
                    throw new Error("Your Checkin date cannot be later than your Checkout date");
                }

                return true; // validation passed
            }),
        body("check_out_date")
            .exists({ checkFalsy: true})
           .withMessage("Checkout Time is required")
           .isDate({ format: "YYYY-MM-DD" })
           .withMessage("Checkout time must be a valid date string with format 'YYYY-MM-DD'")
           .custom((value, { req }) => {
                const dateFormat = 'YYYY-MM-DD';
                const checkoutDate = moment(value, dateFormat).startOf('day');
                const today = moment().startOf('day');
                const checkinDate = req.body.check_in_date && isValidDate(req.body.check_in_date) ? moment(req.body.check_in_date, dateFormat).startOf('day') : null;
                
                if(!checkinDate)
                {
                    throw new Error("Check-in Date is required and must be a valid date string")
                }
                
                if(today > checkoutDate)
                {
                    //your checkin date cannot be in the past
                    throw new Error("Your Check-out date cannot be in the past");
                }

                if(checkoutDate < checkinDate)
                {
                    throw new Error("Your Check-out date cannot be earlier than your Check-in date");
                }

                return true; // validation passed
            }),
        body("customer_fullname")
            .exists({ checkFalsy: true })
            .withMessage("Customer full name is required"),
        body("customer_email")
            .exists({ checkFalsy: true })
            .withMessage("Customer Email is required")
            .isEmail()
            .withMessage("Customer Email must be a valid email address"),
        body("customer_phone")
            .exists({ checkFalsy: true })
            .withMessage("Customer Phone number is required"),
        body("adults_per_room")
            .exists({ checkFalsy: true })
            .withMessage("Number of adults per room is required"),
        body("children_per_room")
            .exists({ checkFalsy: true })
            .withMessage("Number of children per room is required"),
        body("no_of_rooms")
            .exists({ checkFalsy: true })
            .withMessage("Number of Rooms is required")
            .isNumeric()
            .withMessage("Number of Rooms must be a number")
    ],
    getReservation: [
        param("reservation_id")
            .exists({ checkFalsy: true })
            .withMessage("Reservation ID is required")
            .isNumeric()
            .withMessage("Reservation ID must be a number")
    ],
    deleteReservation: [
        param("reservation_id")
            .exists({ checkFalsy: true })
            .withMessage("Reservation ID is required")
            .isNumeric()
            .withMessage("Reservation ID must be a number")
    ],
}
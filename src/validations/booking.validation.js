const { body, param } = require("express-validator");
const moment = require('moment');
const { isDateFormat } = require("../utils/functions");

module.exports = {
    createBooking: [
        body("reservation_id")
			.exists({ checkFalsy: true })
			.withMessage("Reservation ID is required")
            .isNumeric()
            .withMessage("Reservation ID must be a number"),
		body("amount_paid")
		 	.exists({ checkFalsy: true})
			.withMessage("Amount Paid is required")
            .isNumeric()
            .withMessage("Amount paid must be numbers only")
    ],
    getBooking: [
        param("booking_id")
            .exists({ checkFalsy: true })
            .withMessage("Booking ID is required")
            .isNumeric()
            .withMessage("Booking ID must be a number")
    ],
    updateBooking: [
        param("booking_id")
            .exists({ checkFalsy: true })
            .withMessage("Booking ID is required")
            .isNumeric()
            .withMessage("Booking ID must be a number"),
        body("booking_status")
			.exists({ checkFalsy: true })
			.withMessage("Booking Status is required")
            .isIn(["Active", "Inactive"])
            .withMessage("Booking Status must be Active or Inactive"),
		body("amount_paid")
		 	.exists({ checkFalsy: true})
			.withMessage("Amount Paid is required")
            .isNumeric()
            .withMessage("Amount paid must be numbers only")
    ],
    deleteBooking: [
        param("booking_id")
            .exists({ checkFalsy: true })
            .withMessage("Booking ID is required")
            .isNumeric()
            .withMessage("Booking ID must be a number")
    ],
}
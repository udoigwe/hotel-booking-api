const { body, param } = require("express-validator");

module.exports = {
    create: [
        body("sender")
			.exists({ checkFalsy: true })
			.withMessage("Sender Name is required"),
		body("sender_email")
		 	.exists({ checkFalsy: true})
			.withMessage("Sender Email is required")
            .isEmail()
            .withMessage("Sender Email must be a valid email address"),
        body("sender_phone")
            .exists({ checkFalsy: true})
           .withMessage("Sender Phone Number is required"),
        body("subject")
            .exists({ checkFalsy: true })
            .withMessage("Subject is required"),
        body("message")
            .exists({ checkFalsy: true })
            .withMessage("Message is required"),
    ],
    getMessage: [
        param("message_id")
            .exists({ checkFalsy: true })
            .withMessage("Message ID is required")
            .isNumeric()
            .withMessage("Message ID must be a number")
    ],
    deleteMessage: [
        param("message_id")
            .exists({ checkFalsy: true })
            .withMessage("Message ID is required")
            .isNumeric()
            .withMessage("Message ID must be a number")
    ],
}
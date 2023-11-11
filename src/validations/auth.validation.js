const { body} = require("express-validator");

module.exports = {
    signUp: [
		body("user_firstname")
			.exists({ checkFalsy: true })
			.withMessage("User First Name is required"),
		body("user_lastname")
		 	.exists({ checkFalsy: true})
			.withMessage("User Last Name is required"),
        body("user_email")
            .exists({ checkFalsy: true })
            .withMessage("User Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address"),
        body("user_phone")
            .exists({ checkFalsy: true })
            .withMessage("User Phone is required"),
        body("password")
            .exists({ checkFalsy: true })
            .withMessage("Password is required")
	],
    login: [
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address"),
        body("password")
            .exists({ checkFalsy: true })
            .withMessage("Password is required")
    ],
    updateAccount: [
		body("user_firstname")
			.exists({ checkFalsy: true })
			.withMessage("User First Name is required"),
		body("user_lastname")
		 	.exists({ checkFalsy: true})
			.withMessage("User Last Name is required"),
        body("user_email")
            .exists({ checkFalsy: true })
            .withMessage("User Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address"),
        body("user_phone")
            .exists({ checkFalsy: true })
            .withMessage("User Phone is required")
	],
    updatePassword: [
		body("current_password")
			.exists({ checkFalsy: true })
			.withMessage("Current Password is required"),
		body("new_password")
		 	.exists({ checkFalsy: true})
			.withMessage("New Password is required")
	],
}
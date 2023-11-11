const { body, param } = require("express-validator");

module.exports = {
    createUser: [
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
            .withMessage("User Email must be a valid email address"),
        body("user_phone")
            .exists({ checkFalsy: true })
            .withMessage("User Phone is required"),
        body("user_role")
            .exists({ checkFalsy: true })
            .withMessage("User Role is required")
            .isIn(["Admin", "Super Admin"])
            .withMessage("User must be an Admin or Super Admin"),
        body("password")
            .exists({ checkFalsy: true })
            .withMessage("Password is required"),
	],
    updateUser: [
        param("user_id")
            .exists({ checkFalsy: true })
            .withMessage("User ID is required")
            .isNumeric()
            .withMessage("User ID must be a number"),
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
            .withMessage("User Email must be a valid email address"),
        body("user_phone")
            .exists({ checkFalsy: true })
            .withMessage("User Phone is required"),
        body("user_role")
            .exists({ checkFalsy: true })
            .withMessage("User Role is required")
            .isIn(["Admin", "Super Admin"])
            .withMessage("User must be an Admin or Super Admin"),
        body("user_status")
            .exists({ checkFalsy: true })
            .withMessage("User Status is required")
            .isIn(["Active", "Inactive"])
            .withMessage("User Status must be active or inactive"),
	],
    getUser: [
        param("user_id")
            .exists({ checkFalsy: true })
            .withMessage("User ID is required")
            .isNumeric()
            .withMessage("User ID must be a number")
    ],
    deleteUser: [
        param("user_id")
            .exists({ checkFalsy: true })
            .withMessage("User ID is required")
            .isNumeric()
            .withMessage("User ID must be a number")
    ],
}
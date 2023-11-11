const { body, param } = require("express-validator");

module.exports = {
    createRoomCategory: [
		body("room_category_name")
			.exists({ checkFalsy: true })
			.withMessage("Room Category Name is required"),
		body("room_category_price")
		 	.exists({ checkFalsy: true})
			.withMessage("Room Category price is required"),
        body("room_category_short_desc")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Short Desc is required"),
        body("room_category_long_desc")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Long Desc is required"),
        body("no_of_rooms")
            .exists({ checkFalsy: true })
            .withMessage("Number of Rooms is required")
            .isNumeric()
            .withMessage("Number of Rooms must be a number"),
        body("features")
            .exists({ checkFalsy: true })
            .withMessage("Features is required")
            .isJSON()
            .withMessage("Features must be a JSON object or an array"),
	],
    updateRoomCategory: [
        param("room_category_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category ID is required")
            .isNumeric()
            .withMessage("Room Category ID must be a number"),
		body("room_category_name")
			.exists({ checkFalsy: true })
			.withMessage("Room Category Name is required"),
		body("room_category_price")
		 	.exists({ checkFalsy: true})
			.withMessage("Room Category price is required"),
        body("room_category_short_desc")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Short Desc is required"),
        body("room_category_long_desc")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Long Desc is required"),
        body("no_of_rooms")
            .exists({ checkFalsy: true })
            .withMessage("Number of Rooms is required")
            .isNumeric()
            .withMessage("Number of Rooms must be a number"),
        body("features")
            .exists({ checkFalsy: true })
            .withMessage("Features is required")
            .isJSON()
            .withMessage("Features must be a JSON object or an array"),
        body("room_category_status")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Status is required")
            .isIn(["Active", "Inactive"])
            .withMessage("Room Category Status must be active or inactive")
	],
    singleRoomCategory: [
        param("room_category_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category ID is required")
            .isNumeric()
            .withMessage("Room Category ID must be a number")
    ],
    deleteRoomCategory: [
        param("room_category_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category ID is required")
            .isNumeric()
            .withMessage("Room Category ID must be a number")
    ],
}
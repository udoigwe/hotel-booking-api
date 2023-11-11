const { body, param } = require("express-validator");

module.exports = {
    createRoomCategoryImages: [
        body("room_category_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category ID is required")
            .isNumeric()
            .withMessage("Room Category ID must be a number"),
    ],
    getSingleRoomCategoryImage: [
        param("image_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Image ID is required")
            .isNumeric()
            .withMessage("Room Category Image ID must be a number"),
    ],
    updateRoomCategoryImage: [
        param("image_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Image ID is required")
            .isNumeric()
            .withMessage("Room Category Image ID must be a number"),
        body("room_category_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category ID is required")
            .isNumeric()
            .withMessage("Room Category Image ID must be a number"),
        body("room_category_image_status")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Image Status is required")
            .isIn(["Published", "Unpublished"])
            .withMessage("Status must be Published Or Unpublished")
    ],
    deleteRoomCategoryImage: [
        param("image_id")
            .exists({ checkFalsy: true })
            .withMessage("Room Category Image ID is required")
            .isNumeric()
            .withMessage("Room Category Image ID must be a number"),
    ],
    
}
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/images', checkAuth.isAdminCheck, validators.createRoomCategoryImages, imageController.createRoomCategoryImages);
router.get('/images', imageController.getRoomCategoryImages);
router.get('/images/datatable/fetch', checkAuth.isAdminCheck, imageController.getForDataTable);
router.get('/images/:image_id', validators.getSingleRoomCategoryImage, imageController.getSingleRoomCategoryImage);
router.put('/images/:image_id', checkAuth.isAdminCheck, validators.updateRoomCategoryImage, imageController.updateRoomCategoryImage);
router.delete('/images/:image_id', checkAuth.isAdminCheck, validators.deleteRoomCategoryImage, imageController.deleteRoomCategoryImage);

module.exports = router;
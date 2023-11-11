const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/rooms', checkAuth.isAdminCheck, validators.createRoomCategory, roomController.createRoomCategory);
router.get('/rooms', roomController.getRoomCategories);
router.get('/rooms/datatable/fetch', checkAuth.isAdminCheck, roomController.getForDataTable);
router.get('/rooms/:room_category_id', validators.singleRoomCategory, roomController.getRoomCategory);
router.put('/rooms/:room_category_id', checkAuth.isAdminCheck, validators.updateRoomCategory, roomController.updateRoomCategory);
router.delete('/rooms/:room_category_id', checkAuth.isAdminCheck, validators.deleteRoomCategory, roomController.deleteRoomCategory);

module.exports = router;
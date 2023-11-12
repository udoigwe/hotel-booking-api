const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/messages', validators.createMessage, messageController.create);
router.get('/messages', checkAuth.isAdminCheck, messageController.getMessages);
router.get('/messages/datatable/fetch', checkAuth.isAdminCheck, messageController.getForDataTable);
router.get('/messages/:message_id', checkAuth.isAdminCheck, validators.getMessage, messageController.getMessage);
router.delete('/messages/:message_id', checkAuth.isAdminCheck, validators.deleteMessage, messageController.deleteMessage);

module.exports = router;
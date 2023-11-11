const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/users', checkAuth.isAdminCheck, validators.createUser, userController.create);
router.get('/users', userController.getUsers);
router.get('/users/:user_id', validators.getUser, userController.getUser);
router.put('/users/:user_id', checkAuth.isAdminCheck, validators.updateUser, userController.update);
router.delete('/users/:user_id', checkAuth.isAdminCheck, validators.deleteUser, userController.delete);
router.get('/users/datatable/fetch', checkAuth.isAdminCheck, userController.getForDataTable);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/sign-up', validators.signUp, authController.signUp);
router.post('/login', validators.login, authController.login);
router.put('/account-update', checkAuth.verifyToken, validators.updateAccount, authController.updateAccount);
router.post('/password-update', checkAuth.verifyToken, validators.updatePassword, authController.updatePassword);

module.exports = router;
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.get('/dashboard', checkAuth.isAdminCheck, dashboardController.dashboard);

module.exports = router;
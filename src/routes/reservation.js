const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/reservations', validators.createReservation, reservationController.create);
router.get('/reservations', reservationController.getReservations);
router.get('/reservations/datatable/fetch', checkAuth.isAdminCheck, reservationController.getForDataTable);
router.get('/reservations/:reservation_id', validators.getReservation, reservationController.getReservation);
router.delete('/reservations/:reservation_id', checkAuth.isAdminCheck, validators.deleteReservation, reservationController.deleteReservation);

module.exports = router;
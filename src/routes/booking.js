const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/bookings', checkAuth.isAdminCheck, validators.createBooking, bookingController.createBooking);
router.get('/bookings', bookingController.getBookings);
router.get('/bookings/datatable/fetch', checkAuth.isAdminCheck, bookingController.getForDataTable);
router.get('/bookings/:booking_id', validators.getBooking, bookingController.getBooking);
router.put('/bookings/:booking_id', checkAuth.isAdminCheck, validators.updateBooking, bookingController.updateBooking);
router.delete('/bookings/:booking_id', checkAuth.isAdminCheck, validators.deleteBooking, bookingController.deleteBooking);

module.exports = router;
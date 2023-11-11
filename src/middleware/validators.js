const { validate } = require('../utils/functions');
const authValidations = require('../validations/auth.validation');
const roomValidations = require('../validations/room.validation');
const imageValidations = require('../validations/image.validation');
const reservationValidation = require('../validations/reservation.validation');
const bookingValidations = require('../validations/booking.validation');
const userValidations = require('../validations/user.validation');

module.exports = {
    /* Auth route validators */
    signUp: validate(authValidations.signUp),
    login: validate(authValidations.login),
    updateAccount: validate(authValidations.updateAccount),
    updatePassword: validate(authValidations.updatePassword),

    /* Room route validators */
    createRoomCategory: validate(roomValidations.createRoomCategory),
    updateRoomCategory: validate(roomValidations.updateRoomCategory),
    singleRoomCategory: validate(roomValidations.singleRoomCategory),
    deleteRoomCategory: validate(roomValidations.deleteRoomCategory),

    /* Room images route validators */
    createRoomCategoryImages: validate(imageValidations.createRoomCategoryImages),
    getSingleRoomCategoryImage: validate(imageValidations.getSingleRoomCategoryImage),
    updateRoomCategoryImage: validate(imageValidations.updateRoomCategoryImage),
    deleteRoomCategoryImage: validate(imageValidations.deleteRoomCategoryImage),

    /* Reservation route validators */
    createReservation: validate(reservationValidation.create),
    getReservation: validate(reservationValidation.getReservation),
    deleteReservation: validate(reservationValidation.deleteReservation),

    /* Booking route validators */
    createBooking: validate(bookingValidations.createBooking),
    getBooking: validate(bookingValidations.getBooking),
    deleteBooking: validate(bookingValidations.deleteBooking),
    updateBooking: validate(bookingValidations.updateBooking),

    /* User route validators */
    createUser: validate(userValidations.createUser),
    updateUser: validate(userValidations.updateUser),
    getUser: validate(userValidations.getUser),
    deleteUser: validate(userValidations.deleteUser),
}
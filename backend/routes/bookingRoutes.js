const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getProBookings,
  cancelBooking,
  confirmBooking,
  terminerBooking,
} = require('../controllers/bookingController');
const { protect, proOnly } = require('../middleware/authMiddleware');

// Client
router.post('/',                protect, createBooking);          // Créer un RDV
router.get('/me',               protect, getMyBookings);          // Mes RDV
router.put('/:id/cancel',       protect, cancelBooking);          // Annuler

// Pro
router.get('/pro',              protect, proOnly, getProBookings);    // RDV du salon
router.put('/:id/confirm',      protect, proOnly, confirmBooking);    // Confirmer
router.put('/:id/terminer',     protect, proOnly, terminerBooking);   // Terminer

module.exports = router;

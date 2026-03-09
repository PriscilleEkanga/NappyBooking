const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getProBookings,
  cancelBooking,
  confirmBooking,
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

// --- Client ---
router.post('/', protect, createBooking);           // Créer un RDV (avec vérif PayPal)
router.get('/me', protect, getMyBookings);           // Mes RDV (client)
router.put('/:id/cancel', protect, cancelBooking);  // Annuler un RDV

// --- Pro ---
router.get('/pro', protect, getProBookings);         // RDV du salon (pro)
router.put('/:id/confirm', protect, confirmBooking); // Confirmer un RDV (pro)

module.exports = router;

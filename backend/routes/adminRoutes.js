const express = require('express');
const router = express.Router();
const { getStats, getUsers, getBookings, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly); // toutes les routes admin nécessitent auth + rôle admin

router.get('/stats',        getStats);
router.get('/users',        getUsers);
router.get('/bookings',     getBookings);
router.delete('/users/:id', deleteUser);

module.exports = router;

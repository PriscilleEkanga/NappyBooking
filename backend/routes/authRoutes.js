const express = require('express');
const router = express.Router();
// On importe la fonction qu'on a créée dans le contrôleur
const { registerUser } = require('../controllers/authController');

// Cette route correspond à : POST http://localhost:5000/api/auth/register
router.post('/register', registerUser);

module.exports = router;
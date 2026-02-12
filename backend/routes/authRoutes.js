const express = require('express');
const router = express.Router();
// On importe la fonction qu'on a créée dans le contrôleur
const { registerUser, loginUser } = require('../controllers/authController');

// Route pour l'inscription
router.post('/register', registerUser);

// Route pour la connexion 
router.post('/login', loginUser);

module.exports = router;
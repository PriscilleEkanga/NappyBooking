const express = require('express');
const router = express.Router();
const { getDisponibilites, genererCreneaux, updateCreneau } = require('../controllers/disponibiliteController');
const { protect, proOnly } = require('../middleware/authMiddleware');

router.get('/',                 getDisponibilites);                  // public
router.post('/generer',         protect, proOnly, genererCreneaux);  // prestataire
router.put('/:id',              protect, proOnly, updateCreneau);    // prestataire

module.exports = router;

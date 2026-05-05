const express = require('express');
const router = express.Router();
const {
  addPrestataire,
  getPrestataires,
  getPrestataire,
  getMonSalon,
  updatePrestataire,
  deletePrestataire,
} = require('../controllers/prestataireController');
const { protect, adminOnly, proOnly } = require('../middleware/authMiddleware');

router.get('/',             getPrestataires);                       // public
router.get('/mon-salon',    protect, proOnly, getMonSalon);         // prestataire connecté
router.get('/:id',          getPrestataire);                        // public
router.post('/',            protect, proOnly, addPrestataire);      // prestataire
router.put('/:id',          protect, updatePrestataire);            // prestataire ou admin
router.delete('/:id',       protect, adminOnly, deletePrestataire); // admin

module.exports = router;

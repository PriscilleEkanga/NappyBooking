const express = require('express');
const router = express.Router();
const { addPrestataire, getPrestataires, updatePrestataire, deletePrestataire } = require('../controllers/prestataireController');

// Route pour voir tous les prestataires
router.get('/', getPrestataires);

// Route pour ajouter un prestataire
router.post('/', addPrestataire);

// Modifier Prestataire
router.put('/:id', updatePrestataire);

// Supprimer
router.delete('/:id', deletePrestataire);

module.exports = router;
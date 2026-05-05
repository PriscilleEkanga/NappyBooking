const express = require('express');
const router = express.Router();
const { createEmploye, getEmployes, updateEmploye, deleteEmploye } = require('../controllers/employeController');
const { protect, proOnly } = require('../middleware/authMiddleware');

router.get('/',         getEmployes);                       // public
router.post('/',        protect, proOnly, createEmploye);   // prestataire
router.put('/:id',      protect, proOnly, updateEmploye);   // prestataire
router.delete('/:id',   protect, proOnly, deleteEmploye);   // prestataire

module.exports = router;

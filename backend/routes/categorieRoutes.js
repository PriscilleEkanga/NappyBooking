const express = require('express');
const router = express.Router();
const { getCategories, createCategorie, updateCategorie, deleteCategorie } = require('../controllers/categorieController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',       getCategories);                          // public
router.post('/',      protect, adminOnly, createCategorie);    // admin
router.put('/:id',    protect, adminOnly, updateCategorie);    // admin
router.delete('/:id', protect, adminOnly, deleteCategorie);    // admin

module.exports = router;

const express = require('express');
const router = express.Router();
const { createService, getServices, updateService, deleteService, uploadServicePhoto } = require('../controllers/serviceController');
const { protect, proOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/',                     getServices);                                        // public
router.post('/',                    protect, proOnly, createService);                    // prestataire
router.put('/:id',                  protect, proOnly, updateService);                    // prestataire
router.delete('/:id',               protect, proOnly, deleteService);                    // prestataire
router.post('/:id/photo',           protect, proOnly, upload.single('photo'), uploadServicePhoto); // prestataire

module.exports = router;

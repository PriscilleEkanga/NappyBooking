const express = require('express');
const router = express.Router();
const { createAvis, getAvis, masquerAvis } = require('../controllers/avisController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',                 getAvis);                           // public
router.post('/',                protect, createAvis);              // client
router.put('/:id/masquer',      protect, adminOnly, masquerAvis);  // admin

module.exports = router;

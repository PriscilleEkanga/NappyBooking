const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    default: '',
  },
  specialites: {
    type: [String], // ex: ['Box Braids', 'Locks']
    default: [],
  },
  photo: {
    type: String, // URL
    default: '',
  },
  actif: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Employe', employeSchema);

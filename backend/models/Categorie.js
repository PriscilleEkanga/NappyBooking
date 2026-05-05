const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true, // ex: 'coiffure', 'cils'
  },
  label: {
    type: String,
    required: true, // ex: 'Coiffure Afro', 'Extensions de Cils'
  },
  emoji: {
    type: String,
    default: '', // ex: '💇🏾‍♀️'
  },
  ordre: {
    type: Number,
    default: 0, // pour trier l'affichage
  },
  actif: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Categorie', categorieSchema);

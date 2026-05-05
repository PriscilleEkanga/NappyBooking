const mongoose = require('mongoose');

const prestataireSchema = new mongoose.Schema({
  // Lien avec le compte User du propriétaire
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  nom_salon:   { type: String, required: true },
  specialite:  { type: String, required: true },
  categories: {
    type: [String], // slugs des catégories, ex: ['coiffure', 'manucure']
    default: [],
  },
  city:        { type: String, required: true, lowercase: true },
  adresse:     { type: String, required: true },
  telephone:   { type: String, required: true },
  description: { type: String, default: '' },
  photos:      { type: [String], default: [] }, // URLs
  tarif_moyen: { type: Number, default: 0 },
  note:        { type: Number, default: 0 },   // calculé par Avis.calculerNoteMoyenne
  nb_avis:     { type: Number, default: 0 },
  tags:        [{ type: String }],
  actif:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Prestataire', prestataireSchema);
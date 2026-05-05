const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true,
  },
  nom: {
    type: String,
    required: true, // ex: "Box Braids", "Volume Russe"
  },
  description: {
    type: String,
    default: '',
  },
  categorie: {
    type: String, // slug de la catégorie, ex: 'coiffure'
    required: true,
  },
  duree: {
    type: Number, // en minutes
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  acompte_pct: {
    type: Number, // pourcentage d'acompte (ex: 30 pour 30%)
    default: 30,
  },
  photo: {
    type: String, // chemin relatif ex: /uploads/services/service-xxx.jpg
    default: '',
  },
  actif: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

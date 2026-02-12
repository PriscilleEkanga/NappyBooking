const mongoose = require('mongoose');

const prestataireSchema = new mongoose.Schema({
    nom_salon: { type: String, required: true },
    specialite: { type: String, required: true }, // ex: Tresses, Locks, Soins
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    description: { type: String },
    tarif_moyen: { type: Number },
    note: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Prestataire', prestataireSchema);
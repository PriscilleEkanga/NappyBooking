const mongoose = require('mongoose');

// Un créneau = une plage horaire disponible ou bloquée pour un salon/employé
const disponibiliteSchema = new mongoose.Schema({
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true,
  },
  employe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employe',
    default: null, // null = disponibilité du salon entier
  },
  date: {
    type: Date,
    required: true,
  },
  heure_debut: {
    type: String, // ex: "09:00"
    required: true,
  },
  heure_fin: {
    type: String, // ex: "11:30"
    required: true,
  },
  statut: {
    type: String,
    enum: ['disponible', 'reserve', 'bloque'],
    default: 'disponible',
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null, // rempli quand statut = 'reserve'
  },
}, { timestamps: true });

// Index pour requêtes rapides par salon + date
disponibiliteSchema.index({ salon: 1, date: 1 });
disponibiliteSchema.index({ employe: 1, date: 1 });

module.exports = mongoose.model('Disponibilite', disponibiliteSchema);

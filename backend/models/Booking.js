const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true,
  },
  employe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employe',
    default: null,
  },

  // --- Prestation ---
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  // Snapshot au moment de la réservation (en cas de modif future du service)
  service_snapshot: {
    nom: String,
    categorie: String,
    duree: Number,
    prix: Number,
  },
  nomSalon: {
    type: String,
    default: '',
  },
  duration: {
    type: Number, // en minutes
    default: 60,
  },

  // --- Date & Heure ---
  date_rendezvous: {
    type: Date,
    required: true,
  },
  heure: {
    type: String, // ex: "14:30"
    required: true,
  },

  // --- Informations client ---
  client_info: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    note: String,
  },

  // --- Prix ---
  prix: {
    type: Number,
    required: true,
  },
  acompte: {
    type: Number,
    required: true,
  },

  // --- Paiement PayPal ---
  paypalOrderId: {
    type: String,
    required: true,
  },
  paypalStatus: {
    type: String,
    enum: ['COMPLETED', 'PENDING', 'FAILED'],
    default: 'PENDING',
  },

  // --- Statut réservation ---
  statut: {
    type: String,
    enum: ['en attente', 'confirmé', 'annulé', 'terminé'],
    default: 'en attente',
  },

  // --- Référence unique ---
  bookingReference: {
    type: String,
    unique: true,
  },

  commentaire: { type: String },

}, { timestamps: true });

// Génère automatiquement une référence unique avant sauvegarde
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = 'NB-';
    for (let i = 0; i < 8; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.bookingReference = ref;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

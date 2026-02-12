const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Référence au modèle User
        required: true 
    },
    prestataire: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Prestataire', // Référence au modèle Prestataire
        required: true 
    },
    date_rendezvous: { type: Date, required: true },
    statut: { 
        type: String, 
        enum: ['en attente', 'confirmé', 'annulé'], 
        default: 'en attente' 
    },
    commentaire: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
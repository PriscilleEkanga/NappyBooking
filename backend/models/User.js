const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom_client: { type: String, required: true },
    prenom_client: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mdp: { type: String, required: true },
    role: { type: String, enum: ['client', 'prestataire', 'admin'], default: 'client' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
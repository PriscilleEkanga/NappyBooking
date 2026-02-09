const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { nom_client, prenom_client, email, mdp, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // Crypter le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mdp, salt);

        // Créer l'utilisateur
        const user = await User.create({
            nom_client,
            prenom_client,
            email,
            mdp: hashedPassword,
            role
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: { id: user._id, nom: user.nom_client, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
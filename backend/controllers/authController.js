const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { nom_client, prenom_client, email, mdp, role } = req.body;

        // 1. Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // 2. Crypter le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mdp, salt);

        // 3. Créer l'utilisateur dans MongoDB
        const user = await User.create({
            nom_client,
            prenom_client,
            email,
            mdp: hashedPassword,
            role
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès ",
            user: { 
                id: user._id, 
                nom: user.nom_client, 
                email: user.email 
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de l'inscription", error: error.message });
    }
};

// @desc    Connecter un utilisateur & obtenir un token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { email, mdp } = req.body;

        // 1. Chercher l'utilisateur par son email
        const user = await User.findOne({ email });

        // 2. Vérifier si l'utilisateur existe ET si le mot de passe correspond
        if (user && (await bcrypt.compare(mdp, user.mdp))) {
            
            // 3. Générer le Token JWT (valide 30 jours)
            const token = jwt.sign(
                { id: user._id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '30d' }
            );

            // 4. Réponse avec les infos et le token
            res.json({
                _id: user._id,
                nom: user.nom_client,
                prenom: user.prenom_client,
                email: user.email,
                role: user.role,
                token: token
            });
        } else {
            // Erreur 401 : Non autorisé
            res.status(401).json({ message: "Email ou mot de passe incorrect " });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la connexion", error: error.message });
    }
};
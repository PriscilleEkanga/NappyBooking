const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé, token manquant.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupère l'utilisateur sans le mot de passe
    req.user = await User.findById(decoded.id).select('-mdp');

    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
};

const proOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'prestataire' || req.user.role === 'admin')) return next();
  res.status(403).json({ message: 'Accès réservé aux prestataires.' });
};

module.exports = { protect, adminOnly, proOnly };

const User = require('../models/User');
const Booking = require('../models/Booking');
const Prestataire = require('../models/Prestataire');

// @desc  Stats globales
// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalPrestataires, revenueData] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Prestataire.countDocuments(),
      Booking.aggregate([
        { $match: { statut: { $in: ['confirmé', 'terminé'] } } },
        { $group: { _id: null, total: { $sum: '$acompte' } } },
      ]),
    ]);

    const byStatut = await Booking.aggregate([
      { $group: { _id: '$statut', count: { $sum: 1 } } },
    ]);

    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    res.json({
      totalUsers,
      totalBookings,
      totalPrestataires,
      totalRevenue: revenueData[0]?.total || 0,
      bookingsByStatut: byStatut,
      usersByRole: byRole,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// @desc  Liste tous les utilisateurs
// @route GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-mdp').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// @desc  Liste toutes les réservations
// @route GET /api/admin/bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('client', 'nom_client prenom_client email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// @desc  Supprimer un utilisateur
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Impossible de supprimer un admin.' });
    await user.deleteOne();
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

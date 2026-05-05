const Avis = require('../models/Avis');
const Booking = require('../models/Booking');

// @desc   Laisser un avis après un booking terminé
// @route  POST /api/avis
// @access Privé (client)
exports.createAvis = async (req, res) => {
  try {
    const { bookingId, note, commentaire } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Réservation introuvable.' });

    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    if (booking.statut !== 'terminé') {
      return res.status(400).json({ message: 'Vous ne pouvez noter qu\'une prestation terminée.' });
    }

    const avis = await Avis.create({
      salon: booking.salon,
      client: req.user.id,
      booking: bookingId,
      note,
      commentaire,
    });

    res.status(201).json(avis);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Vous avez déjà noté cette réservation.' });
    }
    res.status(500).json({ message: "Erreur lors de l'ajout de l'avis", error: error.message });
  }
};

// @desc   Obtenir les avis d'un salon
// @route  GET /api/avis?salonId=xxx
// @access Public
exports.getAvis = async (req, res) => {
  try {
    if (!req.query.salonId) {
      return res.status(400).json({ message: 'salonId requis.' });
    }

    const avis = await Avis.find({ salon: req.query.salonId, visible: true })
      .populate('client', 'prenom_client nom_client')
      .sort({ createdAt: -1 });

    res.json(avis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// @desc   Masquer un avis (admin)
// @route  PUT /api/avis/:id/masquer
// @access Privé (admin)
exports.masquerAvis = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndUpdate(
      req.params.id,
      { visible: false },
      { new: true }
    );
    if (!avis) return res.status(404).json({ message: 'Avis introuvable.' });
    res.json({ message: 'Avis masqué.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

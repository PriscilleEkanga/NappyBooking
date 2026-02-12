const Booking = require('../models/Booking');

// @desc    Créer une nouvelle réservation
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const { prestataire, date_rendezvous, commentaire } = req.body;
        
        // Pour l'instant on passe le client manuellement, 
        // plus tard on le récupérera via le Token (req.user.id)
        const { client } = req.body; 

        const booking = await Booking.create({
            client,
            prestataire,
            date_rendezvous,
            commentaire
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réservation", error: error.message });
    }
};

// @desc    Voir les réservations d'un client
// @route   GET /api/bookings/mybookings/:clientId
exports.getUserBookings = async (req, res) => {
    try {
        // .populate permet de récupérer les détails (nom, salon) au lieu de juste l'ID
        const bookings = await Booking.find({ client: req.params.clientId })
                                      .populate('prestataire', 'nom_salon adresse');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération", error: error.message });
    }
};
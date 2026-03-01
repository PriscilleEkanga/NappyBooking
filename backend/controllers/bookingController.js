const Booking = require('../models/Booking');

// @desc    Créer une nouvelle réservation
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const { salonId, service, date, heure, prix, client_id } = req.body;

        // 1. Validation des champs
        if (!salonId || !service || !date || !heure) {
            return res.status(400).json({ message: "Données manquantes pour la réservation" });
        }

        // 2. Création de la réservation
        const booking = await Booking.create({
            salon: salonId,
            client: client_id,
            service,
            date,
            heure,
            prix,
            statut: 'en attente'
        });

        // 3. Réponse
        res.status(201).json({
            message: "Réservation créée avec succès !",
            booking
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Erreur serveur lors de la réservation", 
            error: error.message 
        });
    }
};

// @desc    Récupérer les réservations d'un client
// @route   GET /api/bookings/my-bookings
exports.getUserBookings = async (req, res) => {
    try {
        // Supposons que l'ID client vient du middleware d'auth (req.user.id)
        const bookings = await Booking.find({ client: req.params.clientId }).populate('salon');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
    }
};
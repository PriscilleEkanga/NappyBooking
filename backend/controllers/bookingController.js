const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Disponibilite = require('../models/Disponibilite');

// ============================================================
//  VÉRIFICATION PAYPAL
// ============================================================
const verifyPaypalPayment = async (paypalOrderId, expectedAmount) => {
  try {
    const credentials = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error('Impossible d\'obtenir le token PayPal');

    const orderRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const order = await orderRes.json();
    if (order.status !== 'COMPLETED') {
      throw new Error(`Paiement non complété. Statut: ${order.status}`);
    }

    const paidAmount = parseFloat(order.purchase_units[0].payments.captures[0].amount.value);
    const paidCurrency = order.purchase_units[0].payments.captures[0].amount.currency_code;

    if (paidCurrency !== 'EUR') throw new Error('Devise incorrecte');
    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      throw new Error(`Montant incorrect. Reçu: ${paidAmount}€, Attendu: ${expectedAmount}€`);
    }

    return { success: true, paidAmount, order };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


// ============================================================
//  @desc   Créer une réservation (après paiement PayPal)
//  @route  POST /api/bookings
//  @access Privé (client)
// ============================================================
exports.createBooking = async (req, res) => {
  try {
    const {
      salonId,
      serviceId,
      employeId,
      date,
      heure,
      client_info,
      paypalOrderId,
      depositAmount,
    } = req.body;

    if (!salonId || !serviceId || !date || !heure || !paypalOrderId || !depositAmount) {
      return res.status(400).json({
        message: 'Données manquantes : salonId, serviceId, date, heure, paypalOrderId et depositAmount sont requis.',
      });
    }

    // Vérifier unicité de l'ordre PayPal
    const existingBooking = await Booking.findOne({ paypalOrderId });
    if (existingBooking) {
      return res.status(400).json({ message: 'Ce paiement a déjà été utilisé pour une réservation.' });
    }

    // Récupérer le service pour le snapshot
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service introuvable.' });

    // Vérification PayPal
    const paypalCheck = await verifyPaypalPayment(paypalOrderId, parseFloat(depositAmount));
    if (!paypalCheck.success) {
      return res.status(402).json({ message: `Paiement invalide : ${paypalCheck.error}` });
    }

    // Créer la réservation
    const booking = await Booking.create({
      client: req.user.id,
      salon: salonId,
      employe: employeId || null,
      service: serviceId,
      service_snapshot: {
        nom: service.nom,
        categorie: service.categorie,
        duree: service.duree,
        prix: service.prix,
      },
      nomSalon: req.body.nomSalon || '',
      duration: service.duree,
      date_rendezvous: new Date(date),
      heure,
      client_info: client_info || {},
      prix: service.prix,
      acompte: parseFloat(depositAmount),
      paypalOrderId,
      paypalStatus: 'COMPLETED',
      statut: 'en attente',
    });

    // Marquer le créneau comme réservé
    await Disponibilite.findOneAndUpdate(
      { salon: salonId, date: new Date(date), heure_debut: heure, statut: 'disponible' },
      { statut: 'reserve', booking: booking._id }
    );

    res.status(201).json({
      message: 'Réservation créée avec succès',
      bookingReference: booking.bookingReference,
      booking,
    });
  } catch (error) {
    console.error('Erreur createBooking:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la réservation', error: error.message });
  }
};


// ============================================================
//  @desc   Mes réservations (client connecté)
//  @route  GET /api/bookings/me
//  @access Privé (client)
// ============================================================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .populate('salon', 'nom_salon adresse telephone')
      .populate('employe', 'prenom nom')
      .sort({ date_rendezvous: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// ============================================================
//  @desc   Réservations du salon (pro connecté)
//  @route  GET /api/bookings/pro
//  @access Privé (prestataire)
// ============================================================
exports.getProBookings = async (req, res) => {
  try {
    const Prestataire = require('../models/Prestataire');
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const bookings = await Booking.find({ salon: salon._id })
      .populate('client', 'nom_client prenom_client email')
      .populate('employe', 'prenom nom')
      .sort({ date_rendezvous: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// ============================================================
//  @desc   Annuler un RDV (client)
//  @route  PUT /api/bookings/:id/cancel
//  @access Privé (client)
// ============================================================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Réservation introuvable.' });

    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }
    if (booking.statut === 'annulé') {
      return res.status(400).json({ message: 'Ce RDV est déjà annulé.' });
    }

    booking.statut = 'annulé';
    await booking.save();

    // Libérer le créneau
    await Disponibilite.findOneAndUpdate(
      { booking: booking._id },
      { statut: 'disponible', booking: null }
    );

    res.json({ message: "Réservation annulée. L'acompte ne sera pas remboursé.", booking });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// ============================================================
//  @desc   Confirmer un RDV (pro)
//  @route  PUT /api/bookings/:id/confirm
//  @access Privé (prestataire)
// ============================================================
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { statut: 'confirmé' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Réservation introuvable.' });
    res.json({ message: 'Réservation confirmée.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// ============================================================
//  @desc   Marquer un RDV comme terminé (pro)
//  @route  PUT /api/bookings/:id/terminer
//  @access Privé (prestataire)
// ============================================================
exports.terminerBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { statut: 'terminé' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Réservation introuvable.' });
    res.json({ message: 'Prestation marquée comme terminée.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

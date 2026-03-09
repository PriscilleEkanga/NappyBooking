const Booking = require('../models/Booking');

// ============================================================
//  VÉRIFICATION PAYPAL
//  On appelle l'API PayPal pour confirmer que le paiement
//  a bien été capturé AVANT de créer la réservation en BDD.
// ============================================================
const verifyPaypalPayment = async (paypalOrderId, expectedAmount) => {
  try {
    // 1. Obtenir un token d'accès PayPal
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

    if (!accessToken) {
      throw new Error('Impossible d\'obtenir le token PayPal');
    }

    // 2. Vérifier l'ordre PayPal
    const orderRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const order = await orderRes.json();

    // 3. Vérifications de sécurité
    if (order.status !== 'COMPLETED') {
      throw new Error(`Paiement non complété. Statut: ${order.status}`);
    }

    const paidAmount = parseFloat(order.purchase_units[0].payments.captures[0].amount.value);
    const paidCurrency = order.purchase_units[0].payments.captures[0].amount.currency_code;

    if (paidCurrency !== 'EUR') {
      throw new Error('Devise incorrecte');
    }

    // Tolérance de 1 centime pour les arrondis
    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      throw new Error(`Montant incorrect. Reçu: ${paidAmount}€, Attendu: ${expectedAmount}€`);
    }

    return { success: true, paidAmount, order };

  } catch (error) {
    return { success: false, error: error.message };
  }
};


// ============================================================
//  @desc    Créer une réservation (après vérification PayPal)
//  @route   POST /api/bookings
//  @access  Privé (JWT requis)
// ============================================================
exports.createBooking = async (req, res) => {
  try {
    const {
      salonId,
      serviceId,
      service,
      date,
      heure,
      duration,
      client,
      note,
      prix,
      depositAmount,
      paypalOrderId,
    } = req.body;

    // 1. Validation des champs obligatoires
    if (!service || !date || !heure || !paypalOrderId || !depositAmount) {
      return res.status(400).json({
        message: 'Données manquantes : service, date, heure, paypalOrderId et depositAmount sont requis.',
      });
    }

    // 2. Vérifier que cette commande PayPal n'a pas déjà été utilisée
    const existingBooking = await Booking.findOne({ paypalOrderId });
    if (existingBooking) {
      return res.status(400).json({
        message: 'Ce paiement a déjà été utilisé pour une réservation.',
      });
    }

    // 3. Vérification du paiement PayPal
    const paypalCheck = await verifyPaypalPayment(paypalOrderId, parseFloat(depositAmount));
    if (!paypalCheck.success) {
      return res.status(402).json({
        message: `Paiement invalide : ${paypalCheck.error}`,
      });
    }

    // 4. Créer la réservation en BDD
    const booking = await Booking.create({
      client: req.user.id, // vient du middleware protect
      salon: salonId || null,
      service,
      duration: duration || 60,
      date_rendezvous: new Date(date),
      heure,
      client_info: {
        firstName: client?.firstName || '',
        lastName: client?.lastName || '',
        email: client?.email || '',
        phone: client?.phone || '',
        note: note || '',
      },
      prix: parseFloat(prix) || parseFloat(depositAmount) / 0.3,
      acompte: parseFloat(depositAmount),
      paypalOrderId,
      paypalStatus: 'COMPLETED',
      statut: 'en attente',
    });

    // 5. Réponse succès
    res.status(201).json({
      message: 'Réservation créée avec succès',
      bookingReference: booking.bookingReference,
      booking,
    });

  } catch (error) {
    console.error('Erreur createBooking:', error);
    res.status(500).json({
      message: 'Erreur serveur lors de la réservation',
      error: error.message,
    });
  }
};


// ============================================================
//  @desc    Récupérer les RDV du client connecté
//  @route   GET /api/bookings/me
//  @access  Privé (JWT requis)
// ============================================================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .sort({ date_rendezvous: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// ============================================================
//  @desc    Récupérer les RDV du salon pro connecté
//  @route   GET /api/bookings/pro
//  @access  Privé (JWT requis, rôle prestataire)
// ============================================================
exports.getProBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ prestataire: req.user.id })
      .populate('client', 'nom_client prenom_client email')
      .sort({ date_rendezvous: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// ============================================================
//  @desc    Annuler un RDV
//  @route   PUT /api/bookings/:id/cancel
//  @access  Privé (JWT requis)
// ============================================================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Réservation introuvable.' });
    }

    // Vérifier que c'est bien le client qui annule
    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    if (booking.statut === 'annulé') {
      return res.status(400).json({ message: 'Ce RDV est déjà annulé.' });
    }

    booking.statut = 'annulé';
    await booking.save();

    res.json({
      message: 'Réservation annulée. L\'acompte ne sera pas remboursé.',
      booking,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// ============================================================
//  @desc    Confirmer un RDV (action pro)
//  @route   PUT /api/bookings/:id/confirm
//  @access  Privé (JWT requis, rôle prestataire)
// ============================================================
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Réservation introuvable.' });
    }

    booking.statut = 'confirmé';
    await booking.save();

    res.json({ message: 'Réservation confirmée.', booking });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

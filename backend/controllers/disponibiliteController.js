const Disponibilite = require('../models/Disponibilite');
const Prestataire = require('../models/Prestataire');

// @desc   Obtenir les créneaux disponibles d'un salon pour une date
// @route  GET /api/disponibilites?salonId=xxx&date=2026-04-10
// @access Public
exports.getDisponibilites = async (req, res) => {
  try {
    const { salonId, date, employeId } = req.query;
    if (!salonId || !date) {
      return res.status(400).json({ message: 'salonId et date sont requis.' });
    }

    const debut = new Date(date);
    debut.setHours(0, 0, 0, 0);
    const fin = new Date(date);
    fin.setHours(23, 59, 59, 999);

    const filter = {
      salon: salonId,
      date: { $gte: debut, $lte: fin },
      statut: 'disponible',
    };
    if (employeId) filter.employe = employeId;

    const creneaux = await Disponibilite.find(filter)
      .populate('employe', 'prenom nom')
      .sort({ heure_debut: 1 });

    res.json(creneaux);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// @desc   Générer les créneaux d'une journée pour un salon (action pro)
// @route  POST /api/disponibilites/generer
// @access Privé (prestataire)
// Body: { date, heure_debut, heure_fin, duree_creneau (minutes), employeId? }
exports.genererCreneaux = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const { date, heure_debut, heure_fin, duree_creneau = 60, employeId } = req.body;
    if (!date || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: 'date, heure_debut et heure_fin sont requis.' });
    }

    // Supprimer les créneaux existants pour ce jour/salon/employé
    const debut = new Date(date);
    debut.setHours(0, 0, 0, 0);
    const fin = new Date(date);
    fin.setHours(23, 59, 59, 999);

    await Disponibilite.deleteMany({
      salon: salon._id,
      employe: employeId || null,
      date: { $gte: debut, $lte: fin },
      statut: 'disponible',
    });

    // Générer les créneaux
    const creneaux = [];
    const [hD, mD] = heure_debut.split(':').map(Number);
    const [hF, mF] = heure_fin.split(':').map(Number);
    let minutesCourant = hD * 60 + mD;
    const minutesFin = hF * 60 + mF;

    while (minutesCourant + duree_creneau <= minutesFin) {
      const h1 = String(Math.floor(minutesCourant / 60)).padStart(2, '0');
      const m1 = String(minutesCourant % 60).padStart(2, '0');
      const h2 = String(Math.floor((minutesCourant + duree_creneau) / 60)).padStart(2, '0');
      const m2 = String((minutesCourant + duree_creneau) % 60).padStart(2, '0');

      creneaux.push({
        salon: salon._id,
        employe: employeId || null,
        date: new Date(date),
        heure_debut: `${h1}:${m1}`,
        heure_fin: `${h2}:${m2}`,
        statut: 'disponible',
      });

      minutesCourant += duree_creneau;
    }

    const created = await Disponibilite.insertMany(creneaux);
    res.status(201).json({ message: `${created.length} créneaux générés.`, creneaux: created });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la génération', error: error.message });
  }
};

// @desc   Bloquer / débloquer un créneau manuellement
// @route  PUT /api/disponibilites/:id
// @access Privé (prestataire)
exports.updateCreneau = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const creneau = await Disponibilite.findOneAndUpdate(
      { _id: req.params.id, salon: salon._id },
      { statut: req.body.statut },
      { new: true }
    );
    if (!creneau) return res.status(404).json({ message: 'Créneau introuvable.' });

    res.json(creneau);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: error.message });
  }
};

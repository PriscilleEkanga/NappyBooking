const Employe = require('../models/Employe');
const Prestataire = require('../models/Prestataire');

// @desc   Ajouter un employé au salon
// @route  POST /api/employes
// @access Privé (prestataire)
exports.createEmploye = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable pour ce compte.' });

    const employe = await Employe.create({ ...req.body, salon: salon._id });
    res.status(201).json(employe);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'employé", error: error.message });
  }
};

// @desc   Lister les employés d'un salon
// @route  GET /api/employes?salonId=xxx
// @access Public
exports.getEmployes = async (req, res) => {
  try {
    const filter = { actif: true };
    if (req.query.salonId) filter.salon = req.query.salonId;

    const employes = await Employe.find(filter).sort({ prenom: 1 });
    res.json(employes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// @desc   Modifier un employé
// @route  PUT /api/employes/:id
// @access Privé (prestataire propriétaire)
exports.updateEmploye = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const employe = await Employe.findOneAndUpdate(
      { _id: req.params.id, salon: salon._id },
      req.body,
      { new: true }
    );
    if (!employe) return res.status(404).json({ message: 'Employé introuvable.' });

    res.json(employe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: error.message });
  }
};

// @desc   Désactiver un employé
// @route  DELETE /api/employes/:id
// @access Privé (prestataire propriétaire)
exports.deleteEmploye = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const employe = await Employe.findOneAndUpdate(
      { _id: req.params.id, salon: salon._id },
      { actif: false },
      { new: true }
    );
    if (!employe) return res.status(404).json({ message: 'Employé introuvable.' });

    res.json({ message: 'Employé retiré.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

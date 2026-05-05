const Prestataire = require('../models/Prestataire');

// @desc   Créer son profil salon (prestataire)
// @route  POST /api/prestataires
// @access Privé (prestataire)
exports.addPrestataire = async (req, res) => {
  try {
    const existant = await Prestataire.findOne({ user: req.user.id });
    if (existant) {
      return res.status(400).json({ message: 'Ce compte a déjà un salon enregistré.' });
    }

    const salon = await Prestataire.create({ ...req.body, user: req.user.id });
    res.status(201).json(salon);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du salon", error: error.message });
  }
};

// @desc   Lister les prestataires (avec filtres)
// @route  GET /api/prestataires?city=paris&categorie=coiffure
// @access Public
exports.getPrestataires = async (req, res) => {
  try {
    const filter = { actif: true };
    if (req.query.city)      filter.city       = req.query.city.toLowerCase();
    if (req.query.categorie) filter.categories = req.query.categorie;

    const prestataires = await Prestataire.find(filter).sort({ note: -1 });
    res.json(prestataires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// @desc   Obtenir un salon par ID
// @route  GET /api/prestataires/:id
// @access Public
exports.getPrestataire = async (req, res) => {
  try {
    const salon = await Prestataire.findById(req.params.id);
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// @desc   Obtenir le salon du prestataire connecté
// @route  GET /api/prestataires/mon-salon
// @access Privé (prestataire)
exports.getMonSalon = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Aucun salon trouvé pour ce compte.' });
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc   Modifier son salon
// @route  PUT /api/prestataires/:id
// @access Privé (prestataire propriétaire ou admin)
exports.updatePrestataire = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.id };

    const salon = await Prestataire.findOneAndUpdate(filter, req.body, { new: true });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable ou non autorisé.' });

    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: error.message });
  }
};

// @desc   Supprimer un salon (admin)
// @route  DELETE /api/prestataires/:id
// @access Privé (admin)
exports.deletePrestataire = async (req, res) => {
  try {
    await Prestataire.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salon supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

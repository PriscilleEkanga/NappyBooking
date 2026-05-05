const path = require('path');
const fs = require('fs');
const Service = require('../models/Service');
const Prestataire = require('../models/Prestataire');

// @desc   Créer un service pour son salon
// @route  POST /api/services
// @access Privé (prestataire)
exports.createService = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon introuvable pour ce compte.' });
    }

    const service = await Service.create({ ...req.body, salon: salon._id });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du service', error: error.message });
  }
};

// @desc   Lister les services d'un salon
// @route  GET /api/services?salonId=xxx
// @access Public
exports.getServices = async (req, res) => {
  try {
    const filter = { actif: true };
    if (req.query.salonId) filter.salon = req.query.salonId;
    if (req.query.categorie) filter.categorie = req.query.categorie;

    const services = await Service.find(filter).sort({ categorie: 1, nom: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// @desc   Modifier un service
// @route  PUT /api/services/:id
// @access Privé (prestataire propriétaire)
exports.updateService = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, salon: salon._id },
      req.body,
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service introuvable.' });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: error.message });
  }
};

// @desc   Uploader la photo d'un service
// @route  POST /api/services/:id/photo
// @access Privé (prestataire propriétaire)
exports.uploadServicePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu.' });

    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const service = await Service.findOne({ _id: req.params.id, salon: salon._id });
    if (!service) return res.status(404).json({ message: 'Service introuvable.' });

    // Supprimer l'ancienne photo si elle existe
    if (service.photo) {
      const oldPath = path.join(__dirname, '..', service.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const photoUrl = `/uploads/services/${req.file.filename}`;
    service.photo = photoUrl;
    await service.save();

    res.json({ photo: photoUrl, service });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
  }
};

// @desc   Supprimer (désactiver) un service
// @route  DELETE /api/services/:id
// @access Privé (prestataire propriétaire)
exports.deleteService = async (req, res) => {
  try {
    const salon = await Prestataire.findOne({ user: req.user.id });
    if (!salon) return res.status(404).json({ message: 'Salon introuvable.' });

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, salon: salon._id },
      { actif: false },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service introuvable.' });

    res.json({ message: 'Service supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

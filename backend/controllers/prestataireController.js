const Prestataire = require('../models/Prestataire');

// @desc    Ajouter un nouveau prestataire
// @route   POST /api/prestataires
exports.addPrestataire = async (req, res) => {
    try {
        const { nom_salon, specialite, adresse, telephone, description, tarif_moyen } = req.body;

        const nouveauPrestataire = await Prestataire.create({
            nom_salon,
            specialite,
            adresse,
            telephone,
            description,
            tarif_moyen
        });

        res.status(201).json(nouveauPrestataire);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
};

// @desc    Obtenir la liste de tous les prestataires
// @route   GET /api/prestataires
exports.getPrestataires = async (req, res) => {
    try {
        const prestataires = await Prestataire.find();
        res.status(200).json(prestataires);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
    }
};

// @desc    Modifier un prestataire
// @route   PUT /api/prestataires/:id
exports.updatePrestataire = async (req, res) => {
    try {
        const prestataire = await Prestataire.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Pour renvoyer l'objet modifié et non l'ancien
        );
        res.status(200).json(prestataire);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
    }
};

// @desc    Supprimer un prestataire
// @route   DELETE /api/prestataires/:id
exports.deletePrestataire = async (req, res) => {
    try {
        await Prestataire.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Prestataire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
};
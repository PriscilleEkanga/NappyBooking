const Categorie = require('../models/Categorie');

// @desc   Lister toutes les catégories actives
// @route  GET /api/categories
// @access Public
exports.getCategories = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { actif: true };
    const categories = await Categorie.find(filter).sort({ ordre: 1, label: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// @desc   Créer une catégorie
// @route  POST /api/categories
// @access Privé (admin)
exports.createCategorie = async (req, res) => {
  try {
    const { slug, label, emoji, ordre } = req.body;
    if (!slug || !label) {
      return res.status(400).json({ message: 'slug et label sont requis.' });
    }

    const categorie = await Categorie.create({ slug, label, emoji, ordre });
    res.status(201).json(categorie);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `Le slug "${req.body.slug}" existe déjà.` });
    }
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// @desc   Modifier une catégorie
// @route  PUT /api/categories/:id
// @access Privé (admin)
exports.updateCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categorie) return res.status(404).json({ message: 'Catégorie introuvable.' });
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: error.message });
  }
};

// @desc   Supprimer (désactiver) une catégorie
// @route  DELETE /api/categories/:id
// @access Privé (admin)
exports.deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      { actif: false },
      { new: true }
    );
    if (!categorie) return res.status(404).json({ message: 'Catégorie introuvable.' });
    res.json({ message: 'Catégorie désactivée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

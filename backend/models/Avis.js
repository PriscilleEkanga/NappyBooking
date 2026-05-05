const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true, // un seul avis par réservation
  },
  note: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  commentaire: {
    type: String,
    default: '',
  },
  visible: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Recalcule la note moyenne du salon après chaque avis
avisSchema.statics.calculerNoteMoyenne = async function (salonId) {
  const result = await this.aggregate([
    { $match: { salon: salonId, visible: true } },
    { $group: { _id: '$salon', moyenne: { $avg: '$note' } } },
  ]);
  const Prestataire = mongoose.model('Prestataire');
  if (result.length > 0) {
    await Prestataire.findByIdAndUpdate(salonId, {
      note: Math.round(result[0].moyenne * 10) / 10,
    });
  }
};

avisSchema.statics.majNbAvis = async function (salonId) {
  const count = await this.countDocuments({ salon: salonId, visible: true });
  const Prestataire = mongoose.model('Prestataire');
  await Prestataire.findByIdAndUpdate(salonId, { nb_avis: count });
};

avisSchema.post('save', function () {
  this.constructor.calculerNoteMoyenne(this.salon);
  this.constructor.majNbAvis(this.salon);
});

module.exports = mongoose.model('Avis', avisSchema);

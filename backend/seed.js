const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User          = require('./models/User');
const Prestataire   = require('./models/Prestataire');
const Service       = require('./models/Service');
const Employe       = require('./models/Employe');
const Disponibilite = require('./models/Disponibilite');
const Booking       = require('./models/Booking');
const Avis          = require('./models/Avis');
const Categorie     = require('./models/Categorie');

// ─────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────

const hash = async (mdp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(mdp, salt);
};

// Génère les créneaux d'une journée (ex: 09:00 → 18:00 par pas de 60 min)
const genCreneaux = (salonId, employeId, date, heureDebut, heureFin, duree = 60) => {
  const creneaux = [];
  const [hD, mD] = heureDebut.split(':').map(Number);
  const [hF, mF] = heureFin.split(':').map(Number);
  let cur = hD * 60 + mD;
  const fin = hF * 60 + mF;
  while (cur + duree <= fin) {
    const h1 = String(Math.floor(cur / 60)).padStart(2, '0');
    const m1 = String(cur % 60).padStart(2, '0');
    const h2 = String(Math.floor((cur + duree) / 60)).padStart(2, '0');
    const m2 = String((cur + duree) % 60).padStart(2, '0');
    creneaux.push({
      salon: salonId,
      employe: employeId || null,
      date: new Date(date),
      heure_debut: `${h1}:${m1}`,
      heure_fin: `${h2}:${m2}`,
      statut: 'disponible',
    });
    cur += duree;
  }
  return creneaux;
};

// ─────────────────────────────────────────
//  SEED
// ─────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    // ── Nettoyage ──
    await Promise.all([
      User.deleteMany({}),
      Prestataire.deleteMany({}),
      Service.deleteMany({}),
      Employe.deleteMany({}),
      Disponibilite.deleteMany({}),
      Booking.deleteMany({}),
      Avis.deleteMany({}),
      Categorie.deleteMany({}),
    ]);
    console.log('Collections vidées');

    // ── Catégories ──
    await Categorie.insertMany([
      { slug: 'coiffure',   label: 'Coiffure Afro',      emoji: '💇🏾‍♀️', ordre: 1 },
      { slug: 'cils',       label: 'Extensions de Cils', emoji: '👁️',    ordre: 2 },
      { slug: 'manucure',   label: 'Manucure & Ongles',  emoji: '💅🏾',   ordre: 3 },
      { slug: 'maquillage', label: 'Maquillage',         emoji: '💄',    ordre: 4 },
    ]);
    console.log('4 catégories créées');

    // ── Utilisateurs ──
    const [aminata, fatoumata, sarah, proMistral, proNappy, admin] = await Promise.all([
      User.create({ nom_client: 'Diallo',      prenom_client: 'Aminata',       email: 'aminata@test.com',        mdp: await hash('password123'), role: 'client' }),
      User.create({ nom_client: 'Konaté',      prenom_client: 'Fatoumata',     email: 'fatoumata@test.com',      mdp: await hash('password123'), role: 'client' }),
      User.create({ nom_client: 'Traoré',      prenom_client: 'Sarah',         email: 'sarah@test.com',          mdp: await hash('password123'), role: 'client' }),
      User.create({ nom_client: 'Beauté Afro', prenom_client: 'MistralCare',   email: 'pro@mistralcare.com',     mdp: await hash('password123'), role: 'prestataire' }),
      User.create({ nom_client: 'Nappy Queens',prenom_client: 'Studio',        email: 'pro@nappyqueens.com',     mdp: await hash('password123'), role: 'prestataire' }),
      User.create({ nom_client: 'Admin',       prenom_client: 'NappyBooking',  email: 'admin@nappybooking.com',  mdp: await hash('admin123'),    role: 'admin' }),
    ]);
    console.log('6 utilisateurs créés');

    // ── Prestataires ──
    const [
      mistral, dedGlow, audeBraids, nappyQueens,
      atelierRegard, regardSoie,
      nailGallery, pinkFierce,
      studioGlam, teintParfait,
      dedansGlow, lyonNappyZen, lyonCils,
      massilia, phoceenne,
      bordeauxGlow, nantesNappy, lilleElegance,
    ] = await Prestataire.insertMany([
      // PARIS — COIFFURE
      { user: proMistral._id, nom_salon: 'MistralCare',        specialite: 'Tresses & Locks',        categories: ['coiffure'], city: 'paris',     adresse: '15 rue Gauthey, 75017 Paris',              telephone: '06 12 34 56 78', description: 'Spécialiste des tresses africaines, locks et soins naturels depuis 10 ans.', tarif_moyen: 100, note: 4.9, nb_avis: 0, tags: ['Tissage', 'Soins'] },
      { user: null,           nom_salon: 'Ded Glow Beauty',    specialite: 'Braids & Nattes',        categories: ['coiffure'], city: 'paris',     adresse: '54 rue Veron, 94140 Alfortville',          telephone: '06 22 33 44 55', description: 'Nattes, box braids et soins naturels dans un cadre bienveillant.',          tarif_moyen: 85,  note: 4.8, nb_avis: 0, tags: ['Nattes', 'Beauté'] },
      { user: null,           nom_salon: 'audeBraids',         specialite: 'Braids & Crochet',       categories: ['coiffure'], city: 'paris',     adresse: 'Corbeil-Essonnes, Paris Sud',              telephone: '06 33 44 55 66', description: 'Spécialiste braids et crochet, résultats impeccables.',                    tarif_moyen: 110, note: 5.0, nb_avis: 0, tags: ['Braids', 'Crochet'] },
      { user: proNappy._id,   nom_salon: 'Nappy Queens',       specialite: 'Coiffure Afro',          categories: ['coiffure'], city: 'paris',     adresse: '42 rue de la Roquette, 75011 Paris',       telephone: '06 98 76 54 32', description: 'Box braids, knotless braids, vanilles et twists.',                        tarif_moyen: 120, note: 4.8, nb_avis: 0, tags: ['Knotless', 'Twists'] },
      // PARIS — CILS
      { user: null, nom_salon: "L'Atelier du Regard", specialite: 'Extensions de Cils',    categories: ['cils'],     city: 'paris',     adresse: '40 rue du Bac, 75007 Paris',               telephone: '07 11 22 33 44', description: 'Extensions cil à cil, volume russe et rehaussement.',                    tarif_moyen: 70,  note: 4.7, nb_avis: 0, tags: ['Volume Russe', 'Classique'] },
      { user: null, nom_salon: 'Regard de Soie',      specialite: 'Rehaussement & Ext.',   categories: ['cils'],     city: 'paris',     adresse: '12 rue Saint-Honoré, 75001 Paris',         telephone: '06 44 55 66 77', description: 'Spécialiste du rehaussement et de la teinture de cils.',                  tarif_moyen: 60,  note: 4.8, nb_avis: 0, tags: ['Rehaussement', 'Teinture'] },
      // PARIS — MANUCURE
      { user: null, nom_salon: 'Nail Gallery Paris',  specialite: 'Manucure & Nail Art',   categories: ['manucure'], city: 'paris',     adresse: '22 rue de Rivoli, 75001 Paris',            telephone: '06 55 44 33 22', description: 'Semi-permanent, gel, nail art et soins des mains.',                      tarif_moyen: 50,  note: 4.6, nb_avis: 0, tags: ['Nail Art', 'Gel'] },
      { user: null, nom_salon: 'Pink & Fierce',       specialite: 'Pose Gel & Capsules',   categories: ['manucure'], city: 'paris',     adresse: '7 rue du Faubourg Montmartre, 75009 Paris', telephone: '06 66 77 88 99', description: 'Spécialiste des poses gel, capsules et baby boomer.',                    tarif_moyen: 55,  note: 4.7, nb_avis: 0, tags: ['Capsules', 'Semi-permanent'] },
      // PARIS — MAQUILLAGE
      { user: null, nom_salon: 'Studio Glam Paris',   specialite: 'Maquillage Pro',        categories: ['maquillage'], city: 'paris',   adresse: '15 Avenue Montaigne, 75008 Paris',         telephone: '06 77 88 99 00', description: 'Maquillage mariée, soirée, éditorial. Spécialisées peaux mates et foncées.', tarif_moyen: 80, note: 4.9, nb_avis: 0, tags: ['Mariée', 'Soirée'] },
      { user: null, nom_salon: 'Teint Parfait',       specialite: 'Maquillage & Cours',    categories: ['maquillage'], city: 'paris',   adresse: '3 rue des Martyrs, 75009 Paris',           telephone: '06 88 99 00 11', description: 'Cours auto-maquillage et maquillage événementiel.',                       tarif_moyen: 70,  note: 4.7, nb_avis: 0, tags: ['Cours', 'Événementiel'] },
      // LYON
      { user: null, nom_salon: 'Dedans Glow',         specialite: 'Soins & Coiffure',      categories: ['coiffure'], city: 'lyon',     adresse: '8 rue de la Paix, 69001 Lyon',             telephone: '04 72 33 44 55', description: 'Soins hydratants, twist out, définition des boucles.',                  tarif_moyen: 75,  note: 4.8, nb_avis: 0, tags: ['Soins', 'Twist Out'] },
      { user: null, nom_salon: 'Lyon Nappy Zen',      specialite: 'Tresses & Locks',       categories: ['coiffure'], city: 'lyon',     adresse: '22 rue de la République, 69002 Lyon',      telephone: '04 72 44 55 66', description: 'Spécialiste locks et démêlage doux. Cadre zen et bienveillant.',          tarif_moyen: 90,  note: 4.7, nb_avis: 0, tags: ['Locks', 'Démêlage'] },
      { user: null, nom_salon: 'Lyon Cils Studio',    specialite: 'Extensions de Cils',    categories: ['cils'],     city: 'lyon',     adresse: '15 Place Bellecour, 69002 Lyon',           telephone: '04 78 55 66 77', description: 'Volume russe et extensions naturelles à Lyon.',                          tarif_moyen: 65,  note: 4.6, nb_avis: 0, tags: ['Volume Russe', 'Naturel'] },
      // MARSEILLE
      { user: null, nom_salon: 'Massilia Afro Style', specialite: 'Nattes & Vanilles',     categories: ['coiffure'], city: 'marseille', adresse: "10 rue d'Aubagne, 13001 Marseille",       telephone: '04 91 33 44 55', description: 'Nattes africaines et vanilles. Accueil chaleureux.',                     tarif_moyen: 80,  note: 4.6, nb_avis: 0, tags: ['Nattes', 'Vanilles'] },
      { user: null, nom_salon: 'Phocéenne Boucles',   specialite: 'Coupe & Coiffure Nat.', categories: ['coiffure'], city: 'marseille', adresse: '45 Avenue du Prado, 13008 Marseille',    telephone: '04 91 44 55 66', description: 'Wash & go, coupe afro et soins naturels à Marseille.',                  tarif_moyen: 70,  note: 4.8, nb_avis: 0, tags: ['Wash & Go', 'Coupe'] },
      // BORDEAUX
      { user: null, nom_salon: 'Bordeaux Afro Glow',  specialite: 'Box Braids & Curly',    categories: ['coiffure'], city: 'bordeaux', adresse: "12 Cours de l'Intendance, 33000 Bordeaux", telephone: '05 56 33 44 55', description: 'Box braids et curly cut à Bordeaux.',                                    tarif_moyen: 95,  note: 4.9, nb_avis: 0, tags: ['Box Braids', 'Curly'] },
      // NANTES
      { user: null, nom_salon: 'Nantes Nappy Queen',  specialite: 'Tresses & Coaching',    categories: ['coiffure'], city: 'nantes',   adresse: '14 rue de Verdun, 44000 Nantes',           telephone: '02 40 33 44 55', description: 'Tresses et coaching capillaire à Nantes.',                               tarif_moyen: 85,  note: 4.8, nb_avis: 0, tags: ['Tresses', 'Coaching'] },
      // LILLE
      { user: null, nom_salon: 'Lille Élégance Afro', specialite: 'Soins & Mariage',       categories: ['coiffure'], city: 'lille',    adresse: '21 rue Faidherbe, 59000 Lille',            telephone: '03 20 33 44 55', description: 'Soins protéinés et coiffures de mariage à Lille.',                      tarif_moyen: 100, note: 4.9, nb_avis: 0, tags: ['Mariage', 'Soins Protéinés'] },
    ]);
    console.log('18 prestataires créés');

    // ── Services ──
    const servicesData = [
      // MistralCare (coiffure)
      { salon: mistral._id, nom: 'Box Braids',               categorie: 'coiffure', duree: 180, prix: 120, acompte_pct: 30, description: 'Braids protectrices longue durée' },
      { salon: mistral._id, nom: 'Knotless Braids',          categorie: 'coiffure', duree: 210, prix: 130, acompte_pct: 30 },
      { salon: mistral._id, nom: 'Locks & Dreadlocks',       categorie: 'coiffure', duree: 150, prix: 100, acompte_pct: 30 },
      { salon: mistral._id, nom: 'Vanilles / Twists',        categorie: 'coiffure', duree: 120, prix: 80,  acompte_pct: 30 },
      { salon: mistral._id, nom: 'Soin Hydratant Profond',   categorie: 'coiffure', duree: 60,  prix: 45,  acompte_pct: 30 },

      // Nappy Queens (coiffure)
      { salon: nappyQueens._id, nom: 'Box Braids',           categorie: 'coiffure', duree: 180, prix: 120, acompte_pct: 30 },
      { salon: nappyQueens._id, nom: 'Knotless Braids',      categorie: 'coiffure', duree: 210, prix: 130, acompte_pct: 30 },
      { salon: nappyQueens._id, nom: 'Braids Butterfly',     categorie: 'coiffure', duree: 240, prix: 150, acompte_pct: 30 },
      { salon: nappyQueens._id, nom: 'Crochet Braids',       categorie: 'coiffure', duree: 180, prix: 110, acompte_pct: 30 },
      { salon: nappyQueens._id, nom: 'Coupe & Mise en Forme',categorie: 'coiffure', duree: 60,  prix: 50,  acompte_pct: 30 },

      // L'Atelier du Regard (cils)
      { salon: atelierRegard._id, nom: 'Extension Cil à Cil (Classique)', categorie: 'cils', duree: 90,  prix: 60,  acompte_pct: 30 },
      { salon: atelierRegard._id, nom: 'Volume Russe',                    categorie: 'cils', duree: 120, prix: 80,  acompte_pct: 30 },
      { salon: atelierRegard._id, nom: 'Mégavolume',                      categorie: 'cils', duree: 150, prix: 100, acompte_pct: 30 },
      { salon: atelierRegard._id, nom: 'Rehaussement de Cils',            categorie: 'cils', duree: 60,  prix: 55,  acompte_pct: 30 },
      { salon: atelierRegard._id, nom: 'Retouche Extension',              categorie: 'cils', duree: 60,  prix: 45,  acompte_pct: 30 },

      // Nail Gallery Paris (manucure)
      { salon: nailGallery._id, nom: 'Vernis Semi-Permanent', categorie: 'manucure', duree: 60,  prix: 35, acompte_pct: 30 },
      { salon: nailGallery._id, nom: 'Pose Gel / Capsules',   categorie: 'manucure', duree: 90,  prix: 55, acompte_pct: 30 },
      { salon: nailGallery._id, nom: 'French Manucure',       categorie: 'manucure', duree: 75,  prix: 45, acompte_pct: 30 },
      { salon: nailGallery._id, nom: 'Nail Art & Design',     categorie: 'manucure', duree: 120, prix: 70, acompte_pct: 30 },
      { salon: nailGallery._id, nom: 'Baby Boomer / Ombré',   categorie: 'manucure', duree: 90,  prix: 60, acompte_pct: 30 },

      // Studio Glam Paris (maquillage)
      { salon: studioGlam._id, nom: 'Maquillage Soirée / Glam', categorie: 'maquillage', duree: 60,  prix: 75,  acompte_pct: 30 },
      { salon: studioGlam._id, nom: 'Maquillage Mariée',         categorie: 'maquillage', duree: 120, prix: 150, acompte_pct: 30 },
      { salon: studioGlam._id, nom: 'Maquillage Jour / Naturel', categorie: 'maquillage', duree: 45,  prix: 50,  acompte_pct: 30 },
      { salon: studioGlam._id, nom: 'Maquillage Shooting',       categorie: 'maquillage', duree: 90,  prix: 100, acompte_pct: 30 },
    ];
    const createdServices = await Service.insertMany(servicesData);
    console.log(`${createdServices.length} services créés`);

    // Index rapide : salonId → services
    const servicesBySalon = {};
    for (const s of createdServices) {
      const key = s.salon.toString();
      if (!servicesBySalon[key]) servicesBySalon[key] = [];
      servicesBySalon[key].push(s);
    }

    // ── Employés ──
    const employesData = [
      // MistralCare
      { salon: mistral._id,    prenom: 'Aminata',   nom: 'S.', specialites: ['Box Braids', 'Locks'] },
      { salon: mistral._id,    prenom: 'Marlène',   nom: 'B.', specialites: ['Vanilles', 'Soins'] },
      // Nappy Queens
      { salon: nappyQueens._id, prenom: 'Fatoumata', nom: 'K.', specialites: ['Knotless Braids', 'Crochet'] },
      { salon: nappyQueens._id, prenom: 'Rosaline',  nom: 'D.', specialites: ['Box Braids', 'Butterfly'] },
      // L'Atelier du Regard
      { salon: atelierRegard._id, prenom: 'Chloé',  nom: 'M.', specialites: ['Volume Russe', 'Classique'] },
      // Nail Gallery Paris
      { salon: nailGallery._id, prenom: 'Inès',     nom: 'T.', specialites: ['Nail Art', 'Semi-Permanent'] },
      { salon: nailGallery._id, prenom: 'Laïla',    nom: 'A.', specialites: ['Gel', 'French'] },
      // Studio Glam Paris
      { salon: studioGlam._id, prenom: 'Nadia',     nom: 'F.', specialites: ['Mariée', 'Soirée'] },
    ];
    const createdEmployes = await Employe.insertMany(employesData);
    console.log(`${createdEmployes.length} employés créés`);

    // ── Disponibilités (5 prochains jours ouvrés pour chaque salon avec services) ──
    const salonsAvecServices = [mistral, nappyQueens, atelierRegard, nailGallery, studioGlam];
    let allCreneaux = [];
    const today = new Date();

    for (const salon of salonsAvecServices) {
      let jourAjoutes = 0;
      let offset = 1;
      while (jourAjoutes < 5) {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        d.setHours(0, 0, 0, 0);
        offset++;
        if (d.getDay() === 0) continue; // dimanche
        const dateStr = d.toISOString().split('T')[0];
        allCreneaux = allCreneaux.concat(genCreneaux(salon._id, null, dateStr, '09:00', '18:00', 60));
        jourAjoutes++;
      }
    }
    await Disponibilite.insertMany(allCreneaux);
    console.log(`${allCreneaux.length} créneaux générés`);

    // ── Bookings (avec vrais ObjectIds) ──
    const svcMistral   = servicesBySalon[mistral._id.toString()];
    const svcNappy     = servicesBySalon[nappyQueens._id.toString()];
    const svcAtelier   = servicesBySalon[atelierRegard._id.toString()];
    const svcNailGal   = servicesBySalon[nailGallery._id.toString()];
    const svcStudio    = servicesBySalon[studioGlam._id.toString()];

    const bookingsData = [
      {
        client: aminata._id, salon: mistral._id,
        service: svcMistral[0]._id, // Box Braids
        service_snapshot: { nom: svcMistral[0].nom, categorie: svcMistral[0].categorie, duree: svcMistral[0].duree, prix: svcMistral[0].prix },
        nomSalon: 'MistralCare', duration: 180,
        date_rendezvous: new Date('2026-04-15'), heure: '10:00',
        client_info: { firstName: 'Aminata', lastName: 'Diallo', email: 'aminata@test.com', phone: '06 11 22 33 44' },
        prix: 120, acompte: 36, paypalOrderId: 'SEED-ORDER-001', paypalStatus: 'COMPLETED', statut: 'confirmé',
      },
      {
        client: aminata._id, salon: atelierRegard._id,
        service: svcAtelier[1]._id, // Volume Russe
        service_snapshot: { nom: svcAtelier[1].nom, categorie: svcAtelier[1].categorie, duree: svcAtelier[1].duree, prix: svcAtelier[1].prix },
        nomSalon: "L'Atelier du Regard", duration: 120,
        date_rendezvous: new Date('2026-04-22'), heure: '14:00',
        client_info: { firstName: 'Aminata', lastName: 'Diallo', email: 'aminata@test.com', phone: '06 11 22 33 44' },
        prix: 80, acompte: 24, paypalOrderId: 'SEED-ORDER-002', paypalStatus: 'COMPLETED', statut: 'en attente',
      },
      {
        client: fatoumata._id, salon: nailGallery._id,
        service: svcNailGal[2]._id, // French Manucure
        service_snapshot: { nom: svcNailGal[2].nom, categorie: svcNailGal[2].categorie, duree: svcNailGal[2].duree, prix: svcNailGal[2].prix },
        nomSalon: 'Nail Gallery Paris', duration: 75,
        date_rendezvous: new Date('2026-02-10'), heure: '11:00',
        client_info: { firstName: 'Fatoumata', lastName: 'Konaté', email: 'fatoumata@test.com', phone: '06 55 66 77 88' },
        prix: 45, acompte: 14, paypalOrderId: 'SEED-ORDER-003', paypalStatus: 'COMPLETED', statut: 'terminé',
      },
      {
        client: sarah._id, salon: studioGlam._id,
        service: svcStudio[0]._id, // Maquillage Soirée
        service_snapshot: { nom: svcStudio[0].nom, categorie: svcStudio[0].categorie, duree: svcStudio[0].duree, prix: svcStudio[0].prix },
        nomSalon: 'Studio Glam Paris', duration: 60,
        date_rendezvous: new Date('2026-01-28'), heure: '16:00',
        client_info: { firstName: 'Sarah', lastName: 'Traoré', email: 'sarah@test.com', phone: '06 99 88 77 66' },
        prix: 75, acompte: 23, paypalOrderId: 'SEED-ORDER-004', paypalStatus: 'COMPLETED', statut: 'annulé',
      },
      {
        client: sarah._id, salon: nappyQueens._id,
        service: svcNappy[0]._id, // Box Braids
        service_snapshot: { nom: svcNappy[0].nom, categorie: svcNappy[0].categorie, duree: svcNappy[0].duree, prix: svcNappy[0].prix },
        nomSalon: 'Nappy Queens', duration: 180,
        date_rendezvous: new Date('2026-05-03'), heure: '09:00',
        client_info: { firstName: 'Sarah', lastName: 'Traoré', email: 'sarah@test.com', phone: '06 99 88 77 66' },
        prix: 120, acompte: 36, paypalOrderId: 'SEED-ORDER-005', paypalStatus: 'COMPLETED', statut: 'en attente',
      },
    ];

    for (const b of bookingsData) {
      await Booking.create(b);
    }
    console.log(`${bookingsData.length} réservations créées`);

    // ── Avis (sur le booking terminé de Fatoumata) ──
    // On récupère le booking terminé pour l'attacher à l'avis
    const bookingTermine = await Booking.findOne({ paypalOrderId: 'SEED-ORDER-003' });
    if (bookingTermine) {
      await Avis.create({
        salon: nailGallery._id,
        client: fatoumata._id,
        booking: bookingTermine._id,
        note: 5,
        commentaire: 'Prestation parfaite, Inès est une vraie pro ! Je recommande vivement.',
        visible: true,
      });
      console.log('1 avis créé');
    }

    // ─────────────────────────────────────────
    console.log('\n========================================');
    console.log('SEED TERMINÉ — Comptes de test :');
    console.log('========================================');
    console.log('CLIENT  | aminata@test.com        | password123');
    console.log('CLIENT  | fatoumata@test.com      | password123');
    console.log('CLIENT  | sarah@test.com          | password123');
    console.log('PRO     | pro@mistralcare.com     | password123  → MistralCare');
    console.log('PRO     | pro@nappyqueens.com     | password123  → Nappy Queens');
    console.log('ADMIN   | admin@nappybooking.com  | admin123');
    console.log('========================================');
    console.log('\nServices seedés pour :');
    console.log('  MistralCare (5), Nappy Queens (5), L\'Atelier du Regard (5)');
    console.log('  Nail Gallery Paris (5), Studio Glam Paris (4)');
    console.log(`\nDisponibilités : 5 jours ouvrés × ${salonsAvecServices.length} salons`);
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Erreur seed :', err);
    process.exit(1);
  }
};

seed();

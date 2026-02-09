# API Design - NappyBooking

## 1. Schémas de Données (Modèles Mongoose)

### User (Clients & Prestataires)

- `id`: ObjectId
- `nom_client`: String
- `prenom_client`: String
- `email`: String (unique)
- `mdp`: String (hashé)
- `tel`: String
- `role`: Enum ["client", "prestataire", "admin"]
- `favoris`: [ObjectId(Prestataire)]

### Prestataire (Salon / Coiffeur)

- `id`: ObjectId
- `user_id`: ObjectId (Lien vers User)
- `nom_enseigne`: String
- `adresse_pro`: { rue, ville, cp, coords: { lat, lng } }
- `portfolio`: [String] (URLs images)
- `types_cheveux`: [String] (ex: "4C", "Locks")
- `catalogue_services`: [
  { nom_serv: String, prix_serv: Number, duree_min: Number, libelle: String }
  ]
- `horaires`: {
  lundi: { ouvert: Boolean, debut: String, fin: String },
  // ... etc
  }
- `note_moyenne`: Number

### Rendez-vous (Booking)

- `id`: ObjectId
- `client_id`: ObjectId
- `prestataire_id`: ObjectId
- `service`: { nom: String, prix: Number }
- `date_rdv`: DateTime
- `statut_rdv`: Enum ["en_attente", "confirme", "annule", "termine"]
- `stripe_payment_id`: String
- `acompte_paye`: Boolean

---

## 2. Endpoints de l'API (Routes REST)

### Points d'extrémités (NappyBooking)

### CRUD

1. Inscription (Créer un compte)
   HTTP POST
   URL : /api/auth/register

Request body : Informations de l'utilisateur (nom, email, mdp, rôle)
Response : \* 201 : Utilisateur créé avec succès
400 : L'utilisateur existe déjà
500 : Erreur d'application

2. Connexion (S'authentifier)
   HTTP POST
   URL : /api/auth/login

Request body : Email et mot de passe
Response : \* 200 : Succès (Retourne le Token JWT pour la session)
401 : Identifiants incorrects
500 : Erreur d'application

3. Afficher tous les salons (Prestataires)
   HTTP GET
   URL : /api/shops

Response : \* 200 : Liste de tous les salons trouvés
404 : Aucun salon trouvé
500 : Erreur d'application

4. Lire les détails d'un salon via son ID
   HTTP GET
   URL : /api/shops/:id

Response : \* 200 : Détails du salon (services, photos, horaires)
404 : Salon non trouvé
500 : Erreur d'application

5. Créer une réservation (Prendre RDV)
   HTTP POST
   URL : /api/bookings

Request body : ID prestataire, ID service, date, heure
Response : \* 201 : Réservation créée (prête pour paiement Stripe)
400 : Créneau indisponible
500 : Erreur d'application

6. Mise à jour d'un profil Salon (Pour le pro)
   HTTP PUT
   URL : /api/shops/me

Request body : Nouvelles infos (tarifs, photos, adresse)
Response : \* 200 : Profil mis à jour avec succès
403 : Non autorisé (si tu n'es pas le propriétaire)
500 : Erreur d'application

7. Annuler une réservation
   HTTP DELETE (ou PATCH pour changer le statut)
   URL : /api/bookings/:id

Response : \* 200 : Réservation annulée
404 : Réservation non trouvée
500 : Erreur d'application

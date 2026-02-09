const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // 1. On importe le fichier de connexion
const authRoutes = require('./routes/authRoutes');


// Chargement des variables d'environnement
dotenv.config();

// 2. On exécute la connexion à MongoDB
// déclenche le message "MongoDB Connecté"
connectDB(); 

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 


// Route de test

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('L\'API NappyBooking est en ligne !');
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
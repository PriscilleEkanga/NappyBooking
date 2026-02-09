const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // On tente de se connecter avec l'URI qui est dans ton fichier .env
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // Si ça réussit, on affiche l'hôte (le serveur de MongoDB Atlas)
        console.log(`MongoDB Connecté : ${conn.connection.host}`);
    } catch (error) {
        // Si ça échoue (mauvais mot de passe, adresse IP non autorisée...), on affiche l'erreur
        console.error(`Erreur de connexion : ${error.message}`);
        process.exit(1); // On arrête le serveur car sans base de données, rien ne marchera
    }
};

module.exports = connectDB;
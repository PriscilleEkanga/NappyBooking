const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes          = require('./routes/authRoutes');
const prestataireRoutes   = require('./routes/prestataireRoutes');
const bookingRoutes       = require('./routes/bookingRoutes');
const adminRoutes         = require('./routes/adminRoutes');
const serviceRoutes       = require('./routes/serviceRoutes');
const employeRoutes       = require('./routes/employeRoutes');
const disponibiliteRoutes = require('./routes/disponibiliteRoutes');
const avisRoutes          = require('./routes/avisRoutes');
const categorieRoutes     = require('./routes/categorieRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',            authRoutes);
app.use('/api/prestataires',    prestataireRoutes);
app.use('/api/bookings',        bookingRoutes);
app.use('/api/admin',           adminRoutes);
app.use('/api/services',        serviceRoutes);
app.use('/api/employes',        employeRoutes);
app.use('/api/disponibilites',  disponibiliteRoutes);
app.use('/api/avis',            avisRoutes);
app.use('/api/categories',      categorieRoutes);

app.get('/', (req, res) => res.send("L'API NappyBooking est en ligne !"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DevenirPartenaire from './pages/DevenirPartenaire';
import Login from './pages/Login';
import Coiffeuses from './pages/Coiffeuses';
import Manucure from './pages/Manucure';
import Maquillage from './pages/Maquillage';
import Cils from './pages/Cils';
import ProfilSalon from './pages/ProfilSalon'; 
import Register from './pages/Register';
import DashboardClient from './pages/DashboardClient';
import DashboardPro from './pages/DashboardPro'; 
import ManageServices from './pages/ManageServices';
import BookingForm from './pages/BookingForm';
import MesRdv from './pages/MesRdv';
import Planning from './pages/Planning';
import ManageEmployees from './pages/ManageEmployees';



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Route Accueil */}
        <Route path="/" element={<Home />} />
        
        {/* Route Devenir Partenaire */}
        <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
        
        {/* Route Connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Routes Coiffure */}
        <Route path="/coiffeuses" element={<Coiffeuses />} />
        <Route path="/coiffeuses/:city" element={<Coiffeuses />} />

        {/* Routes Manucure */}
        <Route path="/manucure" element={<Manucure />} />
        <Route path="/manucure/:city" element={<Manucure />} />

        {/* Routes Maquillage */}
        <Route path="/maquillage" element={<Maquillage />} />
        <Route path="/maquillage/:city" element={<Maquillage />} />

        {/* Routes Extensions de Cils */}
        <Route path="/cils" element={<Cils />} />
        <Route path="/cils/:city" element={<Cils />} />

        {/* Route Profil Salon (Fiche détaillée) */}
        <Route path="/salon/:id" element={<ProfilSalon />} />
        
        {/* Route s'authentifier */}
        <Route path="/register" element={<Register />} />

        {/* --- ROUTES TABLEAUX DE BORD --- */}
        {/* Tableau de bord du client */}
        <Route path="/dashboard-client" element={<DashboardClient />} />
        
        {/* Nouveau : Tableau de bord prestataire (Coiffeuses/Salons) */}
        <Route path="/dashboard-pro" element={<DashboardPro />} />

        {/* Gérer les prestations*/}
        <Route path="/manage-services" element={<ManageServices />} />

        {/* Formulaire de réservation avec catégorie */}
        <Route path="/booking/:salonId" element={<BookingForm />} />
        
        {/*RDV Client */}
        <Route path="/mes-rdv" element={<MesRdv />} />

        {/* Planning Pro */}
        <Route path="/planning" element={<Planning />} />

        {/* Gestion équipe */}
        <Route path="/manage-employees" element={<ManageEmployees />} />
      </Routes>
    </>
  );
}

export default App;
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Pages chargées immédiatement (page d'accueil uniquement)
import Home from './pages/Home';

// Toutes les autres pages en lazy loading
const DevenirPartenaire = lazy(() => import('./pages/DevenirPartenaire'));
const Login             = lazy(() => import('./pages/Login'));
const Register          = lazy(() => import('./pages/Register'));
const Coiffeuses        = lazy(() => import('./pages/Coiffeuses'));
const Manucure          = lazy(() => import('./pages/Manucure'));
const Maquillage        = lazy(() => import('./pages/Maquillage'));
const Cils              = lazy(() => import('./pages/Cils'));
const ProfilSalon       = lazy(() => import('./pages/ProfilSalon'));
const DashboardClient   = lazy(() => import('./pages/DashboardClient'));
const DashboardPro      = lazy(() => import('./pages/DashboardPro'));
const ManageServices    = lazy(() => import('./pages/ManageServices'));
const ManageEmployees   = lazy(() => import('./pages/ManageEmployees'));
const BookingForm       = lazy(() => import('./pages/BookingForm'));
const MesRdv            = lazy(() => import('./pages/MesRdv'));
const Planning          = lazy(() => import('./pages/Planning'));

// Spinner affiché pendant le chargement d'une page
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid #F0E8E3', borderTop: '3px solid #B37256', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/coiffeuses"         element={<Coiffeuses />} />
          <Route path="/coiffeuses/:city"   element={<Coiffeuses />} />
          <Route path="/manucure"           element={<Manucure />} />
          <Route path="/manucure/:city"     element={<Manucure />} />
          <Route path="/maquillage"         element={<Maquillage />} />
          <Route path="/maquillage/:city"   element={<Maquillage />} />
          <Route path="/cils"               element={<Cils />} />
          <Route path="/cils/:city"         element={<Cils />} />
          <Route path="/salon/:id"          element={<ProfilSalon />} />
          <Route path="/booking/:salonId"   element={<BookingForm />} />
          <Route path="/dashboard-client"   element={<DashboardClient />} />
          <Route path="/mes-rdv"            element={<MesRdv />} />
          <Route path="/dashboard-pro"      element={<DashboardPro />} />
          <Route path="/manage-services"    element={<ManageServices />} />
          <Route path="/manage-employees"   element={<ManageEmployees />} />
          <Route path="/planning"           element={<Planning />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

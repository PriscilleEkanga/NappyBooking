import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DevenirPartenaire from './pages/DevenirPartenaire';
import Login from './pages/Login';
import Coiffeuses from './pages/Coiffeuses';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Route Accueil */}
        <Route path="/" element={<Home />} />
        
        {/* Route Devenir Partenaire */}
        <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
        
        {/* Route Connexion - Sortie des commentaires pour être active */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/coiffeuses" element={<Coiffeuses />} />
        <Route path="/coiffeuses/:city" element={<Coiffeuses />} />
      </Routes>
    </>
  );
}

export default App;
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import userIcon from '../assets/favicon-user.png';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // --- CORRECTION : INITIALISATION DIRECTE (Anti-ESLint Error) ---
  const [user, setUser] = useState(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    return auth === 'true' ? { role, name } : null;
  });

  useEffect(() => {
    // 1. Synchronisation de l'utilisateur quand l'URL change (navigation)
    const syncUser = () => {
      const auth = localStorage.getItem('isAuthenticated');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName');
      
      if (auth === 'true') {
        // On ne met à jour que si les données ont changé pour éviter des rendus inutiles
        setUser(prev => (prev?.name === name && prev?.role === role) ? prev : { role, name });
      } else {
        setUser(null);
      }
    };

    syncUser();

    // 2. Gestionnaires d'événements
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 992);
      if (width >= 992) setMenuOpen(false);
    };
    
    // Écoute les changements de storage (utile si déconnexion sur un autre onglet)
    const handleStorageChange = () => syncUser();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]); 

  const colors = {
    terracotta: '#B37256',
    porcelain: '#FAF9F6',
    black: '#1A1A1A',
    white: '#FFFFFF',
  };

  const bgColor = !isHomePage ? colors.porcelain : (isScrolled ? colors.porcelain : 'transparent');
  const textColor = !isHomePage ? colors.black : (isScrolled ? colors.black : colors.white);
  const logoFilter = !isHomePage ? 'none' : (isScrolled ? 'none' : 'brightness(0) invert(1)');

  const navLinkStyle = {
    textDecoration: 'none',
    color: textColor,
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const dropdownItemStyle = {
    padding: '12px 20px',
    textDecoration: 'none',
    color: colors.black,
    fontSize: '0.9rem',
    display: 'block',
    transition: 'background 0.2s',
    fontWeight: '500'
  };

  const getDashboardPath = () => {
    return (user?.role === 'prestataire' || user?.role === 'admin') ? '/dashboard-pro' : '/dashboard-client';
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: isMobile ? '0 20px' : '0 60px', 
      height: isMobile ? '80px' : '100px',
      backgroundColor: bgColor,
      boxShadow: (!isHomePage || isScrolled) ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
      position: 'fixed', 
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      transition: 'all 0.4s ease'
    }}>
      
      {/* --- GAUCHE --- */}
      <div style={{ flex: isMobile ? 1 : 'none' }}>
        {isMobile ? (
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            style={{ background: 'none', border: 'none', fontSize: '1.8rem', color: textColor, cursor: 'pointer' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        ) : (
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{ height: '95px', filter: logoFilter, transition: 'all 0.3s ease', marginTop: '5px' }} 
            />
          </Link>
        )}
      </div>

      {/* --- MILIEU (Mobile) --- */}
      {isMobile && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: '90px', filter: logoFilter, transition: 'all 0.3s ease' }} />
          </Link>
        </div>
      )}

      {/* --- DROITE --- */}
      <div style={{ flex: isMobile ? 1 : 'none', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '30px' }}>
        {!isMobile ? (
          <>
            <Link to="/coiffeuses" style={navLinkStyle}>Coiffeuses</Link>
            <Link to="/manucure" style={navLinkStyle}>Manucure</Link>
            
            <div 
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <div style={navLinkStyle}>
                Services <span style={{ fontSize: '0.7rem', marginLeft: '5px' }}>▼</span>
              </div>
              
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '70%', left: 0,
                  backgroundColor: colors.white, borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: '180px',
                  overflow: 'hidden', padding: '10px 0', zIndex: 1001
                }}>
                  <Link to="/maquillage" style={dropdownItemStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Maquillage</Link>
                  <Link to="/cils" style={dropdownItemStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Extensions de cils</Link>
                </div>
              )}
            </div>
            
            <Link to="/devenir-partenaire" style={{ ...navLinkStyle, color: (isHomePage && !isScrolled) ? colors.white : colors.terracotta, fontWeight: '600' }}>
              Devenir Prestataire
            </Link>

            <Link to={user ? getDashboardPath() : "/login"} style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
              backgroundColor: colors.terracotta, padding: '10px 20px', borderRadius: '8px',
              color: colors.white, fontWeight: '700', fontSize: '0.9rem'
            }}>
              {user ? `Mon Espace (${user.name})` : 'Se connecter'}
            </Link>
          </>
        ) : (
          <Link to={user ? getDashboardPath() : "/login"} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: isScrolled ? colors.black : 'rgba(0,0,0,0.6)', 
            padding: '8px', borderRadius: '12px', width: '40px', height: '40px'
          }}>
            <img src={userIcon} alt="Profile" style={{ height: '22px', filter: 'brightness(0) invert(1)' }} />
          </Link>
        )}
      </div>

      {/* --- MENU MOBILE --- */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute', top: '80px', left: 0, right: 0,
          backgroundColor: colors.white, display: 'flex', flexDirection: 'column', 
          padding: '20px', gap: '15px', boxShadow: '0 10px 10px rgba(0,0,0,0.1)',
          borderTop: '1px solid #eee'
        }}>
          <Link to="/coiffeuses" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontSize: '1.1rem' }}>Coiffeuses</Link>
          <Link to="/manucure" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontSize: '1.1rem' }}>Manucure</Link>
          <Link to="/maquillage" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontSize: '1.1rem' }}>Maquillage</Link>
          <Link to="/cils" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontSize: '1.1rem' }}>Extensions de cils</Link>
          
          <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
          
          <Link to="/devenir-partenaire" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.terracotta, fontWeight: '700', fontSize: '1.1rem' }}>Devenir Prestataire</Link>
          <Link to={user ? getDashboardPath() : "/login"} onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontWeight: '600', fontSize: '1.1rem' }}>
            {user ? "Mon Tableau de bord" : "Se connecter"}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
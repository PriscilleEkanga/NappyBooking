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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 992);
      if (width >= 992) setMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    alignItems: 'center'
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
      
      {/* --- GAUCHE : Burger (Mobile) ou Logo (Desktop) --- */}
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
              style={{ 
                height: '95px', 
                width: 'auto',
                filter: logoFilter,
                transition: 'all 0.3s ease',
                marginTop: '5px' 
              }} 
            />
          </Link>
        )}
      </div>

      {/* --- MILIEU : Logo (Uniquement Mobile) --- */}
      {isMobile && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link to="/">
            <img 
              src={logo} 
              alt="Logo" 
              style={{ 
                height: '90px', 
                width: 'auto',
                filter: logoFilter,
                transition: 'all 0.3s ease'
              }} 
            />
          </Link>
        </div>
      )}

      {/* --- DROITE : Liens --- */}
      <div style={{ flex: isMobile ? 1 : 'none', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '30px' }}>
        {!isMobile ? (
          <>
            <Link to="/coiffeuses" style={navLinkStyle}>Coiffeuses</Link>
            <Link to="/manucure" style={navLinkStyle}>Manucure</Link>
            <div style={{ ...navLinkStyle, cursor: 'pointer' }}>Services <span style={{ fontSize: '0.7rem', marginLeft: '5px' }}>▼</span></div>
            
            <Link to="/devenir-partenaire" style={{ ...navLinkStyle, color: (isHomePage && !isScrolled) ? colors.white : colors.terracotta, fontWeight: '600' }}>
              Devenir Prestataire
            </Link>

            <Link to="/login" style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
              backgroundColor: colors.terracotta, padding: '10px 20px', borderRadius: '8px',
              color: colors.white, fontWeight: '700', fontSize: '0.9rem'
            }}>
              Se connecter
            </Link>
          </>
        ) : (
          <Link to="/login" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: isScrolled ? colors.black : 'rgba(0,0,0,0.6)', 
            padding: '8px',
            borderRadius: '12px',
            width: '40px',
            height: '40px'
          }}>
            <img src={userIcon} alt="Profile" style={{ height: '22px', filter: 'brightness(0) invert(1)' }} />
          </Link>
        )}
      </div>

      {/* --- MENU MOBILE DÉROULANT --- */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute', top: '80px', left: 0, right: 0,
          backgroundColor: colors.white, display: 'flex', flexDirection: 'column', 
          padding: '20px', gap: '20px', boxShadow: '0 10px 10px rgba(0,0,0,0.1)',
          borderTop: '1px solid #eee'
        }}>
          <Link to="/coiffeuses" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontSize: '1.1rem' }}>Coiffeuses</Link>
          <Link to="/manucure" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontSize: '1.1rem' }}>Manucure</Link>
          <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #eee' }} />
          <Link to="/devenir-partenaire" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.terracotta, fontWeight: '700', fontSize: '1.1rem' }}>Devenir Prestataire</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: colors.black, fontWeight: '600', fontSize: '1.1rem' }}>
            Se connecter
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('client');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = {
    terracotta: '#B37256',
    terracottaLight: '#E8D5CC',
    black: '#1A1A1A',
    porcelain: '#FAF9F6',
    white: '#FFFFFF',
    gray: '#666',
    success: '#2D5A27'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #eee',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: colors.white
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* --- PARTIE GAUCHE : ARGUMENTS (Masquée sur Mobile) --- */}
      {!isMobile && (
        <div style={{ 
          flex: 1.2, 
          backgroundColor: colors.terracottaLight, 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '60px',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            {/* On utilise /logo.png car il est dans le dossier public */}
            <img src="/logo.png" alt="NappyBooking" style={{ height: '80px', marginBottom: '40px' }} />
            
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: colors.black, lineHeight: '1.2', marginBottom: '20px' }}>
              La façon simple de réserver une coiffure Afro en France : une experte qui vous comprend.
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: colors.black, opacity: 0.8, marginBottom: '30px', lineHeight: '1.6' }}>
              Connectez-vous gratuitement avec des coiffeuses expertes qui comprennent et célèbrent vos cheveux Afro uniques.
            </p>

            <div style={{ marginBottom: '40px', fontWeight: '600', color: colors.black }}>
              📍 Disponible à Paris, Lyon, Marseille, Bordeaux, Lille et partout en France.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {["Protection Absence", "Zéro mauvaise surprise", "Réservation en 2 min", "Portfolios & avis réels"].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: '500' }}>
                  <span style={{ color: colors.success, fontWeight: 'bold' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- PARTIE DROITE : FORMULAIRE --- */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.porcelain,
        padding: '20px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '420px', 
          backgroundColor: colors.white, 
          padding: '40px', 
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.black }}>Bon retour !</h2>
            <p style={{ color: colors.gray, fontSize: '0.9rem', marginTop: '5px' }}>Accédez à votre espace NappyBooking</p>
          </div>

          {/* TABS STYLE AFRO */}
          <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #eee' }}>
            {['client', 'pro'].map((tab) => (
              <button 
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '15px', border: 'none', background: 'none', cursor: 'pointer',
                  fontWeight: '700', fontSize: '0.95rem',
                  color: activeTab === tab ? colors.terracotta : colors.gray,
                  borderBottom: activeTab === tab ? `3px solid ${colors.terracotta}` : '3px solid transparent',
                  transition: '0.3s'
                }}
              >
                {tab === 'client' ? 'Client' : 'Professionnel'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.85rem' }}>Email</label>
              <input type="email" placeholder="votre@email.com" style={inputStyle} required />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.85rem' }}>Mot de passe</label>
              <input type="password" placeholder="••••••••" style={inputStyle} required />
            </div>

            <Link to="/forgot-password" style={{ color: colors.terracotta, fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', textAlign: 'right' }}>
              Mot de passe oublié ?
            </Link>

            <button type="submit" style={{
               padding: '16px', borderRadius: '10px', border: 'none',
               backgroundColor: colors.black, color: colors.white, fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
               marginTop: '10px'
            }}>
              Se connecter en tant que {activeTab === 'client' ? 'Client' : 'Pro'}
            </button>
          </form>

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

          <p style={{ textAlign: 'center', color: colors.gray, fontSize: '0.9rem' }}>
            {activeTab === 'client' ? "Nouveau sur la plateforme ?" : "Pas encore partenaire ?"} <br/>
            <Link 
              to={activeTab === 'client' ? "/register" : "/devenir-partenaire"} 
              style={{ color: colors.terracotta, fontWeight: '700', textDecoration: 'none', display: 'inline-block', marginTop: '5px' }}
            >
              {activeTab === 'client' ? "Créer un compte gratuitement" : "Inscrire mon établissement"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

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

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: colors.white,
    marginTop: '5px'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.porcelain }}>
      
      {/* --- PARTIE GAUCHE (Uniquement sur PC) --- */}
      {!isMobile && (
        <div style={{ 
          flex: 1.2, 
          backgroundColor: colors.terracottaLight, 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '80px',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '520px' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              color: colors.black, 
              lineHeight: '1.1', 
              marginBottom: '24px'
            }}>
              La façon simple de réserver une coiffure Afro en France : une experte qui vous comprend.
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: colors.black, opacity: 0.85, marginBottom: '40px' }}>
              Connectez-vous gratuitement avec des coiffeuses expertes qui célèbrent vos cheveux Afro uniques.
            </p>

            <p style={{ marginBottom: '48px', fontSize: '1.1rem', fontWeight: '600' }}>
              📍 Disponible à Paris, Lyon, Marseille, Bordeaux, Lille et partout en France.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                "Protection Absence", 
                "Zéro mauvaise surprise", 
                "Réservation en 2 min", 
                "Portfolios & avis réels"
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: '600' }}>
                  <span style={{ color: colors.success }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- PARTIE DROITE (Formulaire) --- */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', // Pour éviter que le haut soit mangé
        padding: isMobile ? '20px' : '60px 20px',
        overflowY: 'auto'
      }}>
        
        {/* On enlève toute référence au logo ici pour le mobile */}
        <div style={{ 
          marginTop: isMobile ? '40px' : '80px', 
          width: '100%', 
          maxWidth: '420px',
          backgroundColor: colors.white, 
          padding: '40px', 
          borderRadius: '28px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.05)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.black }}>Bon retour !</h2>
            <p style={{ color: colors.gray, fontSize: '0.95rem', marginTop: '8px' }}>Accédez à votre espace NappyBooking</p>
          </div>

          {/* ONGLETS SEGMENTÉS */}
          <div style={{ display: 'flex', marginBottom: '32px', backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '4px' }}>
            {['client', 'pro'].map((tab) => (
              <button 
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, 
                  padding: '12px', 
                  border: 'none', 
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700', 
                  backgroundColor: activeTab === tab ? colors.white : 'transparent',
                  color: activeTab === tab ? colors.terracotta : colors.gray,
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: '0.3s'
                }}
              >
                {tab === 'client' ? 'Client' : 'Professionnel'}
              </button>
            ))}
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Email</label>
              <input type="email" placeholder="votre@email.com" style={inputStyle} required />
            </div>
            
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Mot de passe</label>
              <input type="password" placeholder="••••••••" style={inputStyle} required />
            </div>

            <button type="submit" style={{
              padding: '16px', borderRadius: '12px', border: 'none',
              backgroundColor: colors.black, color: colors.white, fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
              marginTop: '10px'
            }}>
              Se connecter
            </button>
          </form>

          <p style={{ textAlign: 'center', color: colors.gray, fontSize: '0.95rem', marginTop: '32px' }}>
            {activeTab === 'client' ? "Nouveau sur la plateforme ?" : "Pas encore partenaire ?"} <br/>
            <Link 
              to={activeTab === 'client' ? "/register" : "/devenir-partenaire"} 
              style={{ color: colors.terracotta, fontWeight: '700', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}
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
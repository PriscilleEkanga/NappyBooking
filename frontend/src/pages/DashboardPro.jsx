import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- IMPORT DES IMAGES LOCALES ---
import braidsImg from '../assets/braids.jpg';
import loxeImg from '../assets/loxe.jpg';
import laceImg from '../assets/lace.jpg';

const DashboardPro = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Référence pour l'explorateur de fichiers
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [salonName] = useState(() => localStorage.getItem('userName') || 'Mon Salon');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = {
    terracotta: '#B37256',
    black: '#1A1A1A',
    white: '#FFFFFF',
    porcelain: '#FAF9F6',
    gray: '#717171',
    success: '#2D5A27',
    gold: '#C5A059'
  };

  // --- LOGIQUE POUR L'EXPLORATEUR DE FICHIERS ---
  const handleAddPhotoClick = () => {
    fileInputRef.current.click(); // Simule un clic sur l'input caché
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Photo sélectionnée : ${file.name}\n(La logique d'upload sera connectée à la base de données plus tard)`);
    }
  };

  const stats = [
    { label: "Revenus (Fév)", value: "1,240€" },
    { label: "Rendez-vous", value: "12" },
    { label: "Note Client", value: "4.9/5" }
  ];

  const nextAppointments = [
    { id: 1, client: "Léa Z.", service: "Knotless Braids", time: "14:00", status: "Payé" },
    { id: 2, client: "Moussa D.", service: "Contours + Soin", time: "16:30", status: "En attente" },
  ];

  const galleryImages = [braidsImg, loxeImg, laceImg];

  const cardStyle = {
    backgroundColor: colors.white,
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  };

  return (
    <div style={{ padding: '100px 20px 60px', backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Espace Pro : {salonName} </h1>
            <p style={{ color: colors.gray }}>Gérez votre activité et votre vitrine.</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer', fontWeight: '600', backgroundColor: colors.white }}
          >
            Déconnexion
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ color: colors.gray, fontSize: '0.9rem', fontWeight: '600' }}>{stat.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '5px' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '30px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* PLANNING */}
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '20px' }}>Prochains rendez-vous</h3>
              {nextAppointments.map(app => (
                <div key={app.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F0F0F0', gap: '15px' }}>
                  <div style={{ fontWeight: '800', color: colors.terracotta, minWidth: '60px' }}>{app.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700' }}>{app.client}</div>
                    <div style={{ fontSize: '0.85rem', color: colors.gray }}>{app.service}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: colors.success }}>{app.status}</span>
                </div>
              ))}
            </div>

            {/* SECTION GALERIE PHOTO DYNAMIQUE */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Ma Galerie Réalisations</h3>
                
                {/* Bouton qui déclenche l'explorateur de fichiers */}
                <button 
                  onClick={handleAddPhotoClick}
                  style={{ padding: '8px 15px', backgroundColor: colors.porcelain, border: '1px dashed ' + colors.gray, borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  + Ajouter
                </button>

                {/* Input de fichier caché */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {galleryImages.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`Réalisation ${index}`} 
                    style={{ 
                        width: '100%', 
                        height: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '12px', 
                        border: '2px solid #eee',
                        transition: 'transform 0.2s'
                    }} 
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ACTIONS RAPIDES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ ...cardStyle, backgroundColor: colors.black, color: colors.white }}>
              <h3 style={{ marginBottom: '15px' }}>Ma Vitrine</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '20px' }}>Modifiez vos prix et vos services pour attirer plus de clients.</p>
              
              {/* Bouton redirigeant vers ManageServices */}
              <button 
                onClick={() => navigate('/manage-services')}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: colors.terracotta, color: 'white', fontWeight: '700', cursor: 'pointer', marginBottom: '10px' }}
              >
                Gérer mes prestations
              </button>
              <button
                onClick={() => navigate('/planning')}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: 'white', fontWeight: '700', cursor: 'pointer', marginBottom: '10px' }}
              >
                Voir mon planning
              </button>
              <button
                onClick={() => navigate('/manage-employees')}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: 'white', fontWeight: '700', cursor: 'pointer' }}
              >
                Mon equipe
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPro;
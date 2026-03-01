import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';

// Catalogue des prestations par catégorie (identique à BookingForm)
const SERVICES_CATALOGUE = {
  coiffure: [
    { id: 1, name: "Box Braids", price: 120, duration: "180 min" },
    { id: 2, name: "Vanilles / Twists", price: 80, duration: "120 min" },
    { id: 3, name: "Locks & Dreadlocks", price: 100, duration: "150 min" },
    { id: 4, name: "Pose Lace Wig", price: 90, duration: "90 min" },
    { id: 5, name: "Braids Butterfly", price: 150, duration: "240 min" },
    { id: 6, name: "Passes Mèches Américaines", price: 85, duration: "120 min" },
    { id: 7, name: "Knotless Braids", price: 130, duration: "210 min" },
    { id: 8, name: "Crochet Braids", price: 110, duration: "180 min" },
    { id: 9, name: "Soin Hydratant Profond", price: 45, duration: "60 min" },
    { id: 10, name: "Coupe & Mise en Forme", price: 50, duration: "60 min" },
  ],
  cils: [
    { id: 1, name: "Extension Cil à Cil (Classique)", price: 60, duration: "90 min" },
    { id: 2, name: "Volume Russe", price: 80, duration: "120 min" },
    { id: 3, name: "Mégavolume", price: 100, duration: "150 min" },
    { id: 4, name: "Rehaussement de Cils", price: 55, duration: "60 min" },
    { id: 5, name: "Restructuration Sourcils", price: 40, duration: "45 min" },
    { id: 6, name: "Teinture Cils + Sourcils", price: 30, duration: "30 min" },
    { id: 7, name: "Retouche Extension", price: 45, duration: "60 min" },
  ],
  manucure: [
    { id: 1, name: "Vernis Semi-Permanent", price: 35, duration: "60 min" },
    { id: 2, name: "Pose Gel / Capsules", price: 55, duration: "90 min" },
    { id: 3, name: "French Manucure", price: 45, duration: "75 min" },
    { id: 4, name: "Unicolore Simple", price: 25, duration: "45 min" },
    { id: 5, name: "Nail Art & Design", price: 70, duration: "120 min" },
    { id: 6, name: "Soin Complet des Mains", price: 40, duration: "60 min" },
    { id: 7, name: "Baby Boomer / Ombré", price: 60, duration: "90 min" },
  ],
  maquillage: [
    { id: 1, name: "Maquillage Jour / Naturel", price: 50, duration: "45 min" },
    { id: 2, name: "Maquillage Soirée / Glam", price: 75, duration: "60 min" },
    { id: 3, name: "Maquillage Mariée", price: 150, duration: "120 min" },
    { id: 4, name: "Maquillage Shooting", price: 100, duration: "90 min" },
    { id: 5, name: "Cours Auto-Maquillage", price: 90, duration: "90 min" },
    { id: 6, name: "Maquillage Événementiel", price: 80, duration: "60 min" },
  ],
};

const categoryLabels = {
  coiffure: 'Coiffure Afro',
  cils: 'Extensions de Cils',
  manucure: 'Manucure & Ongles',
  maquillage: 'Maquillage',
};

const categoryRoutes = {
  coiffure: '/coiffeuses',
  cils: '/cils',
  manucure: '/manucure',
  maquillage: '/maquillage',
};

const ProfilSalon = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Lecture des données du salon depuis l'URL ---
  const category = searchParams.get('category') || 'coiffure';
  const salonName = searchParams.get('name') ? decodeURIComponent(searchParams.get('name')) : 'Salon NappyBooking';
  const salonAddress = searchParams.get('address') ? decodeURIComponent(searchParams.get('address')) : '';
  const salonRating = searchParams.get('rating') || '4.9';
  const salonPrice = searchParams.get('price') ? decodeURIComponent(searchParams.get('price')) : '';
  const salonImg = searchParams.get('img') ? decodeURIComponent(searchParams.get('img')) : null;
  const salonImages = (() => {
    try {
      const raw = searchParams.get('images');
      if (raw) return JSON.parse(decodeURIComponent(raw));
      return salonImg ? [salonImg] : [];
    } catch { return salonImg ? [salonImg] : []; }
  })();
  const salonTags = (() => {
    try { return JSON.parse(decodeURIComponent(searchParams.get('tags') || '[]')); }
    catch { return []; }
  })();

  const services = SERVICES_CATALOGUE[category] || SERVICES_CATALOGUE.coiffure;

  const colors = {
    terracotta: '#B37256',
    black: '#1A1A1A',
    gray: '#717171',
    lightGray: '#F5F5F5',
    porcelain: '#FAF9F6',
    white: '#FFFFFF',
    border: '#E5E5E5',
  };

  const handleBookingClick = () => {
    const auth = localStorage.getItem('isAuthenticated');
    const params = `category=${category}&name=${encodeURIComponent(salonName)}&address=${encodeURIComponent(salonAddress)}`;
    if (auth === 'true') {
      navigate(`/booking/${id}?${params}`);
    } else {
      localStorage.setItem('redirectAfterLogin', `/booking/${id}?${params}`);
      navigate('/login');
    }
  };

  return (
    <div style={{ paddingTop: '100px', backgroundColor: colors.white, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        {/* --- BREADCRUMB --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: colors.gray, textDecoration: 'none' }}>Accueil</Link>
          <span style={{ color: colors.gray }}>›</span>
          <Link to={categoryRoutes[category]} style={{ color: colors.gray, textDecoration: 'none' }}>
            {categoryLabels[category]}
          </Link>
          <span style={{ color: colors.gray }}>›</span>
          <span style={{ color: colors.black, fontWeight: '600' }}>{salonName}</span>
        </div>

        {/* --- EN-TÊTE SALON --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', fontWeight: '800', margin: 0 }}>
                {salonName}
              </h1>
              <span style={{
                backgroundColor: '#FDF5F1', color: colors.terracotta,
                padding: '4px 12px', borderRadius: '20px',
                fontSize: '0.8rem', fontWeight: '700',
                border: `1px solid ${colors.terracotta}30`
              }}>
                {categoryLabels[category]}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '700', color: colors.terracotta }}>★ {salonRating}</span>
              <span style={{ color: colors.gray }}>•</span>
              <span style={{ color: colors.gray, fontSize: '0.95rem' }}>📍 {salonAddress}</span>
            </div>
            {/* Tags */}
            {salonTags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {salonTags.map(tag => (
                  <span key={tag} style={{
                    backgroundColor: colors.lightGray,
                    padding: '5px 12px', borderRadius: '20px',
                    fontSize: '0.8rem', fontWeight: '600', color: colors.black
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {salonPrice && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', color: colors.gray, marginBottom: '4px' }}>À partir de</p>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.terracotta, margin: 0 }}>{salonPrice}</p>
            </div>
          )}
        </div>

        {/* --- GALERIE PHOTO --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gridTemplateRows: isMobile ? '280px' : '400px',
          gap: '10px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '40px',
        }}>
          {/* Photo principale */}
          <div style={{ position: 'relative', backgroundColor: '#E8D5CC', overflow: 'hidden' }}>
            {salonImages[0] ? (
              <img
                src={salonImages[0]}
                alt={salonName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '4rem' }}>
                  {category === 'coiffure' ? '💇🏾‍♀️' : category === 'cils' ? '👁️' : category === 'manucure' ? '💅🏾' : '💄'}
                </span>
              </div>
            )}
          </div>

          {/* 2ème et 3ème photos */}
          {!isMobile && (
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px' }}>
              <div style={{ position: 'relative', backgroundColor: '#D4C4BB', overflow: 'hidden' }}>
                {salonImages[1] ? (
                  <img
                    src={salonImages[1]}
                    alt={salonName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>📷</span>
                  </div>
                )}
              </div>
              <div style={{ position: 'relative', backgroundColor: '#C4B4AB', overflow: 'hidden' }}>
                {salonImages[2] ? (
                  <img
                    src={salonImages[2]}
                    alt={salonName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>📷</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- CONTENU PRINCIPAL --- */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1.2fr', gap: '50px' }}>

          {/* GAUCHE */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `2px solid ${colors.border}`, marginBottom: '30px', gap: '30px' }}>
              {['services', 'infos'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '12px 0', fontWeight: '700', fontSize: '1rem',
                    color: activeTab === tab ? colors.terracotta : colors.gray,
                    borderBottom: activeTab === tab ? `3px solid ${colors.terracotta}` : '3px solid transparent',
                    marginBottom: '-2px', transition: 'all 0.2s',
                  }}
                >
                  {tab === 'services' ? 'Services & Tarifs' : 'Informations'}
                </button>
              ))}
            </div>

            {/* TAB SERVICES */}
            {activeTab === 'services' && (
              <div>
                <p style={{ color: colors.gray, marginBottom: '20px', fontSize: '0.95rem' }}>
                  {services.length} prestations disponibles — Acompte de 30% à la réservation
                </p>
                {services.map(service => (
                  <div key={service.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '18px 0', borderBottom: `1px solid ${colors.border}`,
                  }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '1rem', margin: '0 0 4px' }}>{service.name}</p>
                      <p style={{ color: colors.gray, fontSize: '0.88rem', margin: 0 }}>⏱ {service.duration}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{service.price}€</span>
                      <button
                        onClick={handleBookingClick}
                        style={{
                          border: `1.5px solid ${colors.terracotta}`,
                          padding: '8px 16px', borderRadius: '8px',
                          backgroundColor: 'transparent', cursor: 'pointer',
                          fontWeight: '700', color: colors.terracotta,
                          fontSize: '0.85rem', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.target.style.backgroundColor = colors.terracotta; e.target.style.color = colors.white; }}
                        onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.terracotta; }}
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB INFOS */}
            {activeTab === 'infos' && (
              <div>
                <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '12px', color: colors.black }}>📍 Adresse</h4>
                  <p style={{ color: colors.gray, margin: 0 }}>{salonAddress || 'Non renseignée'}</p>
                </div>
                <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '12px', color: colors.black }}>🕐 Horaires d'ouverture</h4>
                  {[
                    { day: 'Lundi - Vendredi', hours: '9h00 - 19h00' },
                    { day: 'Samedi', hours: '9h00 - 18h00' },
                    { day: 'Dimanche', hours: 'Fermé' },
                  ].map(h => (
                    <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: colors.gray, fontSize: '0.9rem' }}>{h.day}</span>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: h.hours === 'Fermé' ? '#E53E3E' : colors.black }}>{h.hours}</span>
                    </div>
                  ))}
                </div>
                <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '24px' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '12px', color: colors.black }}>✅ Ce salon propose</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Réservation en ligne', 'Paiement sécurisé', 'Acompte requis', ...salonTags].map(item => (
                      <span key={item} style={{
                        backgroundColor: colors.white, border: `1px solid ${colors.border}`,
                        padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DROITE : WIDGET RÉSERVATION */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'sticky', top: '120px',
              border: `1px solid ${colors.border}`,
              borderRadius: '24px', padding: '28px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', color: colors.black }}>
                Réserver chez
              </h3>
              <p style={{ fontWeight: '700', color: colors.terracotta, marginBottom: '4px', fontSize: '1rem' }}>
                {salonName}
              </p>
              <p style={{ color: colors.gray, fontSize: '0.85rem', marginBottom: '20px' }}>
                📍 {salonAddress}
              </p>

              {/* Rating */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: colors.porcelain, borderRadius: '12px',
                padding: '12px 16px', marginBottom: '20px',
              }}>
                <span style={{ fontSize: '1.3rem', fontWeight: '800', color: colors.terracotta }}>★ {salonRating}</span>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: '700', color: colors.black, margin: 0 }}>Excellente note</p>
                  <p style={{ fontSize: '0.75rem', color: colors.gray, margin: 0 }}>Vérifiée par NappyBooking</p>
                </div>
              </div>

              {/* Prix */}
              {salonPrice && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '20px', padding: '0 4px',
                }}>
                  <span style={{ color: colors.gray, fontSize: '0.9rem' }}>Prestations dès</span>
                  <span style={{ fontWeight: '800', fontSize: '1.3rem', color: colors.black }}>{salonPrice}</span>
                </div>
              )}

              {/* Bouton principal */}
              <button
                onClick={handleBookingClick}
                style={{
                  width: '100%', backgroundColor: colors.terracotta, color: colors.white,
                  border: 'none', padding: '16px', borderRadius: '12px',
                  fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                  marginBottom: '12px', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.target.style.opacity = '0.9'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                Prendre RDV
              </button>

              <p style={{ textAlign: 'center', color: colors.gray, fontSize: '0.8rem', lineHeight: '1.5' }}>
                🔒 Paiement sécurisé · Acompte 30% à la réservation
              </p>

              {/* Infos supplémentaires */}
              <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: '20px', paddingTop: '20px' }}>
                {[
                  { icon: '📅', text: 'Réservation disponible 24h/24' },
                  { icon: '💳', text: 'Paiement sécurisé via PayPal' },
                  { icon: '❌', text: 'Annulation possible avant 24h' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span>{item.icon}</span>
                    <span style={{ fontSize: '0.85rem', color: colors.gray }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilSalon;

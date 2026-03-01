import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MesRdv = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const userName = localStorage.getItem('userName') || 'Client';

  const colors = {
    terracotta: '#B37256',
    black: '#1A1A1A',
    white: '#FFFFFF',
    porcelain: '#FAF9F6',
    gray: '#717171',
    border: '#E5E5E5',
    success: '#2D5A27',
    successBg: '#E9F5E8',
    warning: '#C5A059',
    warningBg: '#FFF8E6',
    danger: '#D93025',
    dangerBg: '#FFF0F0',
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Chargement des RDV depuis l'API ---
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/bookings/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Erreur API');

        const data = await response.json();
        setBookings(data);
      } catch {
        // Fallback : localStorage si l'API ne répond pas encore
        const saved = localStorage.getItem('userAppointments');
        setBookings(saved ? JSON.parse(saved) : MOCK_BOOKINGS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // --- Données fictives pour tester sans backend ---
  const MOCK_BOOKINGS = [
    {
      _id: 'b1',
      service: 'Box Braids',
      salonName: 'MistralCare',
      salonAddress: '15 rue Gauthey, 75017 Paris',
      employeeName: 'Aminata D.',
      date: '2026-03-15',
      time: '10:00',
      price: 120,
      depositAmount: 36,
      status: 'confirmed',
      category: 'coiffure',
      bookingReference: 'NB-A1B2C3D4',
    },
    {
      _id: 'b2',
      service: 'Volume Russe',
      salonName: "L'Atelier du Regard",
      salonAddress: '40 rue du Bac, 75007 Paris',
      employeeName: 'Fatoumata K.',
      date: '2026-03-22',
      time: '14:30',
      price: 80,
      depositAmount: 24,
      status: 'pending',
      category: 'cils',
      bookingReference: 'NB-E5F6G7H8',
    },
    {
      _id: 'b3',
      service: 'French Manucure',
      salonName: 'Nail Gallery Paris',
      salonAddress: '22 rue de Rivoli, 75001 Paris',
      employeeName: 'Marlène B.',
      date: '2026-02-10',
      time: '11:00',
      price: 45,
      depositAmount: 14,
      status: 'completed',
      category: 'manucure',
      bookingReference: 'NB-I9J0K1L2',
    },
    {
      _id: 'b4',
      service: 'Maquillage Soirée',
      salonName: 'Studio Glam Paris',
      salonAddress: '15 Avenue Montaigne, 75008 Paris',
      employeeName: 'Aminata D.',
      date: '2026-01-28',
      time: '16:00',
      price: 75,
      depositAmount: 23,
      status: 'cancelled',
      category: 'maquillage',
      bookingReference: 'NB-M3N4O5P6',
    },
  ];

  // --- Séparer RDV à venir / passés ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    return bookingDate >= today && b.status !== 'cancelled';
  });

  const pastBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    return bookingDate < today || b.status === 'cancelled' || b.status === 'completed';
  });

  // --- Annulation ---
  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setCancellingId(selectedBooking._id);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking._id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur API');

      // Mise à jour locale
      setBookings(prev =>
        prev.map(b => b._id === selectedBooking._id ? { ...b, status: 'cancelled' } : b)
      );
    } catch {
      // Fallback localStorage
      setBookings(prev =>
        prev.map(b => b._id === selectedBooking._id ? { ...b, status: 'cancelled' } : b)
      );
    } finally {
      setCancellingId(null);
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  // --- Helpers ---
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const categoryColor = {
    coiffure: '#B37256',
    cils: '#C5A059',
    manucure: '#A0522D',
    maquillage: '#CD853F',
  };
  const categoryInitial = {
    coiffure: 'CO',
    cils: 'CI',
    manucure: 'MA',
    maquillage: 'MQ',
  };

  const statusConfig = {
    confirmed: { label: 'Confirmé', bg: colors.successBg, color: colors.success },
    pending:   { label: 'En attente', bg: colors.warningBg, color: colors.warning },
    completed: { label: 'Terminé', bg: '#F0F0F0', color: colors.gray },
    cancelled: { label: 'Annulé', bg: colors.dangerBg, color: colors.danger },
  };

  // --- CARTE RDV ---
  const BookingCard = ({ booking, showCancel = false }) => {
    const status = statusConfig[booking.status] || statusConfig.confirmed;

    return (
      <div style={{
        backgroundColor: colors.white,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        opacity: booking.status === 'cancelled' ? 0.7 : 1,
      }}>
        {/* En-tête carte */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              backgroundColor: categoryColor[booking.category] || colors.terracotta,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              color: colors.white,
              fontWeight: '800',
              fontSize: '0.75rem',
              letterSpacing: '0.5px',
            }}>
              {categoryInitial[booking.category] || 'NB'}
            </div>
            <div>
              <p style={{ fontWeight: '800', fontSize: '1rem', margin: '0 0 3px', color: colors.black }}>
                {booking.service}
              </p>
              <p style={{ fontSize: '0.85rem', color: colors.gray, margin: 0 }}>
                {booking.salonName}
              </p>
            </div>
          </div>
          <span style={{
            fontSize: '0.75rem', fontWeight: '800',
            padding: '5px 12px', borderRadius: '20px',
            backgroundColor: status.bg, color: status.color,
            flexShrink: 0,
          }}>
            {status.label.toUpperCase()}
          </span>
        </div>

        {/* Détails */}
        <div style={{
          backgroundColor: colors.porcelain, borderRadius: '10px',
          padding: '12px 14px', marginBottom: '14px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '8px',
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>Date & Heure</p>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.black, margin: 0 }}>
              {formatDate(booking.date)} à {booking.time}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>Employée</p>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.black, margin: 0 }}>
              {booking.employeeName || booking.expert}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>Adresse</p>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.black, margin: 0 }}>
              {booking.salonAddress}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>Référence</p>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.terracotta, margin: 0 }}>
              {booking.bookingReference || booking._id}
            </p>
          </div>
        </div>

        {/* Prix + Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: colors.gray }}>Total : </span>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: colors.black }}>{booking.price}€</span>
            <span style={{ fontSize: '0.8rem', color: colors.terracotta, marginLeft: '8px', fontWeight: '600' }}>
              (Acompte payé : {booking.depositAmount}€)
            </span>
          </div>

          {showCancel && booking.status !== 'cancelled' && (
            <button
              onClick={() => handleCancelClick(booking)}
              disabled={cancellingId === booking._id}
              style={{
                background: 'none', border: 'none',
                color: colors.danger, fontWeight: '700',
                cursor: 'pointer', fontSize: '0.85rem',
                textDecoration: 'underline', padding: 0,
              }}
            >
              {cancellingId === booking._id ? 'Annulation...' : 'Annuler'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // --- ÉTAT VIDE ---
  const EmptyState = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      
      <p style={{ color: colors.gray, fontSize: '1rem', marginBottom: '20px' }}>{message}</p>
      <button
        onClick={() => navigate('/coiffeuses')}
        style={{
          backgroundColor: colors.terracotta, color: colors.white,
          border: 'none', padding: '14px 28px', borderRadius: '12px',
          fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem',
        }}
      >
        Réserver une prestation
      </button>
    </div>
  );

  // ============================================================
  //  RENDU
  // ============================================================
  return (
    <div style={{ backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <div style={{ padding: '120px 20px 60px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: '800', color: colors.black, margin: 0 }}>
                Mes Rendez-vous
              </h1>
              <p style={{ color: colors.gray, marginTop: '6px' }}>
                Bonjour {userName} — retrouvez tous vos RDV ici
              </p>
            </div>
            <Link
              to="/dashboard-client"
              style={{
                color: colors.terracotta, fontWeight: '700',
                textDecoration: 'none', fontSize: '0.9rem',
              }}
            >
              ← Mon espace
            </Link>
          </div>

          {/* TABS */}
          <div style={{
            display: 'flex', gap: '0',
            borderBottom: `2px solid ${colors.border}`,
            marginBottom: '30px', marginTop: '30px',
          }}>
            {[
              { key: 'upcoming', label: `À venir (${upcomingBookings.length})` },
              { key: 'past',     label: `Historique (${pastBookings.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '12px 24px', fontWeight: '700', fontSize: '0.95rem',
                  color: activeTab === tab.key ? colors.terracotta : colors.gray,
                  borderBottom: activeTab === tab.key ? `3px solid ${colors.terracotta}` : '3px solid transparent',
                  marginBottom: '-2px', transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENU */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: colors.gray }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.terracotta} strokeWidth="2"
                style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <p>Chargement de vos rendez-vous...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : activeTab === 'upcoming' ? (
            upcomingBookings.length > 0 ? (
              <>
                {/* Bannière info annulation */}
                <div style={{
                  backgroundColor: '#FFF8E6', border: '1px solid #F0D580',
                  borderRadius: '12px', padding: '14px 18px',
                  marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  
                  <p style={{ fontSize: '0.85rem', color: '#7A5800', margin: 0, fontWeight: '600' }}>
                    En cas d'annulation, l'acompte versé ne sera pas remboursé conformément à nos CGV.
                  </p>
                </div>
                {upcomingBookings.map(b => <BookingCard key={b._id} booking={b} showCancel={true} />)}
              </>
            ) : (
              <EmptyState message="Vous n'avez aucun rendez-vous à venir." />
            )
          ) : (
            pastBookings.length > 0 ? (
              pastBookings.map(b => <BookingCard key={b._id} booking={b} showCancel={false} />)
            ) : (
              <EmptyState message="Vous n'avez pas encore d'historique de rendez-vous." />
            )
          )}

          {/* BOUTON RÉSERVER */}
          {!isLoading && (
            <button
              onClick={() => navigate('/coiffeuses')}
              style={{
                width: '100%', backgroundColor: colors.terracotta, color: colors.white,
                border: 'none', padding: '16px', borderRadius: '14px',
                fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                marginTop: '20px',
              }}
            >
              + Réserver une nouvelle prestation
            </button>
          )}
        </div>
      </div>

      {/* ============ MODAL CONFIRMATION ANNULATION ============ */}
      {showCancelModal && selectedBooking && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            backgroundColor: colors.white, borderRadius: '20px',
            padding: '32px', maxWidth: '440px', width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: colors.black, marginBottom: '8px' }}>
                Annuler ce rendez-vous ?
              </h3>
              <p style={{ color: colors.gray, fontSize: '0.9rem', lineHeight: '1.5' }}>
                Vous êtes sur le point d'annuler votre RDV pour
                <strong> {selectedBooking.service}</strong> chez <strong>{selectedBooking.salonName}</strong>.
              </p>
            </div>

            {/* Avertissement acompte */}
            <div style={{
              backgroundColor: colors.dangerBg, border: `1px solid #FFB3B3`,
              borderRadius: '12px', padding: '14px 16px', marginBottom: '24px',
            }}>
              <p style={{ color: colors.danger, fontSize: '0.88rem', fontWeight: '700', margin: '0 0 4px' }}>
                Acompte non remboursable
              </p>
              <p style={{ color: colors.danger, fontSize: '0.85rem', margin: 0, opacity: 0.8 }}>
                L'acompte de <strong>{selectedBooking.depositAmount}€</strong> versé lors de votre réservation ne sera pas remboursé.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setShowCancelModal(false); setSelectedBooking(null); }}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px',
                  border: `2px solid ${colors.border}`, backgroundColor: 'transparent',
                  fontWeight: '700', cursor: 'pointer', color: colors.black,
                }}
              >
                Garder mon RDV
              </button>
              <button
                onClick={handleConfirmCancel}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px',
                  border: 'none', backgroundColor: colors.danger,
                  color: colors.white, fontWeight: '700', cursor: 'pointer',
                }}
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{
        backgroundColor: colors.black, color: colors.white,
        padding: isMobile ? '60px 20px 30px' : '80px 60px 40px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
          gap: '40px',
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: colors.terracotta }}>NappyBooking</h2>
            <p style={{ opacity: 0.7, lineHeight: '1.6', fontSize: '0.95rem' }}>
              La première plateforme dédiée à la beauté afro en France.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', opacity: 0.8, fontSize: '0.9rem' }}>
              {[['Coiffure', '/coiffeuses'], ['Manucure', '/manucure'], ['Maquillage', '/maquillage'], ['Cils & Sourcils', '/cils']].map(([label, path]) => (
                <li key={path}><Link to={path} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Business</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', opacity: 0.8, fontSize: '0.9rem' }}>
              {[['Devenir Partenaire', '/devenir-partenaire'], ['Espace Pro', '/connexion-pro'], ["Centre d'aide", '/aide']].map(([label, path]) => (
                <li key={path}><Link to={path} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Suivez-nous</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: colors.white, opacity: 0.8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" style={{ color: colors.white, opacity: 0.8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px', margin: '60px auto 0',
          paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center', fontSize: '0.85rem', opacity: 0.5,
        }}>
          © 2026 NappyBooking. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default MesRdv;

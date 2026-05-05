import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

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

const categoryEmoji = {
  coiffure: '💇🏾‍♀️',
  cils: '👁️',
  manucure: '💅🏾',
  maquillage: '💄',
};

const Stars = ({ note }) => {
  const full = Math.floor(note);
  const half = note - full >= 0.5;
  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < full ? '#B37256' : i === full && half ? '#B37256' : '#DDD', fontSize: '0.95rem' }}>
          {i < full ? '★' : i === full && half ? '½' : '☆'}
        </span>
      ))}
    </span>
  );
};

const ProfilSalon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('services');

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [salonRes, servicesRes, avisRes] = await Promise.all([
          api.get(`/prestataires/${id}`),
          api.get(`/services?salonId=${id}`),
          api.get(`/avis?salonId=${id}`),
        ]);
        setSalon(salonRes.data);
        setServices(servicesRes.data);
        setAvis(avisRes.data);
      } catch {
        setError('Impossible de charger ce salon.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleReserver = (serviceId = null) => {
    const auth = localStorage.getItem('isAuthenticated');
    const dest = serviceId
      ? `/booking/${id}?serviceId=${serviceId}`
      : `/booking/${id}`;
    if (auth === 'true') {
      navigate(dest);
    } else {
      localStorage.setItem('redirectAfterLogin', dest);
      navigate('/login');
    }
  };

  const colors = {
    terracotta: '#B37256',
    black: '#1A1A1A',
    gray: '#717171',
    lightGray: '#F5F5F5',
    porcelain: '#FAF9F6',
    white: '#FFFFFF',
    border: '#E5E5E5',
  };

  // ---- ÉTATS DE CHARGEMENT ----
  if (loading) {
    return (
      <div style={{ paddingTop: '140px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '40px', height: '40px', margin: '0 auto 16px',
          border: '3px solid #F0E8E3', borderTop: `3px solid ${colors.terracotta}`,
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: colors.gray }}>Chargement du salon…</p>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div style={{ paddingTop: '140px', textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</p>
        <p style={{ color: colors.gray, fontSize: '1.1rem' }}>{error || 'Salon introuvable.'}</p>
        <button
          onClick={() => navigate(-1)}
          style={{ marginTop: '20px', padding: '12px 24px', borderRadius: '10px', border: 'none', backgroundColor: colors.terracotta, color: '#fff', fontWeight: '700', cursor: 'pointer' }}
        >
          Retour
        </button>
      </div>
    );
  }

  const mainCategorie = salon.categories?.[0] || 'coiffure';
  const prixMin = services.length > 0 ? Math.min(...services.map(s => s.prix)) : salon.tarif_moyen;

  return (
    <div style={{ paddingTop: '100px', backgroundColor: colors.white, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>

        {/* BREADCRUMB */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: colors.gray, textDecoration: 'none' }}>Accueil</Link>
          <span style={{ color: colors.gray }}>›</span>
          <Link to={categoryRoutes[mainCategorie]} style={{ color: colors.gray, textDecoration: 'none' }}>
            {categoryLabels[mainCategorie]}
          </Link>
          <span style={{ color: colors.gray }}>›</span>
          <span style={{ color: colors.black, fontWeight: '600' }}>{salon.nom_salon}</span>
        </div>

        {/* EN-TÊTE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', fontWeight: '800', margin: 0 }}>
                {salon.nom_salon}
              </h1>
              {salon.categories?.map(cat => (
                <span key={cat} style={{
                  backgroundColor: '#FDF5F1', color: colors.terracotta,
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.78rem', fontWeight: '700',
                  border: `1px solid ${colors.terracotta}30`,
                }}>
                  {categoryLabels[cat] || cat}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stars note={salon.note || 0} />
                <span style={{ fontWeight: '700', color: colors.black, fontSize: '0.95rem' }}>
                  {salon.note > 0 ? salon.note.toFixed(1) : '—'}
                </span>
                <span style={{ color: colors.gray, fontSize: '0.88rem' }}>
                  ({salon.nb_avis || 0} avis)
                </span>
              </div>
              <span style={{ color: colors.border }}>•</span>
              <span style={{ color: colors.gray, fontSize: '0.92rem' }}>📍 {salon.adresse}</span>
            </div>

            {salon.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {salon.tags.map(tag => (
                  <span key={tag} style={{
                    backgroundColor: colors.lightGray,
                    padding: '5px 12px', borderRadius: '20px',
                    fontSize: '0.8rem', fontWeight: '600', color: colors.black,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {prixMin > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.82rem', color: colors.gray, marginBottom: '2px' }}>À partir de</p>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.terracotta, margin: 0 }}>{prixMin}€</p>
            </div>
          )}
        </div>

        {/* GALERIE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : salon.photos?.length > 1 ? '2fr 1fr' : '1fr',
          gridTemplateRows: isMobile ? '260px' : '380px',
          gap: '10px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '40px',
          backgroundColor: '#E8D5CC',
        }}>
          <div style={{ overflow: 'hidden', backgroundColor: '#E8D5CC' }}>
            {salon.photos?.[0] ? (
              <img src={salon.photos[0]} alt={salon.nom_salon}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '5rem' }}>{categoryEmoji[mainCategorie]}</span>
              </div>
            )}
          </div>

          {!isMobile && salon.photos?.length > 1 && (
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ overflow: 'hidden', backgroundColor: i === 1 ? '#D4C4BB' : '#C4B4AB' }}>
                  {salon.photos[i] ? (
                    <img src={salon.photos[i]} alt={salon.nom_salon}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '2rem', opacity: 0.4 }}>📷</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTENU PRINCIPAL */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1.2fr', gap: '50px' }}>

          {/* GAUCHE */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `2px solid ${colors.border}`, marginBottom: '30px', gap: '30px' }}>
              {[
                { key: 'services', label: 'Services & Tarifs' },
                { key: 'avis', label: `Avis (${avis.length})` },
                { key: 'infos', label: 'Informations' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '12px 0', fontWeight: '700', fontSize: '0.95rem',
                  color: activeTab === tab.key ? colors.terracotta : colors.gray,
                  borderBottom: activeTab === tab.key ? `3px solid ${colors.terracotta}` : '3px solid transparent',
                  marginBottom: '-2px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB SERVICES */}
            {activeTab === 'services' && (
              <div>
                {services.length === 0 ? (
                  <p style={{ color: colors.gray, fontStyle: 'italic' }}>
                    Aucun service renseigné pour ce salon.
                  </p>
                ) : (
                  <>
                    <p style={{ color: colors.gray, marginBottom: '20px', fontSize: '0.9rem' }}>
                      {services.length} prestation{services.length > 1 ? 's' : ''} disponible{services.length > 1 ? 's' : ''} — Acompte de {services[0]?.acompte_pct || 30}% à la réservation
                    </p>
                    {services.map(service => (
                      <div key={service._id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '18px 0', borderBottom: `1px solid ${colors.border}`,
                        gap: '12px',
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '700', fontSize: '1rem', margin: '0 0 4px' }}>{service.nom}</p>
                          <p style={{ color: colors.gray, fontSize: '0.85rem', margin: '0 0 2px' }}>⏱ {service.duree} min</p>
                          {service.description && (
                            <p style={{ color: colors.gray, fontSize: '0.82rem', margin: 0, fontStyle: 'italic' }}>{service.description}</p>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: '800', fontSize: '1.1rem', display: 'block' }}>{service.prix}€</span>
                            <span style={{ fontSize: '0.75rem', color: colors.gray }}>
                              acompte {Math.round(service.prix * (service.acompte_pct / 100))}€
                            </span>
                          </div>
                          <button
                            onClick={() => handleReserver(service._id)}
                            style={{
                              border: `1.5px solid ${colors.terracotta}`,
                              padding: '8px 16px', borderRadius: '8px',
                              backgroundColor: 'transparent', cursor: 'pointer',
                              fontWeight: '700', color: colors.terracotta,
                              fontSize: '0.85rem', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.terracotta; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.terracotta; }}
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* TAB AVIS */}
            {activeTab === 'avis' && (
              <div>
                {avis.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: colors.gray }}>
                    <p style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</p>
                    <p>Aucun avis pour ce salon pour l'instant.</p>
                    <p style={{ fontSize: '0.85rem' }}>Soyez la première à laisser un avis après votre prestation !</p>
                  </div>
                ) : (
                  <>
                    {/* Résumé note */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '20px',
                      backgroundColor: colors.porcelain, borderRadius: '16px',
                      padding: '20px 24px', marginBottom: '28px',
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '3rem', fontWeight: '800', color: colors.terracotta, margin: 0, lineHeight: 1 }}>
                          {salon.note?.toFixed(1) || '—'}
                        </p>
                        <Stars note={salon.note || 0} />
                        <p style={{ fontSize: '0.8rem', color: colors.gray, margin: '4px 0 0' }}>{salon.nb_avis} avis</p>
                      </div>
                    </div>

                    {avis.map(a => (
                      <div key={a._id} style={{
                        borderBottom: `1px solid ${colors.border}`,
                        padding: '20px 0',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <p style={{ fontWeight: '700', margin: '0 0 4px', fontSize: '0.95rem' }}>
                              {a.client?.prenom_client} {a.client?.nom_client}
                            </p>
                            <Stars note={a.note} />
                          </div>
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            {new Date(a.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        {a.commentaire && (
                          <p style={{ color: colors.gray, fontSize: '0.9rem', margin: '8px 0 0', lineHeight: '1.6' }}>
                            {a.commentaire}
                          </p>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* TAB INFOS */}
            {activeTab === 'infos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '22px' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '10px', color: colors.black, margin: '0 0 12px' }}>📍 Adresse</h4>
                  <p style={{ color: colors.gray, margin: 0 }}>{salon.adresse}</p>
                </div>

                {salon.telephone && (
                  <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '22px' }}>
                    <h4 style={{ fontWeight: '700', margin: '0 0 12px', color: colors.black }}>📞 Téléphone</h4>
                    <a href={`tel:${salon.telephone}`} style={{ color: colors.terracotta, fontWeight: '600', textDecoration: 'none' }}>
                      {salon.telephone}
                    </a>
                  </div>
                )}

                {salon.description && (
                  <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '22px' }}>
                    <h4 style={{ fontWeight: '700', margin: '0 0 12px', color: colors.black }}>À propos</h4>
                    <p style={{ color: colors.gray, margin: 0, lineHeight: '1.7' }}>{salon.description}</p>
                  </div>
                )}

                {salon.tags?.length > 0 && (
                  <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '22px' }}>
                    <h4 style={{ fontWeight: '700', margin: '0 0 12px', color: colors.black }}>Spécialités</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {salon.tags.map(tag => (
                        <span key={tag} style={{
                          backgroundColor: colors.white, border: `1px solid ${colors.border}`,
                          padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DROITE : WIDGET RÉSERVATION */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: isMobile ? 'static' : 'sticky',
              top: '120px',
              border: `1px solid ${colors.border}`,
              borderRadius: '24px', padding: '28px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px', color: colors.black }}>
                Réserver chez
              </h3>
              <p style={{ fontWeight: '700', color: colors.terracotta, margin: '0 0 4px', fontSize: '1rem' }}>
                {salon.nom_salon}
              </p>
              <p style={{ color: colors.gray, fontSize: '0.83rem', margin: '0 0 20px' }}>
                📍 {salon.adresse}
              </p>

              {/* Note */}
              {salon.note > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: colors.porcelain, borderRadius: '12px',
                  padding: '12px 16px', marginBottom: '20px',
                }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.terracotta }}>
                    ★ {salon.note.toFixed(1)}
                  </span>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', color: colors.black, margin: 0 }}>
                      {salon.note >= 4.8 ? 'Excellente note' : salon.note >= 4 ? 'Très bonne note' : 'Bonne note'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: colors.gray, margin: 0 }}>
                      {salon.nb_avis} avis vérifiés
                    </p>
                  </div>
                </div>
              )}

              {/* Prix */}
              {prixMin > 0 && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '20px', padding: '0 4px',
                }}>
                  <span style={{ color: colors.gray, fontSize: '0.88rem' }}>Prestations dès</span>
                  <span style={{ fontWeight: '800', fontSize: '1.3rem', color: colors.black }}>{prixMin}€</span>
                </div>
              )}

              <button
                onClick={() => handleReserver()}
                style={{
                  width: '100%', backgroundColor: colors.terracotta, color: '#fff',
                  border: 'none', padding: '16px', borderRadius: '12px',
                  fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                  marginBottom: '12px', transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Prendre RDV
              </button>

              <p style={{ textAlign: 'center', color: colors.gray, fontSize: '0.78rem', lineHeight: '1.5', margin: '0 0 20px' }}>
                Paiement sécurisé · Acompte 30% à la réservation
              </p>

              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: '📅', text: 'Réservation disponible 24h/24' },
                  { icon: '💳', text: 'Paiement sécurisé via PayPal' },
                  { icon: '❌', text: 'Annulation possible avant 24h' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{item.icon}</span>
                    <span style={{ fontSize: '0.83rem', color: colors.gray }}>{item.text}</span>
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

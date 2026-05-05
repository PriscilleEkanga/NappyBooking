import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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

const statutBadge = {
  'en attente': { label: 'En attente', bg: colors.warningBg, color: colors.warning },
  'confirmé':   { label: 'Confirmé',   bg: colors.successBg, color: colors.success },
  'terminé':    { label: 'Terminé',    bg: '#F0F0F0',        color: colors.gray },
  'annulé':     { label: 'Annulé',     bg: colors.dangerBg,  color: colors.danger },
};

const roleBadge = {
  client:      { label: 'Client',      bg: '#EEF2FF', color: '#3730A3' },
  prestataire: { label: 'Prestataire', bg: '#FFF7ED', color: '#C2410C' },
  admin:       { label: 'Admin',       bg: colors.dangerBg, color: colors.danger },
};

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chargement stats au montage
  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  // Chargement users/bookings selon l'onglet
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      setLoadingUsers(true);
      api.get('/admin/users')
        .then(({ data }) => setUsers(data))
        .catch(() => {})
        .finally(() => setLoadingUsers(false));
    }
    if (activeTab === 'bookings' && bookings.length === 0) {
      setLoadingBookings(true);
      api.get('/admin/bookings')
        .then(({ data }) => setBookings(data))
        .catch(() => {})
        .finally(() => setLoadingBookings(false));
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteUser = async (id, nom) => {
    if (!window.confirm(`Supprimer l'utilisateur ${nom} ? Cette action est irréversible.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  // ---- Stat card ----
  const StatCard = ({ label, value, sub, accent }) => (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      borderLeft: `4px solid ${accent || colors.terracotta}`,
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: '700', color: colors.gray, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: '800', color: colors.black, margin: '0 0 4px' }}>{value ?? '—'}</p>
      {sub && <p style={{ fontSize: '0.8rem', color: colors.gray, margin: 0 }}>{sub}</p>}
    </div>
  );

  const tabs = [
    { key: 'stats',    label: 'Vue d\'ensemble' },
    { key: 'users',    label: `Utilisateurs${users.length > 0 ? ` (${users.length})` : ''}` },
    { key: 'bookings', label: `Réservations${bookings.length > 0 ? ` (${bookings.length})` : ''}` },
  ];

  return (
    <div style={{ backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <div style={{ padding: '100px 20px 60px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: '700', color: colors.terracotta, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Administration
            </p>
            <h1 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: '800', color: colors.black, margin: 0 }}>
              Dashboard Admin
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: '10px 20px', borderRadius: '8px', border: `1px solid ${colors.border}`, cursor: 'pointer', fontWeight: '600', backgroundColor: colors.white, fontSize: '0.85rem' }}
          >
            Déconnexion
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${colors.border}`, marginBottom: '32px' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 24px', fontWeight: '700', fontSize: '0.9rem',
                color: activeTab === tab.key ? colors.terracotta : colors.gray,
                borderBottom: activeTab === tab.key ? `3px solid ${colors.terracotta}` : '3px solid transparent',
                marginBottom: '-2px', transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== STATS ==================== */}
        {activeTab === 'stats' && (
          <>
            {loadingStats ? (
              <p style={{ color: colors.gray, textAlign: 'center', padding: '60px 0' }}>Chargement...</p>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <StatCard label="Utilisateurs" value={stats?.totalUsers} accent="#3730A3" />
                  <StatCard label="Réservations" value={stats?.totalBookings} accent={colors.terracotta} />
                  <StatCard label="Prestataires" value={stats?.totalPrestataires} accent={colors.warning} />
                  <StatCard label="Acomptes perçus" value={`${stats?.totalRevenue?.toFixed(0)}€`} accent={colors.success} sub="réservations confirmées + terminées" />
                </div>

                {/* Répartition bookings par statut */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                  <div style={{ backgroundColor: colors.white, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 20px', color: colors.black }}>Réservations par statut</h3>
                    {stats?.bookingsByStatut?.length > 0 ? stats.bookingsByStatut.map(s => {
                      const badge = statutBadge[s._id] || { label: s._id, bg: '#F0F0F0', color: colors.gray };
                      return (
                        <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', backgroundColor: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: colors.black }}>{s.count}</span>
                        </div>
                      );
                    }) : <p style={{ color: colors.gray, fontSize: '0.9rem' }}>Aucune réservation</p>}
                  </div>

                  <div style={{ backgroundColor: colors.white, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 20px', color: colors.black }}>Utilisateurs par rôle</h3>
                    {stats?.usersByRole?.map(r => {
                      const badge = roleBadge[r._id] || { label: r._id, bg: '#F0F0F0', color: colors.gray };
                      return (
                        <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', backgroundColor: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: colors.black }}>{r.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ==================== USERS ==================== */}
        {activeTab === 'users' && (
          <>
            {loadingUsers ? (
              <p style={{ color: colors.gray, textAlign: 'center', padding: '60px 0' }}>Chargement...</p>
            ) : (
              <div style={{ backgroundColor: colors.white, borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.porcelain }}>
                      {['Nom', 'Email', 'Rôle', 'Inscrit le', 'Action'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: colors.gray, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const badge = roleBadge[u.role] || roleBadge.client;
                      return (
                        <tr key={u._id} style={{ borderTop: `1px solid ${colors.border}` }}>
                          <td style={{ padding: '14px 16px', fontWeight: '600', color: colors.black }}>
                            {u.prenom_client} {u.nom_client}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.88rem', color: colors.gray }}>{u.email}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', backgroundColor: badge.bg, color: badge.color }}>
                              {badge.label}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: colors.gray }}>{formatDate(u.createdAt)}</td>
                          <td style={{ padding: '14px 16px' }}>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u._id, `${u.prenom_client} ${u.nom_client}`)}
                                disabled={deletingId === u._id}
                                style={{ background: 'none', border: 'none', color: colors.danger, fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline', padding: 0 }}
                              >
                                {deletingId === u._id ? '...' : 'Supprimer'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '40px', color: colors.gray }}>Aucun utilisateur</p>
                )}
              </div>
            )}
          </>
        )}

        {/* ==================== BOOKINGS ==================== */}
        {activeTab === 'bookings' && (
          <>
            {loadingBookings ? (
              <p style={{ color: colors.gray, textAlign: 'center', padding: '60px 0' }}>Chargement...</p>
            ) : (
              <div style={{ backgroundColor: colors.white, borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.porcelain }}>
                      {['Référence', 'Client', 'Service', 'Date', 'Prix', 'Statut'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: colors.gray, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const badge = statutBadge[b.statut] || statutBadge['en attente'];
                      const client = b.client;
                      const clientName = client?.prenom_client
                        ? `${client.prenom_client} ${client.nom_client}`
                        : b.client_info?.firstName || '—';
                      return (
                        <tr key={b._id} style={{ borderTop: `1px solid ${colors.border}` }}>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: colors.terracotta, fontSize: '0.82rem' }}>{b.bookingReference}</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.88rem', color: colors.black, fontWeight: '600' }}>{clientName}</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.88rem', color: colors.gray }}>{b.service}</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: colors.gray }}>
                            {formatDate(b.date_rendezvous)} {b.heure && `à ${b.heure}`}
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: colors.black }}>{b.prix}€</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', backgroundColor: badge.bg, color: badge.color }}>
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '40px', color: colors.gray }}>Aucune réservation</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const statutMap = { 'en attente': 'pending', 'confirmé': 'confirmed', 'annulé': 'cancelled', 'terminé': 'completed' };
const statutMapReverse = { pending: 'en attente', confirmed: 'confirmé', cancelled: 'annulé', completed: 'terminé' };

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const normalizeBooking = (b) => ({
  ...b,
  date: new Date(b.date_rendezvous).toISOString().split('T')[0],
  time: b.heure,
  status: statutMap[b.statut] || 'pending',
  depositPaid: b.acompte ?? 0,
  price: b.prix ?? 0,
  service: b.service_snapshot?.nom || '—',
  duration: b.service_snapshot?.duree || b.duration || 60,
  client: b.client?.prenom_client
    ? `${b.client.prenom_client} ${b.client.nom_client}`
    : b.client_info?.firstName || '—',
});

const Planning = () => {
  const now = new Date();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [currentMonth, setCurrentMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const salonName = localStorage.getItem('userName') || 'Mon Salon';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api.get('/bookings/pro')
      .then(({ data }) => setAppointments(data.map(normalizeBooking)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  const cardStyle = {
    backgroundColor: colors.white,
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: `1px solid ${colors.border}`,
  };

  const statusConfig = {
    confirmed: { label: 'Confirmé', bg: colors.successBg, color: colors.success },
    pending:   { label: 'En attente', bg: colors.warningBg, color: colors.warning },
    cancelled: { label: 'Annulé', bg: colors.dangerBg, color: colors.danger },
    completed: { label: 'Terminé', bg: '#F0F0F0', color: colors.gray },
  };

  // --- Logique calendrier ---
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Convertir dimanche=0 en lundi=0
    const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
    return { daysInMonth, startOffset };
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getAppointmentsForDate = (dateKey) => {
    return appointments.filter(a => a.date === dateKey && a.status !== 'cancelled');
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  const { daysInMonth, startOffset } = getDaysInMonth(currentMonth);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
  };

  if (loading) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ width: '36px', height: '36px', margin: '0 auto', border: '3px solid #F0E8E3', borderTop: '3px solid #B37256', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Stats du mois
  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  const monthAppointments = appointments.filter(a => a.date.startsWith(monthKey) && a.status !== 'cancelled');
  const monthRevenue = monthAppointments.reduce((sum, a) => sum + (a.depositPaid || 0), 0);
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  // ============================================================
  //  RENDU
  // ============================================================
  return (
    <div style={{ padding: '100px 20px 60px', backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: '800', color: colors.black, margin: 0 }}>
              Planning
            </h1>
            <p style={{ color: colors.gray, marginTop: '6px' }}>
              {salonName} — gérez vos rendez-vous
            </p>
          </div>
          <Link
            to="/dashboard-pro"
            style={{ color: colors.terracotta, fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            Retour au tableau de bord
          </Link>
        </div>

        {/* STATS RAPIDES */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'RDV ce mois', value: monthAppointments.length },
            { label: 'Acomptes reçus', value: `${monthRevenue}€` },
            { label: 'En attente', value: pendingCount },
            { label: 'RDV aujourd\'hui', value: getAppointmentsForDate(new Date().toISOString().split('T')[0]).length },
          ].map((stat, i) => (
            <div key={i} style={{ ...cardStyle, padding: '18px 20px' }}>
              <p style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }}>
                {stat.label}
              </p>
              <p style={{ fontSize: '1.7rem', fontWeight: '800', color: i === 2 && pendingCount > 0 ? colors.warning : colors.black, margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* GRILLE PRINCIPALE */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '24px' }}>

          {/* CALENDRIER */}
          <div style={{ ...cardStyle, padding: '24px' }}>

            {/* Navigation mois */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button
                onClick={prevMonth}
                style={{ background: 'none', border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: '700', color: colors.black }}
              >
                &lsaquo;
              </button>
              <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: colors.black, margin: 0 }}>
                {MOIS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                style={{ background: 'none', border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: '700', color: colors.black }}
              >
                &rsaquo;
              </button>
            </div>

            {/* Jours de la semaine */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {JOURS.map(j => (
                <div key={j} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: colors.gray, padding: '4px 0' }}>
                  {j}
                </div>
              ))}
            </div>

            {/* Grille des jours */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {/* Cases vides avant le 1er */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Jours du mois */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const dayAppointments = getAppointmentsForDate(dateKey);
                const isSelected = dateKey === selectedDate;
                const isToday = dateKey === new Date().toISOString().split('T')[0];
                const hasAppointments = dayAppointments.length > 0;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateKey)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? colors.terracotta : isToday ? '#FDF5F1' : 'transparent',
                      border: isToday && !isSelected ? `2px solid ${colors.terracotta}` : '2px solid transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F5F0EB'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = isToday ? '#FDF5F1' : 'transparent'; }}
                  >
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: isSelected || isToday ? '800' : '500',
                      color: isSelected ? colors.white : colors.black,
                    }}>
                      {day}
                    </span>

                    {/* Point indicateur RDV */}
                    {hasAppointments && (
                      <div style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: isSelected ? colors.white : colors.terracotta,
                        marginTop: '2px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.terracotta }} />
                <span style={{ fontSize: '0.75rem', color: colors.gray }}>RDV programmé</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.terracotta, opacity: 0.3 }} />
                <span style={{ fontSize: '0.75rem', color: colors.gray }}>Aujourd'hui</span>
              </div>
            </div>
          </div>

          {/* LISTE RDV DU JOUR SÉLECTIONNÉ */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <h3 style={{ fontWeight: '800', fontSize: '1rem', color: colors.black, marginBottom: '4px' }}>
              {formatDateLabel(selectedDate)}
            </h3>
            <p style={{ color: colors.gray, fontSize: '0.85rem', marginBottom: '20px' }}>
              {selectedDateAppointments.length === 0
                ? 'Aucun rendez-vous ce jour'
                : `${selectedDateAppointments.length} rendez-vous`}
            </p>

            {selectedDateAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.gray }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.border} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p style={{ fontSize: '0.9rem' }}>Journée libre</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px' }}>
                {selectedDateAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(app => {
                    const status = statusConfig[app.status] || statusConfig.confirmed;
                    return (
                      <div
                        key={app._id}
                        onClick={() => { setSelectedAppointment(app); setShowDetailModal(true); }}
                        style={{
                          border: `1px solid ${colors.border}`,
                          borderRadius: '12px',
                          padding: '14px 16px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          borderLeft: `4px solid ${status.color}`,
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.porcelain}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = colors.white}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontWeight: '800', fontSize: '0.95rem', color: colors.black, margin: '0 0 3px' }}>
                              {app.time} — {app.client}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: colors.gray, margin: '0 0 6px' }}>
                              {app.service} · {formatDuration(app.duration)}
                            </p>
                          </div>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: '800',
                            padding: '3px 10px', borderRadius: '20px',
                            backgroundColor: status.bg, color: status.color,
                            flexShrink: 0,
                          }}>
                            {status.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Acompte reçu : <strong style={{ color: colors.success }}>{app.depositPaid}€</strong>
                          </span>
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Total : <strong>{app.price}€</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* LISTE COMPLÈTE DU MOIS */}
        <div style={{ ...cardStyle, padding: '24px', marginTop: '24px' }}>
          <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: colors.black, marginBottom: '20px' }}>
            Tous les RDV — {MOIS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>

          {monthAppointments.length === 0 ? (
            <p style={{ color: colors.gray, textAlign: 'center', padding: '20px' }}>Aucun rendez-vous ce mois-ci.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                    {['Date', 'Heure', 'Client', 'Prestation', 'Durée', 'Acompte', 'Total', 'Statut'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '700', color: colors.gray, whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthAppointments
                    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                    .map(app => {
                      const status = statusConfig[app.status] || statusConfig.confirmed;
                      return (
                        <tr
                          key={app._id}
                          onClick={() => { setSelectedAppointment(app); setShowDetailModal(true); }}
                          style={{ borderBottom: `1px solid ${colors.border}`, cursor: 'pointer', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.porcelain}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '12px 14px', fontWeight: '600' }}>
                            {new Date(app.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </td>
                          <td style={{ padding: '12px 14px', color: colors.terracotta, fontWeight: '700' }}>{app.time}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '700' }}>{app.client}</td>
                          <td style={{ padding: '12px 14px', color: colors.gray }}>{app.service}</td>
                          <td style={{ padding: '12px 14px', color: colors.gray }}>{formatDuration(app.duration)}</td>
                          <td style={{ padding: '12px 14px', color: colors.success, fontWeight: '700' }}>{app.depositPaid}€</td>
                          <td style={{ padding: '12px 14px', fontWeight: '700' }}>{app.price}€</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              fontSize: '0.75rem', fontWeight: '800',
                              padding: '4px 10px', borderRadius: '20px',
                              backgroundColor: status.bg, color: status.color,
                            }}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODALE DÉTAIL RDV ===== */}
      {showDetailModal && selectedAppointment && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            backgroundColor: colors.white, borderRadius: '20px',
            padding: '32px', maxWidth: '460px', width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '1.2rem', color: colors.black, margin: '0 0 6px' }}>
                  {selectedAppointment.client}
                </h3>
                <p style={{ color: colors.gray, fontSize: '0.9rem', margin: 0 }}>{selectedAppointment.service}</p>
              </div>
              <button
                onClick={() => { setShowDetailModal(false); setSelectedAppointment(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.gray, fontSize: '1.4rem', fontWeight: '700', padding: '0 4px', lineHeight: 1 }}
              >
                x
              </button>
            </div>

            {/* Statut */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontSize: '0.8rem', fontWeight: '800',
                padding: '6px 14px', borderRadius: '20px',
                backgroundColor: (statusConfig[selectedAppointment.status] || statusConfig.confirmed).bg,
                color: (statusConfig[selectedAppointment.status] || statusConfig.confirmed).color,
              }}>
                {(statusConfig[selectedAppointment.status] || statusConfig.confirmed).label.toUpperCase()}
              </span>
            </div>

            {/* Infos */}
            <div style={{ backgroundColor: colors.porcelain, borderRadius: '14px', padding: '18px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Date', value: formatDateLabel(selectedAppointment.date) },
                { label: 'Heure', value: selectedAppointment.time },
                { label: 'Durée', value: formatDuration(selectedAppointment.duration) },
                { label: 'Acompte reçu', value: `${selectedAppointment.depositPaid}€` },
                { label: 'Reste à encaisser', value: `${selectedAppointment.price - selectedAppointment.depositPaid}€` },
                { label: 'Total prestation', value: `${selectedAppointment.price}€` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: colors.gray, fontWeight: '600' }}>{label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {selectedAppointment.status === 'pending' && (
                <button disabled={actionLoading}
                  onClick={async () => {
                    setActionLoading(true);
                    try {
                      await api.put(`/bookings/${selectedAppointment._id}/confirm`);
                      setAppointments(prev => prev.map(a => a._id === selectedAppointment._id ? { ...a, status: 'confirmed' } : a));
                      setShowDetailModal(false);
                    } finally { setActionLoading(false); }
                  }}
                  style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', backgroundColor: colors.success, color: colors.white, fontWeight: '700', cursor: 'pointer', minWidth: '100px' }}
                >
                  Confirmer
                </button>
              )}
              {selectedAppointment.status === 'confirmed' && (
                <button disabled={actionLoading}
                  onClick={async () => {
                    setActionLoading(true);
                    try {
                      await api.put(`/bookings/${selectedAppointment._id}/terminer`);
                      setAppointments(prev => prev.map(a => a._id === selectedAppointment._id ? { ...a, status: 'completed' } : a));
                      setShowDetailModal(false);
                    } finally { setActionLoading(false); }
                  }}
                  style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', backgroundColor: '#555', color: colors.white, fontWeight: '700', cursor: 'pointer', minWidth: '100px' }}
                >
                  Terminer
                </button>
              )}
              {['pending', 'confirmed'].includes(selectedAppointment.status) && (
                <button disabled={actionLoading}
                  onClick={async () => {
                    if (!confirm('Annuler ce rendez-vous ?')) return;
                    setActionLoading(true);
                    try {
                      await api.put(`/bookings/${selectedAppointment._id}/cancel`);
                      setAppointments(prev => prev.map(a => a._id === selectedAppointment._id ? { ...a, status: 'cancelled' } : a));
                      setShowDetailModal(false);
                    } finally { setActionLoading(false); }
                  }}
                  style={{ flex: 1, padding: '13px', borderRadius: '10px', border: `1.5px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.danger, fontWeight: '700', cursor: 'pointer', minWidth: '100px' }}
                >
                  Annuler
                </button>
              )}
              <button
                onClick={() => { setShowDetailModal(false); setSelectedAppointment(null); }}
                style={{ flex: 1, padding: '13px', borderRadius: '10px', border: `1.5px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.black, fontWeight: '700', cursor: 'pointer', minWidth: '100px' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;

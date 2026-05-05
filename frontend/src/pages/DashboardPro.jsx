import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const colors = {
  terracotta: '#B37256', black: '#1A1A1A', white: '#FFFFFF',
  porcelain: '#FAF9F6', gray: '#717171', border: '#E5E5E5',
  lightGray: '#F5F5F5',
};

const card = {
  backgroundColor: colors.white, padding: '24px',
  borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
};

const statutColor = { 'en attente': '#C5A059', 'confirmé': '#2D5A27', 'annulé': '#D93025', 'terminé': '#555' };
const statutBg    = { 'en attente': '#FFF8E1', 'confirmé': '#E9F5E8', 'annulé': '#FFF0F0', 'terminé': '#F5F5F5' };

// ── Formulaire création salon ──────────────────────────────
const CreerSalonForm = ({ onCreated }) => {
  const [form, setForm] = useState({ nom_salon: '', specialite: '', city: '', adresse: '', telephone: '', description: '', categories: ['coiffure'] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const toggleCat = (slug) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(slug)
        ? f.categories.filter(c => c !== slug)
        : [...f.categories, slug],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom_salon || !form.specialite || !form.city || !form.adresse || !form.telephone) { setError('Nom, spécialité, ville, adresse et téléphone sont requis.'); return; }
    if (form.categories.length === 0) { setError('Sélectionnez au moins une catégorie.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/prestataires', form);
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${colors.border}`, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', ...card, padding: '36px' }}>
      <h2 style={{ fontWeight: '800', fontSize: '1.5rem', marginBottom: '8px' }}>Créez votre fiche salon</h2>
      <p style={{ color: colors.gray, marginBottom: '28px', fontSize: '0.95rem' }}>Complétez ces informations pour que vos clientes puissent vous trouver.</p>

      {error && <div style={{ backgroundColor: '#FFF0F0', border: '1px solid #FFB3B3', borderRadius: '10px', padding: '12px 16px', color: '#D93025', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Nom du salon *</label>
          <input style={inputStyle} placeholder="MistralCare" value={form.nom_salon} onChange={e => setForm({ ...form, nom_salon: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Spécialité *</label>
          <input style={inputStyle} placeholder="Tresses & Locks" value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Adresse *</label>
          <input style={inputStyle} placeholder="15 rue Gauthey, 75017 Paris" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Téléphone *</label>
            <input style={inputStyle} placeholder="06 12 34 56 78" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Ville *</label>
            <input style={inputStyle} placeholder="paris" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value.toLowerCase() })} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '8px' }}>Catégories *</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c.slug} type="button" onClick={() => toggleCat(c.slug)} style={{ padding: '8px 16px', borderRadius: '20px', border: `2px solid ${form.categories.includes(c.slug) ? colors.terracotta : colors.border}`, backgroundColor: form.categories.includes(c.slug) ? '#FDF5F1' : colors.white, color: form.categories.includes(c.slug) ? colors.terracotta : colors.gray, fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Description</label>
          <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Décrivez votre salon…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: loading ? '#CCC' : colors.black, color: colors.white, fontWeight: '700', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
          {loading ? 'Création…' : 'Créer mon salon →'}
        </button>
      </form>
    </div>
  );
};

// ── Dashboard Pro ──────────────────────────────────────────
const DashboardPro = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [salon, setSalon]       = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [salonRes, bookingsRes] = await Promise.allSettled([
          api.get('/prestataires/mon-salon'),
          api.get('/bookings/pro'),
        ]);
        if (salonRes.status === 'fulfilled') setSalon(salonRes.value.data);
        if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const deconnexion = () => { localStorage.clear(); navigate('/login'); };

  if (loading) return (
    <div style={{ paddingTop: '140px', textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ width: '36px', height: '36px', margin: '0 auto 12px', border: '3px solid #F0E8E3', borderTop: `3px solid ${colors.terracotta}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Pas encore de salon ──
  if (!salon) return (
    <div style={{ paddingTop: '100px', backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Espace Professionnel</h1>
            <p style={{ color: colors.gray }}>Bienvenue ! Commencez par créer votre fiche salon.</p>
          </div>
          <button onClick={deconnexion} style={{ padding: '10px 20px', borderRadius: '10px', border: `1px solid ${colors.border}`, cursor: 'pointer', fontWeight: '600', backgroundColor: colors.white }}>Déconnexion</button>
        </div>
        <CreerSalonForm onCreated={(s) => setSalon(s)} />
      </div>
    </div>
  );

  // ── Stats calculées ──
  const rdvConfirmes  = bookings.filter(b => b.statut === 'confirmé').length;
  const rdvEnAttente  = bookings.filter(b => b.statut === 'en attente').length;
  const totalAcomptes = bookings.filter(b => b.paypalStatus === 'COMPLETED').reduce((s, b) => s + (b.acompte || 0), 0);
  const prochains     = bookings.filter(b => b.statut !== 'annulé' && new Date(b.date_rendezvous) >= new Date()).sort((a, b) => new Date(a.date_rendezvous) - new Date(b.date_rendezvous)).slice(0, 5);

  const stats = [
    { label: 'Acomptes reçus', value: `${totalAcomptes}€`, sub: 'paiements PayPal validés' },
    { label: 'RDV confirmés', value: rdvConfirmes, sub: `${rdvEnAttente} en attente` },
    { label: 'Note clients', value: salon.note > 0 ? `${salon.note.toFixed(1)}/5` : '—', sub: `${salon.nb_avis || 0} avis` },
  ];

  return (
    <div style={{ paddingTop: '100px', backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', margin: 0 }}>{salon.nom_salon}</h1>
            <p style={{ color: colors.gray, margin: '4px 0 0', fontSize: '0.95rem' }}>📍 {salon.adresse}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to={`/salon/${salon._id}`} target="_blank" style={{ padding: '10px 20px', borderRadius: '10px', border: `1px solid ${colors.border}`, backgroundColor: colors.white, color: colors.black, fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
              Voir ma vitrine →
            </Link>
            <button onClick={deconnexion} style={{ padding: '10px 20px', borderRadius: '10px', border: `1px solid ${colors.border}`, cursor: 'pointer', fontWeight: '600', backgroundColor: colors.white }}>Déconnexion</button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }}>
          {stats.map((s, i) => (
            <div key={i} style={card}>
              <p style={{ color: colors.gray, fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px' }}>{s.label}</p>
              <p style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ color: colors.gray, fontSize: '0.82rem', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '28px' }}>

          {/* PROCHAINS RDV */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '800', margin: 0 }}>Prochains rendez-vous</h3>
              <Link to="/planning" style={{ fontSize: '0.85rem', color: colors.terracotta, fontWeight: '700', textDecoration: 'none' }}>Voir tout →</Link>
            </div>
            {prochains.length === 0 ? (
              <p style={{ color: colors.gray, fontStyle: 'italic', fontSize: '0.9rem' }}>Aucun rendez-vous à venir.</p>
            ) : prochains.map(b => (
              <div key={b._id} style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${colors.border}`, gap: '14px' }}>
                <div style={{ textAlign: 'center', minWidth: '52px' }}>
                  <p style={{ fontWeight: '800', color: colors.terracotta, margin: 0, fontSize: '0.95rem' }}>{b.heure}</p>
                  <p style={{ fontSize: '0.72rem', color: colors.gray, margin: 0 }}>
                    {new Date(b.date_rendezvous).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', margin: '0 0 2px', fontSize: '0.95rem' }}>
                    {b.client?.prenom_client || b.client_info?.firstName || '—'} {b.client?.nom_client || b.client_info?.lastName || ''}
                  </p>
                  <p style={{ color: colors.gray, fontSize: '0.83rem', margin: 0 }}>
                    {b.service_snapshot?.nom || '—'} · {b.service_snapshot?.duree || b.duration} min
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', backgroundColor: statutBg[b.statut] || '#F5F5F5', color: statutColor[b.statut] || colors.gray, whiteSpace: 'nowrap' }}>
                  {b.statut}
                </span>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...card, backgroundColor: colors.black, color: colors.white }}>
              <h3 style={{ fontWeight: '800', marginBottom: '6px' }}>Gestion du salon</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '20px', lineHeight: '1.5' }}>Gérez vos prestations, votre équipe et vos disponibilités.</p>
              {[
                { label: 'Mes prestations', path: '/manage-services' },
                { label: 'Mon équipe', path: '/manage-employees' },
                { label: 'Mon planning', path: '/planning' },
              ].map((item, i) => (
                <button key={i} onClick={() => navigate(item.path)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.25)', backgroundColor: i === 0 ? colors.terracotta : 'transparent', color: colors.white, fontWeight: '700', cursor: 'pointer', marginBottom: '10px', fontSize: '0.9rem' }}>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Infos salon */}
            <div style={card}>
              <h4 style={{ fontWeight: '800', marginBottom: '14px', margin: '0 0 14px' }}>Mon salon</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {salon.categories?.map(c => (
                    <span key={c} style={{ backgroundColor: '#FDF5F1', color: colors.terracotta, padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', border: `1px solid ${colors.terracotta}30` }}>{c}</span>
                  ))}
                </div>
                <p style={{ color: colors.gray, fontSize: '0.85rem', margin: 0 }}>📞 {salon.telephone}</p>
                {salon.note > 0 && <p style={{ color: colors.gray, fontSize: '0.85rem', margin: 0 }}>★ {salon.note.toFixed(1)} · {salon.nb_avis} avis</p>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPro;

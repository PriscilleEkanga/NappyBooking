import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const API_BASE = 'http://localhost:5000';

const colors = {
  terracotta: '#B37256', black: '#1A1A1A', white: '#FFFFFF',
  porcelain: '#FAF9F6', gray: '#717171', border: '#E5E5E5',
  error: '#D93025', errorBg: '#FFF0F0',
};

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: `1.5px solid ${colors.border}`, fontSize: '0.93rem',
  boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
};

const EMPTY_FORM = { nom: '', categorie: '', duree: '', prix: '', acompte_pct: 30, description: '' };

const ManageServices = () => {
  const navigate = useNavigate();
  const [salon, setSalon]       = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRef = useRef(null);
  const uploadTargetId = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [salonRes, catsRes] = await Promise.all([
          api.get('/prestataires/mon-salon'),
          api.get('/categories'),
        ]);
        setSalon(salonRes.data);
        setCategories(catsRes.data);
        const svcRes = await api.get(`/services?salonId=${salonRes.data._id}`);
        setServices(svcRes.data);
      } catch {
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const validate = () => {
    if (!form.nom.trim()) return 'Le nom est requis.';
    if (!form.categorie) return 'La catégorie est requise.';
    if (!form.duree || isNaN(form.duree) || Number(form.duree) <= 0) return 'Durée invalide.';
    if (!form.prix || isNaN(form.prix) || Number(form.prix) <= 0) return 'Prix invalide.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, duree: Number(form.duree), prix: Number(form.prix), acompte_pct: Number(form.acompte_pct) };
      if (editId) {
        const { data } = await api.put(`/services/${editId}`, payload);
        setServices(services.map(s => s._id === editId ? data : s));
      } else {
        const { data } = await api.post('/services', payload);
        setServices([...services, data]);
      }
      setForm(EMPTY_FORM); setEditId(null); setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s) => {
    setForm({ nom: s.nom, categorie: s.categorie, duree: s.duree, prix: s.prix, acompte_pct: s.acompte_pct, description: s.description || '' });
    setEditId(s._id); setShowForm(true); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const cancelForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); setError(''); };

  const handlePhotoClick = (serviceId) => {
    uploadTargetId.current = serviceId;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const id = uploadTargetId.current;
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const { data } = await api.post(`/services/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setServices(prev => prev.map(s => s._id === id ? { ...s, photo: data.photo } : s));
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ width: '36px', height: '36px', margin: '0 auto', border: '3px solid #F0E8E3', borderTop: `3px solid ${colors.terracotta}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ paddingTop: '100px', backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 60px' }}>

        <button onClick={() => navigate('/dashboard-pro')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: colors.terracotta, marginBottom: '20px', fontSize: '0.9rem' }}>
          ← Retour au dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontWeight: '800', fontSize: '1.7rem', margin: 0 }}>Mes prestations</h1>
            {salon && <p style={{ color: colors.gray, margin: '4px 0 0', fontSize: '0.9rem' }}>{salon.nom_salon} · {services.length} service{services.length > 1 ? 's' : ''}</p>}
          </div>
          {!showForm && (
            <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
              style={{ padding: '12px 22px', borderRadius: '10px', border: 'none', backgroundColor: colors.terracotta, color: colors.white, fontWeight: '700', cursor: 'pointer' }}>
              + Ajouter un service
            </button>
          )}
        </div>

        {/* FORMULAIRE */}
        {showForm && (
          <div style={{ backgroundColor: colors.white, borderRadius: '20px', padding: '28px', marginBottom: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '20px', margin: '0 0 20px' }}>
              {editId ? 'Modifier le service' : 'Nouveau service'}
            </h3>

            {error && <div style={{ backgroundColor: colors.errorBg, border: `1px solid #FFB3B3`, borderRadius: '10px', padding: '11px 14px', color: colors.error, marginBottom: '16px', fontSize: '0.88rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Nom du service *</label>
                  <input style={inputStyle} placeholder="Box Braids" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Catégorie *</label>
                  <select style={inputStyle} value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}>
                    <option value="">Choisir…</option>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Durée (min) *</label>
                  <input type="number" style={inputStyle} placeholder="180" min="1" value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Prix (€) *</label>
                  <input type="number" style={inputStyle} placeholder="120" min="1" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Acompte (%)</label>
                  <input type="number" style={inputStyle} min="0" max="100" value={form.acompte_pct} onChange={e => setForm({ ...form, acompte_pct: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Description (optionnel)</label>
                <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Braids protectrices longue durée…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={cancelForm} style={{ padding: '11px 22px', borderRadius: '10px', border: `1.5px solid ${colors.border}`, backgroundColor: colors.white, fontWeight: '700', cursor: 'pointer', color: colors.gray }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} style={{ padding: '11px 24px', borderRadius: '10px', border: 'none', backgroundColor: saving ? '#CCC' : colors.terracotta, color: colors.white, fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Enregistrement…' : editId ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTE */}
        {/* Input fichier caché — partagé entre tous les services */}
        <input
          type="file" ref={fileInputRef} style={{ display: 'none' }}
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
        />

        {services.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: colors.gray }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✂️</p>
            <p style={{ fontWeight: '700', marginBottom: '6px' }}>Aucun service pour l'instant</p>
            <p style={{ fontSize: '0.88rem' }}>Ajoutez vos premières prestations pour être réservable.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.map(s => (
              <div key={s._id} style={{ backgroundColor: colors.white, borderRadius: '14px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>

                  {/* PHOTO */}
                  <div
                    onClick={() => handlePhotoClick(s._id)}
                    title="Cliquer pour changer la photo"
                    style={{ width: '90px', flexShrink: 0, backgroundColor: '#F0E8E3', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90px' }}
                  >
                    {uploadingId === s._id ? (
                      <div style={{ width: '24px', height: '24px', border: '3px solid #E8D5CC', borderTop: `3px solid ${colors.terracotta}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : s.photo ? (
                      <img src={`${API_BASE}${s.photo}`} alt={s.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: colors.gray }}>
                        <div style={{ fontSize: '1.4rem', marginBottom: '2px' }}>📷</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '600' }}>Ajouter</div>
                      </div>
                    )}
                    {/* Overlay au hover */}
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                      <span style={{ color: colors.white, fontSize: '0.7rem', fontWeight: '700' }}>Changer</span>
                    </div>
                  </div>

                  {/* INFOS */}
                  <div style={{ flex: 1, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '800', fontSize: '1rem' }}>{s.nom}</span>
                        <span style={{ backgroundColor: '#FDF5F1', color: colors.terracotta, padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{s.categorie}</span>
                      </div>
                      <p style={{ color: colors.gray, fontSize: '0.83rem', margin: '3px 0 0' }}>⏱ {s.duree} min · acompte {s.acompte_pct}%</p>
                      {s.description && <p style={{ color: colors.gray, fontSize: '0.8rem', margin: '2px 0 0', fontStyle: 'italic' }}>{s.description}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{ fontWeight: '800', fontSize: '1.2rem', color: colors.terracotta }}>{s.prix}€</span>
                      <button onClick={() => handleEdit(s)} style={{ padding: '7px 14px', borderRadius: '8px', border: `1.5px solid ${colors.border}`, backgroundColor: colors.white, cursor: 'pointer', fontWeight: '600', fontSize: '0.83rem' }}>Modifier</button>
                      <button onClick={() => handleDelete(s._id)} style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', backgroundColor: colors.errorBg, color: colors.error, cursor: 'pointer', fontWeight: '600', fontSize: '0.83rem' }}>Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;

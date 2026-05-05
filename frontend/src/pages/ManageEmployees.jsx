import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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

const EMPTY_FORM = { prenom: '', nom: '', specialites: '' };

const ManageEmployees = () => {
  const navigate = useNavigate();
  const [salon, setSalon]       = useState(null);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const salonRes = await api.get('/prestataires/mon-salon');
        setSalon(salonRes.data);
        const empRes = await api.get(`/employes?salonId=${salonRes.data._id}`);
        setEmployes(empRes.data);
      } catch {
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.prenom.trim()) { setError('Le prénom est requis.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        specialites: form.specialites ? form.specialites.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editId) {
        const { data } = await api.put(`/employes/${editId}`, payload);
        setEmployes(employes.map(e => e._id === editId ? data : e));
      } else {
        const { data } = await api.post('/employes', payload);
        setEmployes([...employes, data]);
      }
      setForm(EMPTY_FORM); setEditId(null); setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emp) => {
    setForm({ prenom: emp.prenom, nom: emp.nom || '', specialites: (emp.specialites || []).join(', ') });
    setEditId(emp._id); setShowForm(true); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Retirer cet employé ?')) return;
    try {
      await api.delete(`/employes/${id}`);
      setEmployes(employes.filter(e => e._id !== id));
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const cancelForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); setError(''); };

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
            <h1 style={{ fontWeight: '800', fontSize: '1.7rem', margin: 0 }}>Mon équipe</h1>
            {salon && <p style={{ color: colors.gray, margin: '4px 0 0', fontSize: '0.9rem' }}>{salon.nom_salon} · {employes.length} employé{employes.length > 1 ? 's' : ''}</p>}
          </div>
          {!showForm && (
            <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
              style={{ padding: '12px 22px', borderRadius: '10px', border: 'none', backgroundColor: colors.terracotta, color: colors.white, fontWeight: '700', cursor: 'pointer' }}>
              + Ajouter un employé
            </button>
          )}
        </div>

        {error && <div style={{ backgroundColor: colors.errorBg, border: `1px solid #FFB3B3`, borderRadius: '10px', padding: '11px 14px', color: colors.error, marginBottom: '16px', fontSize: '0.88rem' }}>{error}</div>}

        {/* FORMULAIRE */}
        {showForm && (
          <div style={{ backgroundColor: colors.white, borderRadius: '20px', padding: '28px', marginBottom: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: '800', margin: '0 0 20px' }}>
              {editId ? 'Modifier l\'employé' : 'Nouvel employé'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Prénom *</label>
                  <input style={inputStyle} placeholder="Aminata" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Nom</label>
                  <input style={inputStyle} placeholder="Diallo" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Spécialités (séparées par des virgules)</label>
                <input style={inputStyle} placeholder="Box Braids, Locks, Vanilles" value={form.specialites} onChange={e => setForm({ ...form, specialites: e.target.value })} />
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
        {employes.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: colors.gray }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👩🏾‍🎨</p>
            <p style={{ fontWeight: '700', marginBottom: '6px' }}>Aucun employé pour l'instant</p>
            <p style={{ fontSize: '0.88rem' }}>Ajoutez votre équipe pour permettre aux clientes de choisir leur styliste.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {employes.map(emp => (
              <div key={emp._id} style={{ backgroundColor: colors.white, borderRadius: '16px', padding: '20px', border: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: colors.terracotta, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: '800', fontSize: '1.1rem', flexShrink: 0 }}>
                    {emp.prenom.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '800', margin: 0 }}>{emp.prenom} {emp.nom}</p>
                    {emp.specialites?.length > 0 && (
                      <p style={{ fontSize: '0.82rem', color: colors.gray, margin: '2px 0 0' }}>{emp.specialites.join(' · ')}</p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(emp)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1.5px solid ${colors.border}`, backgroundColor: colors.white, cursor: 'pointer', fontWeight: '600', fontSize: '0.83rem' }}>Modifier</button>
                  <button onClick={() => handleDelete(emp._id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: colors.errorBg, color: colors.error, cursor: 'pointer', fontWeight: '600', fontSize: '0.83rem' }}>Retirer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEmployees;

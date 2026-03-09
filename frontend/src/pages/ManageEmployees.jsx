import { useState } from 'react';
import { Link } from 'react-router-dom';

const COLORS = {
  terracotta: '#B37256',
  black: '#1A1A1A',
  white: '#FFFFFF',
  porcelain: '#FAF9F6',
  gray: '#717171',
  border: '#E5E5E5',
  danger: '#D93025',
  dangerBg: '#FFF0F0',
  success: '#2D5A27',
  successBg: '#E9F5E8',
};

const getInputStyle = (hasError) => ({
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: `1.5px solid ${hasError ? COLORS.danger : COLORS.border}`,
  fontSize: '0.95rem',
  color: COLORS.black,
  backgroundColor: COLORS.white,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
});

const FormField = ({ label, name, type = 'text', placeholder, required, form, setForm, errors }) => (
  <div>
    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: COLORS.black, display: 'block', marginBottom: '8px' }}>
      {label} {required && <span style={{ color: COLORS.danger }}>*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={form[name]}
      onChange={e => setForm({ ...form, [name]: e.target.value })}
      style={getInputStyle(!!errors[name])}
    />
    {errors[name] && <p style={{ color: COLORS.danger, fontSize: '0.8rem', margin: '4px 0 0' }}>{errors[name]}</p>}
  </div>
);

const EmployeeForm = ({ form, setForm, errors, onSubmit, onCancel, submitLabel }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      <FormField label="Prénom" name="firstName" placeholder="Aminata" required form={form} setForm={setForm} errors={errors} />
      <FormField label="Nom" name="lastName" placeholder="Diallo" required form={form} setForm={setForm} errors={errors} />
    </div>
    <FormField label="Poste" name="role" placeholder="Coiffeuse senior, Apprentie..." required form={form} setForm={setForm} errors={errors} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      <FormField label="Email" name="email" type="email" placeholder="aminata@email.fr" required form={form} setForm={setForm} errors={errors} />
      <FormField label="Téléphone" name="phone" placeholder="06 12 34 56 78" required form={form} setForm={setForm} errors={errors} />
    </div>
    <FormField label="Spécialités (séparées par des virgules)" name="specialties" placeholder="Box Braids, Lace Wig, Locks" form={form} setForm={setForm} errors={errors} />
    <div>
      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: COLORS.black, display: 'block', marginBottom: '8px' }}>Statut</label>
      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={getInputStyle(false)}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
    <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
      <button onClick={onCancel} style={{ flex: 1, padding: '13px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent', fontWeight: '700', cursor: 'pointer', color: COLORS.black }}>Annuler</button>
      <button onClick={onSubmit} style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', backgroundColor: COLORS.terracotta, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>{submitLabel}</button>
    </div>
  </div>
);

const ManageEmployees = () => {
  const emptyForm = { firstName: '', lastName: '', role: '', email: '', phone: '', specialties: '', status: 'active' };

  const [employees, setEmployees] = useState([
    { id: 1, firstName: 'Aminata', lastName: 'Diallo', role: 'Coiffeuse senior', email: 'aminata@nappybooking.fr', phone: '06 11 22 33 44', specialties: ['Box Braids', 'Knotless', 'Lace Wig'], status: 'active', appointmentsThisMonth: 14 },
    { id: 2, firstName: 'Fatoumata', lastName: 'Kouyaté', role: 'Coiffeuse', email: 'fatoumata@nappybooking.fr', phone: '06 55 66 77 88', specialties: ['Vanilles', 'Locks', 'Crochet'], status: 'active', appointmentsThisMonth: 9 },
    { id: 3, firstName: 'Marlène', lastName: 'Bouanga', role: 'Apprentie', email: 'marlene@nappybooking.fr', phone: '06 99 00 11 22', specialties: ['Soins', 'Démêlage'], status: 'inactive', appointmentsThisMonth: 3 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const showSuccess = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(''), 3000); };

  const validate = (data) => {
    const errs = {};
    if (!data.firstName.trim()) errs.firstName = 'Prénom requis';
    if (!data.lastName.trim()) errs.lastName = 'Nom requis';
    if (!data.role.trim()) errs.role = 'Poste requis';
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) errs.email = 'Email invalide';
    if (!data.phone.trim()) errs.phone = 'Téléphone requis';
    return errs;
  };

  const handleAdd = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setEmployees([...employees, { id: Date.now(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), role: form.role.trim(), email: form.email.trim(), phone: form.phone.trim(), specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()).filter(Boolean) : [], status: form.status, appointmentsThisMonth: 0 }]);
    showSuccess(`${form.firstName} ${form.lastName} a été ajouté(e).`);
    setForm(emptyForm); setFormErrors({}); setShowAddForm(false);
  };

  const handleEditOpen = (emp) => {
    setSelectedEmployee(emp);
    setForm({ firstName: emp.firstName, lastName: emp.lastName, role: emp.role, email: emp.email, phone: emp.phone, specialties: emp.specialties.join(', '), status: emp.status });
    setFormErrors({}); setShowEditModal(true);
  };

  const handleEditSave = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setEmployees(prev => prev.map(e => e.id === selectedEmployee.id ? { ...e, firstName: form.firstName.trim(), lastName: form.lastName.trim(), role: form.role.trim(), email: form.email.trim(), phone: form.phone.trim(), specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()).filter(Boolean) : [], status: form.status } : e));
    setShowEditModal(false); setSelectedEmployee(null);
    showSuccess('Informations mises à jour.');
  };

  const handleDelete = (id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    setDeleteConfirmId(null);
    showSuccess(`${emp.firstName} ${emp.lastName} a été supprimé(e).`);
  };

  const handleToggleStatus = (id) => setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e));

  const cardStyle = { backgroundColor: COLORS.white, borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: `1px solid ${COLORS.border}` };

  return (
    <div style={{ padding: '100px 20px 60px', backgroundColor: COLORS.porcelain, minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: COLORS.black, margin: 0 }}>Mon équipe</h1>
            <p style={{ color: COLORS.gray, marginTop: '6px' }}>{employees.filter(e => e.status === 'active').length} employée(s) active(s)</p>
          </div>
          <Link to="/dashboard-pro" style={{ color: COLORS.terracotta, fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>Retour au tableau de bord</Link>
        </div>

        {successMessage && (
          <div style={{ backgroundColor: COLORS.successBg, border: '1px solid #A8D5A2', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', color: COLORS.success, fontWeight: '600', fontSize: '0.9rem' }}>
            {successMessage}
          </div>
        )}

        {!showAddForm && (
          <button onClick={() => { setShowAddForm(true); setForm(emptyForm); setFormErrors({}); }} style={{ width: '100%', padding: '16px', marginBottom: '24px', borderRadius: '14px', border: `2px dashed ${COLORS.terracotta}`, backgroundColor: 'transparent', color: COLORS.terracotta, fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Ajouter une employée
          </button>
        )}

        {showAddForm && (
          <div style={{ ...cardStyle, padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: COLORS.black, marginBottom: '20px' }}>Nouvelle employée</h3>
            <EmployeeForm form={form} setForm={setForm} errors={formErrors} onSubmit={handleAdd} onCancel={() => { setShowAddForm(false); setFormErrors({}); }} submitLabel="Ajouter" />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {employees.map(emp => (
            <div key={emp.id} style={{ ...cardStyle, padding: '22px 24px', opacity: emp.status === 'inactive' ? 0.75 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0, backgroundColor: emp.status === 'inactive' ? COLORS.border : COLORS.terracotta, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: '800', fontSize: '1rem' }}>
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h4 style={{ fontWeight: '800', fontSize: '1rem', color: COLORS.black, margin: 0 }}>{emp.firstName} {emp.lastName}</h4>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', backgroundColor: emp.status === 'active' ? COLORS.successBg : '#F0F0F0', color: emp.status === 'active' ? COLORS.success : COLORS.gray }}>
                        {emp.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p style={{ color: COLORS.terracotta, fontSize: '0.85rem', fontWeight: '600', margin: '3px 0 6px' }}>{emp.role}</p>
                    <p style={{ color: COLORS.gray, fontSize: '0.82rem', margin: '0 0 4px' }}>{emp.email} &nbsp;·&nbsp; {emp.phone}</p>
                    {emp.specialties.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {emp.specialties.map(s => <span key={s} style={{ backgroundColor: COLORS.porcelain, border: `1px solid ${COLORS.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', color: COLORS.black }}>{s}</span>)}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: COLORS.gray, fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>RDV ce mois</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: COLORS.black, margin: 0 }}>{emp.appointmentsThisMonth}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleToggleStatus(emp.id)} style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent', color: emp.status === 'active' ? COLORS.gray : COLORS.success }}>
                      {emp.status === 'active' ? 'Désactiver' : 'Réactiver'}
                    </button>
                    <button onClick={() => handleEditOpen(emp)} style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', border: `1.5px solid ${COLORS.terracotta}`, backgroundColor: 'transparent', color: COLORS.terracotta }}>Modifier</button>
                    <button onClick={() => setDeleteConfirmId(emp.id)} style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', border: 'none', backgroundColor: COLORS.dangerBg, color: COLORS.danger }}>Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {employees.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.gray }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.border} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p>Aucune employée pour le moment.</p>
          </div>
        )}
      </div>

      {showEditModal && selectedEmployee && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: COLORS.white, borderRadius: '20px', padding: '32px', maxWidth: '520px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '1.2rem', color: COLORS.black, margin: 0 }}>Modifier — {selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
              <button onClick={() => { setShowEditModal(false); setFormErrors({}); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gray, fontSize: '1.4rem', fontWeight: '700' }}>x</button>
            </div>
            <EmployeeForm form={form} setForm={setForm} errors={formErrors} onSubmit={handleEditSave} onCancel={() => { setShowEditModal(false); setFormErrors({}); }} submitLabel="Enregistrer" />
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: COLORS.white, borderRadius: '20px', padding: '32px', maxWidth: '420px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
              </svg>
            </div>
            <h3 style={{ fontWeight: '800', color: COLORS.black, marginBottom: '10px' }}>Supprimer cette employée ?</h3>
            <p style={{ color: COLORS.gray, fontSize: '0.9rem', marginBottom: '24px' }}>Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, padding: '13px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, backgroundColor: 'transparent', fontWeight: '700', cursor: 'pointer', color: COLORS.black }}>Annuler</button>
              <button onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', backgroundColor: COLORS.danger, color: COLORS.white, fontWeight: '700', cursor: 'pointer' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;

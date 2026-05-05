import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api';

const colors = {
  terracotta: '#B37256',
  porcelain: '#FAF9F6',
  black: '#1A1A1A',
  white: '#FFFFFF',
  lightGray: '#F0EFED',
  border: '#E5E5E5',
  gray: '#666666',
  error: '#E53E3E',
};

const btnPrimary = {
  backgroundColor: colors.terracotta, color: colors.white,
  border: 'none', borderRadius: '10px', padding: '14px 30px',
  fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
};
const btnSecondary = {
  backgroundColor: 'transparent', color: colors.terracotta,
  border: `2px solid ${colors.terracotta}`, borderRadius: '10px',
  padding: '12px 28px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
};
const cardStyle = (selected) => ({
  border: `2px solid ${selected ? colors.terracotta : colors.border}`,
  borderRadius: '16px', padding: '20px', cursor: 'pointer',
  backgroundColor: selected ? '#FDF5F1' : colors.white,
  transition: 'all 0.2s',
});
const inputStyle = (err) => ({
  width: '100%', padding: '14px 16px', borderRadius: '10px',
  border: `1.5px solid ${err ? colors.error : colors.border}`,
  fontSize: '1rem', color: colors.black, backgroundColor: colors.white,
  outline: 'none', boxSizing: 'border-box',
});

const STEP_LABELS = ['Prestation', 'Employée', 'Date & Heure', 'Coordonnées'];

const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const dayNames   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function BookingForm() {
  const { salonId } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId');
  const navigate = useNavigate();

  // ── Données API ──
  const [salon, setSalon]         = useState(null);
  const [services, setServices]   = useState([]);
  const [employes, setEmployes]   = useState([]);
  const [creneaux, setCreneaux]   = useState([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // ── Sélections ──
  const [step, setStep]                     = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [selectedDate, setSelectedDate]       = useState(null); // objet Date
  const [selectedCreneau, setSelectedCreneau] = useState(null); // objet Disponibilite
  const [currentMonth, setCurrentMonth]       = useState(new Date());

  // ── Formulaire client ──
  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', phone: '', note: '' });
  const [errors, setErrors]     = useState({});
  const [rgpd, setRgpd]         = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  // ── PayPal ──
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError]   = useState('');
  const [isLoading, setIsLoading]       = useState(false);

  // ── Confirmation ──
  const [bookingRef, setBookingRef] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // ── Chargement initial : salon + services + employés ──
  useEffect(() => {
    const init = async () => {
      try {
        const [salonRes, servicesRes, employesRes] = await Promise.all([
          api.get(`/prestataires/${salonId}`),
          api.get(`/services?salonId=${salonId}`),
          api.get(`/employes?salonId=${salonId}`),
        ]);
        setSalon(salonRes.data);
        setServices(servicesRes.data);
        setEmployes(employesRes.data);

        // Pré-sélectionner le service si passé depuis ProfilSalon
        if (preselectedServiceId) {
          const found = servicesRes.data.find(s => s._id === preselectedServiceId);
          if (found) setSelectedService(found);
        }
      } catch {
        // géré par le rendu
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, [salonId, preselectedServiceId]);

  // ── Chargement des créneaux quand date change ──
  useEffect(() => {
    if (!selectedDate) return;
    const fetchCreneaux = async () => {
      setLoadingSlots(true);
      setSelectedCreneau(null);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const employeParam = selectedEmploye ? `&employeId=${selectedEmploye._id}` : '';
        const { data } = await api.get(`/disponibilites?salonId=${salonId}&date=${dateStr}${employeParam}`);
        setCreneaux(data);
      } catch {
        setCreneaux([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchCreneaux();
  }, [selectedDate, selectedEmploye, salonId]);

  // ── SDK PayPal ──
  useEffect(() => {
    if (window.paypal) { setPaypalLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AZDhCrY5a9JLEXymDKZTY1dHUMqMjBMlkVVG1JLcQiyBj-rqFCOtznI7HS83NM6npkKTZgxcBBUDnSBj&currency=EUR&intent=capture';
    script.onload  = () => setPaypalLoaded(true);
    script.onerror = () => setPaypalError('Impossible de charger PayPal.');
    document.body.appendChild(script);
  }, []);

  // ── Rendu boutons PayPal ──
  useEffect(() => {
    if (!paypalLoaded || !formValidated || !selectedService) return;
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    container.innerHTML = '';

    const depositAmount = parseFloat((selectedService.prix * (selectedService.acompte_pct / 100)).toFixed(2));

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },

      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          description: `Acompte RDV - ${selectedService.nom} chez ${salon?.nom_salon}`,
          amount: { value: depositAmount.toFixed(2), currency_code: 'EUR' },
        }],
      }),

      onApprove: async (data, actions) => {
        setIsLoading(true);
        try {
          const details = await actions.order.capture();
          const { data: bookingData } = await api.post('/bookings', {
            salonId,
            serviceId:    selectedService._id,
            employeId:    selectedEmploye?._id || null,
            nomSalon:     salon?.nom_salon || '',
            date:         selectedDate.toISOString(),
            heure:        selectedCreneau.heure_debut,
            client_info:  { ...form },
            depositAmount,
            paypalOrderId: details.id,
          });
          setBookingRef(bookingData.bookingReference);
          setStep(5);
        } catch (err) {
          setPaypalError(err.response?.data?.message || 'Erreur après paiement. Contactez le support.');
        } finally {
          setIsLoading(false);
        }
      },

      onError:  () => setPaypalError('Le paiement a échoué. Veuillez réessayer.'),
      onCancel: () => setPaypalError('Paiement annulé.'),
    }).render('#paypal-button-container');
  }, [paypalLoaded, formValidated, selectedService]); // eslint-disable-line

  // ── Calendrier ──
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { daysInMonth, firstDayOffset: firstDay === 0 ? 6 : firstDay - 1 };
  }, []);

  const isDateDisabled = (day) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d < today || d.getDay() === 0;
  };

  const formatDate = (d) => d?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // ── Validation ──
  const validateForm = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim())  e.lastName  = 'Nom requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!/^[\d\s+()-]{10,}$/.test(form.phone)) e.phone = 'Téléphone invalide';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleValidateForm = () => {
    if (!validateForm()) return;
    if (!rgpd) { alert("Veuillez accepter les conditions d'utilisation."); return; }
    setFormValidated(true);
  };

  // ──────────────────────────────────���──────
  //  CHARGEMENT INITIAL
  // ─────────────────────────────────────────
  if (loadingInit) return (
    <div style={{ paddingTop: '140px', textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ width: '40px', height: '40px', margin: '0 auto 16px', border: '3px solid #F0E8E3', borderTop: `3px solid ${colors.terracotta}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: colors.gray }}>Chargement…</p>
    </div>
  );

  if (!salon) return (
    <div style={{ paddingTop: '140px', textAlign: 'center', minHeight: '60vh' }}>
      <p style={{ color: colors.gray, fontSize: '1.1rem' }}>Salon introuvable.</p>
      <button onClick={() => navigate(-1)} style={{ ...btnPrimary, marginTop: '16px' }}>Retour</button>
    </div>
  );

  // ─────────────────────────────────────────
  //  RÉCAPITULATIF LATÉRAL
  // ─────────────────────────────────────────
  const Summary = () => (
    <div style={{ backgroundColor: colors.white, borderRadius: '20px', padding: '28px', border: `1px solid ${colors.border}`, position: 'sticky', top: '120px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Récapitulatif</h3>

      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontSize: '0.75rem', color: colors.gray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>Salon</p>
        <p style={{ fontWeight: '600', margin: 0 }}>{salon.nom_salon}</p>
        <p style={{ fontSize: '0.85rem', color: colors.gray, margin: 0 }}>{salon.adresse}</p>
      </div>

      {selectedService && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '14px', marginBottom: '14px' }}>
          <p style={{ fontSize: '0.75rem', color: colors.gray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>Prestation</p>
          <p style={{ fontWeight: '600', margin: 0 }}>{selectedService.nom}</p>
          <p style={{ fontSize: '0.85rem', color: colors.gray, margin: 0 }}>{selectedService.duree} min · {selectedService.prix}€</p>
        </div>
      )}

      {selectedEmploye && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '14px', marginBottom: '14px' }}>
          <p style={{ fontSize: '0.75rem', color: colors.gray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>Employée</p>
          <p style={{ fontWeight: '600', margin: 0 }}>{selectedEmploye.prenom} {selectedEmploye.nom}</p>
        </div>
      )}

      {selectedDate && selectedCreneau && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '14px', marginBottom: '14px' }}>
          <p style={{ fontSize: '0.75rem', color: colors.gray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>Date & Heure</p>
          <p style={{ fontWeight: '600', margin: 0 }}>{formatDate(selectedDate)}</p>
          <p style={{ fontSize: '0.85rem', color: colors.gray, margin: 0 }}>{selectedCreneau.heure_debut}</p>
        </div>
      )}

      {selectedService && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '14px', backgroundColor: '#FDF5F1', borderRadius: '12px', padding: '14px', marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.88rem', color: colors.gray }}>Total</span>
            <span style={{ fontWeight: '600' }}>{selectedService.prix}€</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.88rem', color: colors.terracotta, fontWeight: '700' }}>
              Acompte ({selectedService.acompte_pct}%)
            </span>
            <span style={{ fontWeight: '800', color: colors.terracotta }}>
              {Math.round(selectedService.prix * selectedService.acompte_pct / 100)}€
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: colors.gray, marginTop: '8px', lineHeight: '1.5' }}>
            Le solde ({selectedService.prix - Math.round(selectedService.prix * selectedService.acompte_pct / 100)}€) sera réglé au salon.
          </p>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────
  //  BARRE DE PROGRESSION
  // ─────────────────────────────────────────
  const StepBar = () => (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '10px' }}>
        <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '3px', backgroundColor: colors.border, zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '18px', left: '10%', width: `${((step - 1) / (STEP_LABELS.length - 1)) * 80}%`, height: '3px', backgroundColor: colors.terracotta, zIndex: 1, transition: 'width 0.4s' }} />
        {STEP_LABELS.map((label, i) => {
          const done   = step > i + 1;
          const active = step === i + 1;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: done ? colors.terracotta : active ? colors.white : colors.lightGray, border: `3px solid ${done || active ? colors.terracotta : colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem', color: done ? colors.white : active ? colors.terracotta : '#aaa' }}>
                {done ? '✓' : i + 1}
              </div>
              {!isMobile && <span style={{ fontSize: '0.78rem', marginTop: '8px', fontWeight: active ? '700' : '500', color: active ? colors.terracotta : done ? colors.black : '#aaa' }}>{label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  //  ÉTAPE 1 : PRESTATION
  // ─────────────────────────────────────────
  const Step1 = () => (
    <div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px' }}>Quelle prestation souhaitez-vous ?</h2>
      <p style={{ color: colors.gray, marginBottom: '28px' }}>{services.length} prestation{services.length > 1 ? 's' : ''} disponible{services.length > 1 ? 's' : ''}</p>

      {services.length === 0 ? (
        <p style={{ color: colors.gray, fontStyle: 'italic' }}>Aucun service disponible pour ce salon.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {services.map(s => (
            <div key={s._id} onClick={() => setSelectedService(s)} style={cardStyle(selectedService?._id === s._id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '1.05rem', margin: '0 0 4px' }}>{s.nom}</p>
                  <p style={{ fontSize: '0.88rem', color: colors.gray, margin: 0 }}>⏱ {s.duree} min</p>
                  {s.description && <p style={{ fontSize: '0.82rem', color: colors.gray, margin: '3px 0 0', fontStyle: 'italic' }}>{s.description}</p>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                  <p style={{ fontWeight: '800', fontSize: '1.2rem', color: colors.terracotta, margin: 0 }}>{s.prix}€</p>
                  <p style={{ fontSize: '0.78rem', color: colors.gray, margin: 0 }}>Acompte : {Math.round(s.prix * s.acompte_pct / 100)}€</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
        <button style={{ ...btnPrimary, opacity: selectedService ? 1 : 0.5 }} disabled={!selectedService} onClick={() => setStep(2)}>
          Continuer →
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  //  ÉTAPE 2 : EMPLOYÉE
  // ─────────────────────────────────────────
  const Step2 = () => (
    <div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px' }}>Choisissez votre employée</h2>
      <p style={{ color: colors.gray, marginBottom: '28px' }}>Ou passez cette étape pour un choix automatique</p>

      {employes.length === 0 ? (
        <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '20px', textAlign: 'center', color: colors.gray, marginBottom: '20px' }}>
          Ce salon ne gère pas d'employés individuels.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {employes.map(emp => (
            <div key={emp._id} onClick={() => setSelectedEmploye(emp)} style={cardStyle(selectedEmploye?._id === emp._id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: colors.terracotta, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: '800', fontSize: '1.1rem', flexShrink: 0 }}>
                  {emp.prenom.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', margin: '0 0 3px' }}>{emp.prenom} {emp.nom}</p>
                  {emp.specialites?.length > 0 && <p style={{ fontSize: '0.85rem', color: colors.gray, margin: 0 }}>{emp.specialites.join(', ')}</p>}
                </div>
                {selectedEmploye?._id === emp._id && <span style={{ color: colors.terracotta, fontSize: '1.3rem' }}>✓</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
        <button style={btnSecondary} onClick={() => setStep(1)}>← Retour</button>
        <button style={btnPrimary} onClick={() => setStep(3)}>
          {selectedEmploye ? 'Continuer →' : 'Passer cette étape →'}
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  //  ÉTAPE 3 : DATE & CRÉNEAU
  // ─────────────────────────────────────────
  const Step3 = () => {
    const { daysInMonth, firstDayOffset } = getDaysInMonth(currentMonth);
    return (
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px' }}>Choisissez une date</h2>
        <p style={{ color: colors.gray, marginBottom: '28px' }}>Sélectionnez un jour puis un créneau disponible</p>

        {/* Calendrier */}
        <div style={{ backgroundColor: colors.porcelain, borderRadius: '20px', padding: '24px', marginBottom: '28px' }}>
          {/* Navigation mois */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: colors.black }}>‹</button>
            <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: colors.black }}>›</button>
          </div>

          {/* Jours semaine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {dayNames.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: '700', color: colors.gray, padding: '4px 0' }}>{d}</div>)}
          </div>

          {/* Cases jours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: firstDayOffset }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const disabled = isDateDisabled(day);
              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
              return (
                <button key={day} disabled={disabled} onClick={() => setSelectedDate(dateObj)}
                  style={{ padding: '10px 4px', borderRadius: '10px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: isSelected ? '800' : '500', backgroundColor: isSelected ? colors.terracotta : 'transparent', color: disabled ? '#CCC' : isSelected ? colors.white : colors.black, transition: 'all 0.15s' }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Créneaux */}
        {selectedDate && (
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '14px', color: colors.black }}>
              Créneaux disponibles — {formatDate(selectedDate)}
            </h4>
            {loadingSlots ? (
              <p style={{ color: colors.gray }}>Chargement des créneaux…</p>
            ) : creneaux.length === 0 ? (
              <p style={{ color: colors.gray, fontStyle: 'italic' }}>Aucun créneau disponible ce jour. Essayez une autre date.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
                {creneaux.map(c => {
                  const selected = selectedCreneau?._id === c._id;
                  return (
                    <button key={c._id} onClick={() => setSelectedCreneau(c)}
                      style={{ padding: '12px 8px', borderRadius: '10px', border: `2px solid ${selected ? colors.terracotta : colors.border}`, backgroundColor: selected ? colors.terracotta : colors.white, color: selected ? colors.white : colors.black, fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s' }}>
                      {c.heure_debut}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
          <button style={btnSecondary} onClick={() => setStep(2)}>← Retour</button>
          <button style={{ ...btnPrimary, opacity: selectedDate && selectedCreneau ? 1 : 0.5 }}
            disabled={!selectedDate || !selectedCreneau} onClick={() => setStep(4)}>
            Continuer →
          </button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────
  //  ÉTAPE 4 : COORDONNÉES + PAYPAL
  // ─────────────────────────────────────────
  const Step4 = () => (
    <div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px' }}>Vos coordonnées</h2>
      <p style={{ color: colors.gray, marginBottom: '28px' }}>Ces informations seront transmises au salon</p>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {[
          { key: 'firstName', label: 'Prénom', placeholder: 'Aminata' },
          { key: 'lastName',  label: 'Nom',    placeholder: 'Diallo' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{label} *</label>
            <input style={inputStyle(errors[key])} placeholder={placeholder} value={form[key]}
              onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }} />
            {errors[key] && <p style={{ color: colors.error, fontSize: '0.8rem', margin: '4px 0 0' }}>{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {[
          { key: 'email', label: 'Email',     placeholder: 'votre@email.com', type: 'email' },
          { key: 'phone', label: 'Téléphone', placeholder: '06 12 34 56 78',  type: 'tel' },
        ].map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{label} *</label>
            <input type={type} style={inputStyle(errors[key])} placeholder={placeholder} value={form[key]}
              onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }} />
            {errors[key] && <p style={{ color: colors.error, fontSize: '0.8rem', margin: '4px 0 0' }}>{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Note pour le salon (optionnel)</label>
        <textarea rows={3} style={{ ...inputStyle(false), resize: 'vertical', fontFamily: 'inherit' }}
          placeholder="Allergies, préférences, questions…"
          value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
      </div>

      {/* RGPD */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '24px' }}>
        <input type="checkbox" id="rgpd" checked={rgpd} onChange={e => setRgpd(e.target.checked)}
          style={{ marginTop: '3px', accentColor: colors.terracotta, width: '16px', height: '16px', flexShrink: 0 }} />
        <label htmlFor="rgpd" style={{ fontSize: '0.83rem', color: colors.gray, lineHeight: '1.5' }}>
          J'accepte les <span style={{ color: colors.terracotta, fontWeight: '700' }}>conditions d'utilisation</span> et la <span style={{ color: colors.terracotta, fontWeight: '700' }}>politique de confidentialité</span>
        </label>
      </div>

      {!formValidated ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button style={btnSecondary} onClick={() => setStep(3)}>← Retour</button>
          <button style={btnPrimary} onClick={handleValidateForm}>
            Procéder au paiement →
          </button>
        </div>
      ) : (
        <div>
          <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #9AE6B4', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', color: '#276749', fontSize: '0.9rem', fontWeight: '600' }}>
            ✅ Formulaire validé — Finalisez votre réservation en payant l'acompte de{' '}
            <strong>{Math.round(selectedService.prix * selectedService.acompte_pct / 100)}€</strong>
          </div>

          {paypalError && (
            <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: colors.error, fontSize: '0.88rem' }}>
              ⚠️ {paypalError}
            </div>
          )}

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: colors.gray }}>
              <div style={{ width: '32px', height: '32px', margin: '0 auto 10px', border: '3px solid #F0E8E3', borderTop: `3px solid ${colors.terracotta}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Confirmation en cours…
            </div>
          ) : (
            <div id="paypal-button-container" />
          )}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────
  //  ÉTAPE 5 : CONFIRMATION
  // ─────────────────────────────────────────
  const Step5 = () => (
    <div style={{ textAlign: 'center', padding: isMobile ? '20px 0' : '40px 0' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F0FFF4', border: '3px solid #9AE6B4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem' }}>
        ✅
      </div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', color: colors.black }}>Réservation confirmée !</h2>
      <p style={{ color: colors.gray, marginBottom: '8px' }}>Votre référence de réservation :</p>
      <p style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.terracotta, letterSpacing: '0.1em', marginBottom: '28px' }}>
        {bookingRef}
      </p>

      <div style={{ backgroundColor: colors.porcelain, borderRadius: '16px', padding: '20px 24px', maxWidth: '420px', margin: '0 auto 32px', textAlign: 'left' }}>
        <p style={{ fontSize: '0.75rem', color: colors.gray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '12px' }}>Détails</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: colors.gray, fontSize: '0.9rem' }}>Salon</span>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{salon.nom_salon}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: colors.gray, fontSize: '0.9rem' }}>Prestation</span>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedService?.nom}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: colors.gray, fontSize: '0.9rem' }}>Date</span>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{formatDate(selectedDate)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: colors.gray, fontSize: '0.9rem' }}>Heure</span>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedCreneau?.heure_debut}</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: colors.gray, marginBottom: '28px', lineHeight: '1.6' }}>
        Un récapitulatif a été envoyé à <strong>{form.email}</strong>.<br />
        Le solde sera réglé directement au salon le jour de votre rendez-vous.
      </p>

      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/mes-rdv" style={{ ...btnPrimary, textDecoration: 'none', display: 'inline-block' }}>
          Voir mes rendez-vous
        </Link>
        <Link to="/" style={{ ...btnSecondary, textDecoration: 'none', display: 'inline-block' }}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  //  RENDU PRINCIPAL
  // ─────────────────────────────────────────
  return (
    <div style={{ paddingTop: '100px', backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 20px 60px' }}>

        {/* Breadcrumb */}
        {step < 5 && (
          <div style={{ fontSize: '0.88rem', color: colors.gray, marginBottom: '24px' }}>
            <Link to="/" style={{ color: colors.gray, textDecoration: 'none' }}>Accueil</Link>
            {' › '}
            <Link to={`/salon/${salonId}`} style={{ color: colors.gray, textDecoration: 'none' }}>{salon.nom_salon}</Link>
            {' › '}
            <span style={{ color: colors.black, fontWeight: '600' }}>Réservation</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile || step === 5 ? '1fr' : '1fr 380px', gap: '32px', alignItems: 'start' }}>

          {/* FORMULAIRE */}
          <div style={{ backgroundColor: colors.white, borderRadius: '24px', padding: isMobile ? '24px' : '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {step < 5 && <StepBar />}
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
          </div>

          {/* RÉCAPITULATIF */}
          {!isMobile && step < 5 && <Summary />}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

// ============================================================
//  CATALOGUES DE PRESTATIONS PAR CATÉGORIE
// ============================================================
const MOCK_SALON = {
  name: "Salon Nappy Queens",
  address: "12 rue des Lilas, Paris 75011",
};

const SERVICES_CATALOGUE = {
  coiffure: [
    { _id: "c1", name: "Box Braids", duration: 180, price: 120 },
    { _id: "c2", name: "Vanilles / Twists", duration: 120, price: 80 },
    { _id: "c3", name: "Locks & Dreadlocks", duration: 150, price: 100 },
    { _id: "c4", name: "Pose Lace Wig", duration: 90, price: 90 },
    { _id: "c5", name: "Braids Butterfly", duration: 240, price: 150 },
    { _id: "c6", name: "Passes Mèches Américaines", duration: 120, price: 85 },
    { _id: "c7", name: "Knowless / Knotless Braids", duration: 210, price: 130 },
    { _id: "c8", name: "Crochet Braids", duration: 180, price: 110 },
    { _id: "c9", name: "Soin Hydratant Profond", duration: 60, price: 45 },
    { _id: "c10", name: "Coupe & Mise en Forme", duration: 60, price: 50 },
  ],
  cils: [
    { _id: "e1", name: "Extension Cil à Cil (Classique)", duration: 90, price: 60 },
    { _id: "e2", name: "Volume Russe", duration: 120, price: 80 },
    { _id: "e3", name: "Volume Mégavolume", duration: 150, price: 100 },
    { _id: "e4", name: "Rehaussement de Cils", duration: 60, price: 55 },
    { _id: "e5", name: "Restructuration Sourcils", duration: 45, price: 40 },
    { _id: "e6", name: "Teinture Cils + Sourcils", duration: 30, price: 30 },
    { _id: "e7", name: "Retouche Extension (3 sem)", duration: 60, price: 45 },
  ],
  manucure: [
    { _id: "m1", name: "Vernis Semi-Permanent", duration: 60, price: 35 },
    { _id: "m2", name: "Pose Gel / Capsules", duration: 90, price: 55 },
    { _id: "m3", name: "French Manucure", duration: 75, price: 45 },
    { _id: "m4", name: "Unicolore Simple", duration: 45, price: 25 },
    { _id: "m5", name: "Nail Art & Design", duration: 120, price: 70 },
    { _id: "m6", name: "Soin Complet des Mains", duration: 60, price: 40 },
    { _id: "m7", name: "Dépose + Repose", duration: 90, price: 50 },
    { _id: "m8", name: "Baby Boomer / Ombré", duration: 90, price: 60 },
  ],
  maquillage: [
    { _id: "mq1", name: "Maquillage Jour / Naturel", duration: 45, price: 50 },
    { _id: "mq2", name: "Maquillage Soirée / Glam", duration: 60, price: 75 },
    { _id: "mq3", name: "Maquillage Mariée", duration: 120, price: 150 },
    { _id: "mq4", name: "Maquillage Éditorial / Shooting", duration: 90, price: 100 },
    { _id: "mq5", name: "Cours Auto-Maquillage", duration: 90, price: 90 },
    { _id: "mq6", name: "Maquillage Événementiel", duration: 60, price: 80 },
  ],
};

// Fallback si catégorie inconnue
const MOCK_SERVICES = SERVICES_CATALOGUE.coiffure;

const MOCK_EMPLOYEES = [
  { _id: "e1", name: "Aminata D.", specialty: "Tresses & Locks" },
  { _id: "e2", name: "Fatoumata K.", specialty: "Soins naturels" },
  { _id: "e3", name: "Marlène B.", specialty: "Vanilles & Twists" },
];

// Créneaux horaires disponibles
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

// ============================================================

function BookingForm() {
  const { salonId = 'mock-salon-id' } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'coiffure';
  const navigate = useNavigate();

  // Récupère le nom et l'adresse du salon depuis l'URL
  const salonName = searchParams.get('name') ? decodeURIComponent(searchParams.get('name')) : 'Salon NappyBooking';
  const salonAddress = searchParams.get('address') ? decodeURIComponent(searchParams.get('address')) : '';

  // Sélectionne les prestations selon la catégorie de l'URL
  const categoryServices = SERVICES_CATALOGUE[category] || MOCK_SERVICES;

  const categoryLabels = {
    coiffure: 'Coiffure Afro',
    cils: 'Extensions de Cils',
    manucure: 'Manucure & Ongles',
    maquillage: 'Maquillage',
  };

  // --- PALETTE (identique à ton Home.jsx) ---
  const colors = {
    terracotta: '#B37256',
    porcelain: '#FAF9F6',
    black: '#1A1A1A',
    white: '#FFFFFF',
    lightGray: '#F0EFED',
    border: '#E5E5E5',
    textGray: '#666666',
  };

  // --- ÉTATS ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState(1); // 1 = Prestation, 2 = Employée, 3 = Date & heure, 4 = Coordonnées, 5 = Confirmation

  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', note: '' });
  const [errors, setErrors] = useState({});
  const [_isLoading, setIsLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const [rgpdChecked, setRgpdChecked] = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  // Chargement du SDK PayPal
  useEffect(() => {
    if (window.paypal) { setPaypalLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AWMm3V6UKG49H7oFeBgyP9fqX60nKb5Gw4CHLYNkl819dGHdU0xXTomny-yiyA19OKrlnyJkU_fUjVQ2&currency=EUR&intent=capture';
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => setPaypalError('Impossible de charger PayPal. Vérifiez votre connexion.');
    document.body.appendChild(script);
  }, []);

  // Rendu des boutons PayPal quand le formulaire est validé
  useEffect(() => {
    if (!paypalLoaded || !formValidated || !selectedService) return;
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    container.innerHTML = '';

    const depositAmount = parseFloat((selectedService.price * 0.3).toFixed(2));

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },

      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            description: `Acompte RDV - ${selectedService.name} chez ${salonName}`,
            amount: { value: depositAmount.toFixed(2), currency_code: 'EUR' },
          }],
        });
      },

      onApprove: async (data, actions) => {
        setIsLoading(true);
        try {
          const details = await actions.order.capture();
          const paypalOrderId = details.id;

          const response = await fetch('https://nappybooking.onrender.com/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              salonId,
              serviceId: selectedService._id,
              employeeId: selectedEmployee._id,
              date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate),
              time: selectedTime,
              client: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
              note: form.note,
              depositAmount,
              paypalOrderId,
            }),
          });

          const bookingData = await response.json();
          if (!response.ok) throw new Error(bookingData.message || 'Erreur serveur');
          setBookingRef(bookingData.bookingReference || bookingData._id);
          setStep(5);
        } catch (err) {
          alert(err.message || 'Une erreur est survenue après le paiement. Contactez le support.');
        } finally {
          setIsLoading(false);
        }
      },

      onError: () => {
        setPaypalError('Le paiement a échoué. Veuillez réessayer.');
      },

      onCancel: () => {
        setPaypalError('Paiement annulé. Vous pouvez réessayer.');
      },
    }).render('#paypal-button-container');
  }, [paypalLoaded, formValidated, selectedService]); // eslint-disable-line react-hooks/exhaustive-deps

  // Simule les créneaux déjà pris (à remplacer par un appel API)
  const [bookedSlots] = useState(["10:00", "14:00", "16:30"]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============================================================
  //  LOGIQUE CALENDRIER
  // ============================================================
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Lundi = 0
    return { daysInMonth, firstDayOffset: adjustedFirstDay };
  };

  const isDateDisabled = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0; // Désactive passé + dimanche
  };

  const formatDate = (day) => {
    if (!day) return '';
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  // ============================================================
  //  VALIDATION FORMULAIRE
  // ============================================================
  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!form.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Email invalide';
    if (!form.phone.trim() || !/^[\d\s+()-]{10,}$/.test(form.phone))
      newErrors.phone = 'Téléphone invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  //  VALIDATION — Affiche les boutons PayPal si tout est OK
  // ============================================================
  const handleValidateForm = () => {
    if (!validateForm()) return;
    if (!rgpdChecked) {
      alert("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    setFormValidated(true);
  };

  // ============================================================
  //  STYLES RÉUTILISABLES
  // ============================================================
  const btnPrimary = {
    backgroundColor: colors.terracotta,
    color: colors.white,
    border: 'none',
    borderRadius: '10px',
    padding: '14px 30px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const btnSecondary = {
    backgroundColor: 'transparent',
    color: colors.terracotta,
    border: `2px solid ${colors.terracotta}`,
    borderRadius: '10px',
    padding: '12px 28px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#E53E3E' : colors.border}`,
    fontSize: '1rem',
    color: colors.black,
    backgroundColor: colors.white,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  });

  const cardStyle = (isSelected) => ({
    border: `2px solid ${isSelected ? colors.terracotta : colors.border}`,
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#FDF5F1' : colors.white,
    transition: 'all 0.25s ease',
    boxShadow: isSelected ? '0 4px 15px rgba(179, 114, 86, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
  });

  // ============================================================
  //  BARRE DE PROGRESSION
  // ============================================================
  const steps = ['Prestation', 'Employée', 'Date & Heure', 'Coordonnées'];

  const StepBar = () => (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '10px' }}>
        {/* Ligne de fond */}
        <div style={{
          position: 'absolute', top: '18px', left: '10%', right: '10%',
          height: '3px', backgroundColor: colors.border, zIndex: 0,
        }} />
        {/* Ligne de progression */}
        <div style={{
          position: 'absolute', top: '18px', left: '10%',
          width: `${((step - 1) / (steps.length - 1)) * 80}%`,
          height: '3px', backgroundColor: colors.terracotta, zIndex: 1,
          transition: 'width 0.4s ease',
        }} />

        {steps.map((label, i) => {
          const isCompleted = step > i + 1;
          const isActive = step === i + 1;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: isCompleted ? colors.terracotta : isActive ? colors.white : colors.lightGray,
                border: `3px solid ${isCompleted || isActive ? colors.terracotta : colors.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '0.85rem',
                color: isCompleted ? colors.white : isActive ? colors.terracotta : '#aaa',
                transition: 'all 0.3s ease',
              }}>
                {isCompleted ? '✓' : i + 1}
              </div>
              {!isMobile && (
                <span style={{
                  fontSize: '0.8rem', marginTop: '8px', fontWeight: isActive ? '700' : '500',
                  color: isActive ? colors.terracotta : isCompleted ? colors.black : '#aaa',
                }}>
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ============================================================
  //  RÉCAPITULATIF LATÉRAL
  // ============================================================
  const Summary = () => (
    <div style={{
      backgroundColor: colors.white, borderRadius: '20px', padding: '28px',
      border: `1px solid ${colors.border}`, position: 'sticky', top: '120px',
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: colors.black }}>
        Récapitulatif
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <p style={{ fontSize: '0.8rem', color: colors.textGray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Salon</p>
        <p style={{ fontSize: '0.95rem', fontWeight: '600', color: colors.black }}>{salonName}</p>
        <p style={{ fontSize: '0.85rem', color: colors.textGray }}>{salonAddress}</p>
      </div>

      {selectedService && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginBottom: '15px' }}>
          <p style={{ fontSize: '0.8rem', color: colors.textGray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Prestation</p>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: colors.black }}>{selectedService.name}</p>
          <p style={{ fontSize: '0.85rem', color: colors.textGray }}>{selectedService.duration} min · {selectedService.price}€</p>
        </div>
      )}

      {selectedEmployee && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginBottom: '15px' }}>
          <p style={{ fontSize: '0.8rem', color: colors.textGray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Employée</p>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: colors.black }}>{selectedEmployee.name}</p>
        </div>
      )}

      {selectedDate && selectedTime && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginBottom: '15px' }}>
          <p style={{ fontSize: '0.8rem', color: colors.textGray, textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Date & Heure</p>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: colors.black }}>{formatDate(selectedDate)}</p>
          <p style={{ fontSize: '0.85rem', color: colors.textGray }}>{selectedTime}</p>
        </div>
      )}

      {selectedService && (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '15px', backgroundColor: '#FDF5F1', borderRadius: '12px', padding: '15px', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: colors.textGray }}>Total prestation</span>
            <span style={{ fontWeight: '600' }}>{selectedService.price}€</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: colors.terracotta, fontWeight: '700' }}>Acompte (30%)</span>
            <span style={{ fontWeight: '800', color: colors.terracotta }}>{Math.round(selectedService.price * 0.3)}€</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: colors.textGray, marginTop: '8px', lineHeight: '1.4' }}>
            L'acompte est débité maintenant. Le solde ({selectedService.price - Math.round(selectedService.price * 0.3)}€) sera réglé au salon.
          </p>
        </div>
      )}
    </div>
  );

  // ============================================================
  //  ÉTAPE 1 : CHOIX DE LA PRESTATION
  // ============================================================
  const Step1 = () => (
    <div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: colors.black }}>
        Quelle prestation souhaitez-vous ?
      </h2>
      <p style={{ color: colors.textGray, marginBottom: '30px' }}>Sélectionnez une prestation pour continuer</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {categoryServices.map(service => (
          <div
            key={service._id}
            onClick={() => setSelectedService(service)}
            style={cardStyle(selectedService?._id === service._id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '4px', color: colors.black }}>
                  {service.name}
                </p>
                <p style={{ fontSize: '0.9rem', color: colors.textGray }}>{service.duration} min</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '800', fontSize: '1.2rem', color: colors.terracotta }}>{service.price}€</p>
                <p style={{ fontSize: '0.8rem', color: colors.textGray }}>Acompte : {Math.round(service.price * 0.3)}€</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
        <button
          style={{ ...btnPrimary, opacity: selectedService ? 1 : 0.5 }}
          disabled={!selectedService}
          onClick={() => setStep(2)}
        >
          Continuer →
        </button>
      </div>
    </div>
  );

  // ============================================================
  //  ÉTAPE 2 : CHOIX DE L'EMPLOYÉE
  // ============================================================
  const Step2 = () => (
    <div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: colors.black }}>
        Choisissez votre employée
      </h2>
      <p style={{ color: colors.textGray, marginBottom: '30px' }}>Sélectionnez une professionnelle</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {MOCK_EMPLOYEES.map(emp => (
          <div
            key={emp._id}
            onClick={() => setSelectedEmployee(emp)}
            style={cardStyle(selectedEmployee?._id === emp._id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Avatar généré */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: colors.terracotta,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: colors.white, fontWeight: '800', fontSize: '1.2rem',
              }}>
                {emp.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '3px', color: colors.black }}>{emp.name}</p>
                <p style={{ fontSize: '0.88rem', color: colors.textGray }}>{emp.specialty}</p>
              </div>
              {selectedEmployee?._id === emp._id && (
                <div style={{ marginLeft: 'auto', color: colors.terracotta, fontSize: '1.4rem' }}>✓</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button style={btnSecondary} onClick={() => setStep(1)}>← Retour</button>
        <button
          style={{ ...btnPrimary, opacity: selectedEmployee ? 1 : 0.5 }}
          disabled={!selectedEmployee}
          onClick={() => setStep(3)}
        >
          Continuer →
        </button>
      </div>
    </div>
  );

  // ============================================================
  //  ÉTAPE 3 : CALENDRIER + CRÉNEAUX HORAIRES
  // ============================================================
  const Step3 = () => {
    const { daysInMonth, firstDayOffset } = getDaysInMonth(currentMonth);

    const prevMonth = () => {
      const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      if (prev >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
        setCurrentMonth(prev);
        setSelectedDate(null);
        setSelectedTime(null);
      }
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
      setSelectedDate(null);
      setSelectedTime(null);
    };

    return (
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: colors.black }}>
          Choisissez une date et un créneau
        </h2>
        <p style={{ color: colors.textGray, marginBottom: '30px' }}>Les dimanches ne sont pas disponibles</p>

        {/* CALENDRIER */}
        <div style={{ backgroundColor: colors.white, borderRadius: '20px', padding: '24px', border: `1px solid ${colors.border}`, marginBottom: '24px' }}>
          {/* Navigation mois */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: colors.black }}>‹</button>
            <span style={{ fontWeight: '700', fontSize: '1.05rem', color: colors.black }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: colors.black }}>›</button>
          </div>

          {/* Jours de la semaine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {dayNames.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: '700', color: colors.textGray, padding: '4px' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const disabled = isDateDisabled(day);
              const isSelected = selectedDate === day;
              return (
                <button
                  key={day}
                  disabled={disabled}
                  onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: '50%', border: 'none',
                    backgroundColor: isSelected ? colors.terracotta : 'transparent',
                    color: isSelected ? colors.white : disabled ? '#ccc' : colors.black,
                    fontWeight: isSelected ? '700' : '500',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* CRÉNEAUX */}
        {selectedDate && (
          <div>
            <p style={{ fontWeight: '700', marginBottom: '14px', color: colors.black }}>
              Créneaux disponibles — {formatDate(selectedDate)}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {TIME_SLOTS.map(time => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '12px 6px',
                      borderRadius: '10px',
                      border: `2px solid ${isSelected ? colors.terracotta : isBooked ? colors.border : colors.border}`,
                      backgroundColor: isSelected ? colors.terracotta : isBooked ? colors.lightGray : colors.white,
                      color: isSelected ? colors.white : isBooked ? '#bbb' : colors.black,
                      fontWeight: '600', fontSize: '0.88rem',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      textDecoration: isBooked ? 'line-through' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button style={btnSecondary} onClick={() => setStep(2)}>← Retour</button>
          <button
            style={{ ...btnPrimary, opacity: (selectedDate && selectedTime) ? 1 : 0.5 }}
            disabled={!selectedDate || !selectedTime}
            onClick={() => setStep(4)}
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  };

  // ============================================================
  //  ÉTAPE 4 : COORDONNÉES CLIENT + PAIEMENT
  // ============================================================
  const Step4 = () => (
    <div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: colors.black }}>
        Vos coordonnées
      </h2>
      <p style={{ color: colors.textGray, marginBottom: '30px' }}>
        Renseignez vos informations pour finaliser la réservation
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black, display: 'block', marginBottom: '8px' }}>
            Prénom *
          </label>
          <input
            type="text"
            placeholder="Aminata"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            style={inputStyle(errors.firstName)}
          />
          {errors.firstName && <p style={{ color: '#E53E3E', fontSize: '0.8rem', marginTop: '4px' }}>{errors.firstName}</p>}
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black, display: 'block', marginBottom: '8px' }}>
            Nom *
          </label>
          <input
            type="text"
            placeholder="Diallo"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            style={inputStyle(errors.lastName)}
          />
          {errors.lastName && <p style={{ color: '#E53E3E', fontSize: '0.8rem', marginTop: '4px' }}>{errors.lastName}</p>}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black, display: 'block', marginBottom: '8px' }}>
          Email *
        </label>
        <input
          type="email"
          placeholder="aminata@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={inputStyle(errors.email)}
        />
        {errors.email && <p style={{ color: '#E53E3E', fontSize: '0.8rem', marginTop: '4px' }}>{errors.email}</p>}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black, display: 'block', marginBottom: '8px' }}>
          Téléphone *
        </label>
        <input
          type="tel"
          placeholder="06 12 34 56 78"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          style={inputStyle(errors.phone)}
        />
        {errors.phone && <p style={{ color: '#E53E3E', fontSize: '0.8rem', marginTop: '4px' }}>{errors.phone}</p>}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black, display: 'block', marginBottom: '8px' }}>
          Message au salon (optionnel)
        </label>
        <textarea
          placeholder="Ex: J'ai les cheveux longs, j'aimerais des tresses avec des couleurs..."
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
          rows={3}
          style={{ ...inputStyle(false), resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {/* BLOC RÉCAP PAIEMENT */}
      <div style={{
        backgroundColor: '#FDF5F1', borderRadius: '16px', padding: '20px',
        border: `1px solid ${colors.terracotta}30`, marginBottom: '20px',
      }}>
        <h4 style={{ fontWeight: '800', marginBottom: '12px', color: colors.black, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.terracotta} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Paiement sécurisé de l'acompte
        </h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: colors.textGray }}>Prestation — {selectedService?.name}</span>
          <span style={{ fontWeight: '600' }}>{selectedService?.price}€</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `1px solid ${colors.border}` }}>
          <span style={{ fontWeight: '800', color: colors.terracotta }}>Acompte à payer (30%)</span>
          <span style={{ fontWeight: '800', color: colors.terracotta, fontSize: '1.2rem' }}>
            {selectedService && Math.round(selectedService.price * 0.3)}€
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: colors.textGray, marginTop: '8px' }}>
          Le solde ({selectedService && selectedService.price - Math.round(selectedService.price * 0.3)}€) sera réglé directement au salon.
        </p>
      </div>

      {/* Consentement RGPD */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
        <input
          type="checkbox"
          id="rgpd"
          checked={rgpdChecked}
          onChange={e => setRgpdChecked(e.target.checked)}
          style={{ marginTop: '3px', accentColor: colors.terracotta, width: '16px', height: '16px', flexShrink: 0 }}
        />
        <label htmlFor="rgpd" style={{ fontSize: '0.85rem', color: colors.textGray, lineHeight: '1.5' }}>
          J'accepte les <span style={{ color: colors.terracotta, fontWeight: '700', cursor: 'pointer' }}>conditions d'utilisation</span> et la <span style={{ color: colors.terracotta, fontWeight: '700', cursor: 'pointer' }}>politique de confidentialité</span> de NappyBooking (RGPD).
        </label>
      </div>

      {/* BOUTONS PAYPAL ou BOUTON VALIDER */}
      {!formValidated ? (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button style={btnSecondary} onClick={() => setStep(3)}>Retour</button>
          <button
            style={{ ...btnPrimary }}
            onClick={handleValidateForm}
          >
            Valider et payer
          </button>
        </div>
      ) : (
        <div>
          <button style={{ ...btnSecondary, marginBottom: '16px', fontSize: '0.85rem' }} onClick={() => setFormValidated(false)}>
            Modifier mes informations
          </button>

          {/* Erreur PayPal */}
          {paypalError && (
            <div style={{ backgroundColor: '#FFF0F0', border: '1px solid #FFB3B3', borderRadius: '10px', padding: '12px', marginBottom: '12px', color: '#C0392B', fontSize: '0.85rem', fontWeight: '600' }}>
              {paypalError}
            </div>
          )}

          {/* Loader pendant chargement SDK */}
          {!paypalLoaded && !paypalError && (
            <div style={{ textAlign: 'center', padding: '20px', color: colors.textGray }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.terracotta} strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Chargement de PayPal...</p>
            </div>
          )}

          {/* Conteneur boutons PayPal */}
          {paypalLoaded && <div id="paypal-button-container" style={{ minHeight: '50px' }}></div>}

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: colors.textGray, marginTop: '12px' }}>
            Paiement 100% sécurisé via PayPal. NappyBooking ne stocke aucune donnée bancaire.
          </p>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ============================================================
  //  ÉTAPE 5 : CONFIRMATION
  // ============================================================
  const Step5 = () => (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {/* Icône succès */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        backgroundColor: '#E8F5E9', margin: '0 auto 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.5rem',
      }}>
        ✅
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: colors.black }}>
        Réservation confirmée !
      </h2>
      <p style={{ color: colors.textGray, fontSize: '1rem', marginBottom: '30px' }}>
        Un email de confirmation vous a été envoyé à <strong>{form.email}</strong>
      </p>

      {/* Récap final */}
      <div style={{
        backgroundColor: colors.porcelain, borderRadius: '20px', padding: '24px',
        border: `1px solid ${colors.border}`, textAlign: 'left', maxWidth: '450px', margin: '0 auto 30px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.textGray, fontSize: '0.9rem' }}>Référence</span>
          <span style={{ fontWeight: '800', color: colors.terracotta }}>{bookingRef}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.textGray, fontSize: '0.9rem' }}>Salon</span>
          <span style={{ fontWeight: '600' }}>{salonName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.textGray, fontSize: '0.9rem' }}>Prestation</span>
          <span style={{ fontWeight: '600' }}>{selectedService?.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.textGray, fontSize: '0.9rem' }}>Employée</span>
          <span style={{ fontWeight: '600' }}>{selectedEmployee?.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.textGray, fontSize: '0.9rem' }}>Date</span>
          <span style={{ fontWeight: '600' }}>{formatDate(selectedDate)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${colors.border}`, paddingTop: '12px', marginTop: '8px' }}>
          <span style={{ color: colors.textGray, fontSize: '0.9rem' }}>Acompte payé</span>
          <span style={{ fontWeight: '800', color: colors.terracotta }}>
            {selectedService && Math.round(selectedService.price * 0.3)}€
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '14px', justifyContent: 'center' }}>
        <button style={btnPrimary} onClick={() => navigate('/dashboard-client')}>
          Voir mes rendez-vous
        </button>
        <button style={btnSecondary} onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );

  // ============================================================
  //  RENDU PRINCIPAL
  // ============================================================
  return (
    <div style={{ backgroundColor: colors.porcelain, minHeight: '100vh', paddingTop: '110px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        {/* TITRE PAGE */}
        {step < 5 && (
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: '800', color: colors.black, marginBottom: '4px' }}>
              {salonName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ color: colors.textGray, fontSize: '0.95rem' }}>📍 {salonAddress}</p>
              <span style={{ backgroundColor: '#FDF5F1', color: '#B37256', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid #B3725630' }}>
                {categoryLabels[category] || category}
              </span>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: (step < 5 && !isMobile) ? '1fr 360px' : '1fr',
          gap: '30px',
          alignItems: 'start',
        }}>
          {/* COLONNE PRINCIPALE */}
          <div style={{ backgroundColor: colors.white, borderRadius: '20px', padding: isMobile ? '24px' : '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            {step < 5 && <StepBar />}
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
          </div>

          {/* RÉCAPITULATIF LATÉRAL (desktop uniquement, hors confirmation) */}
          {!isMobile && step < 5 && <Summary />}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ÉTATS POUR LE TUNNEL DE RÉSERVATION
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const services = [
    { id: 1, name: "Braids Butterfly", price: 80, duration: "3h" },
    { id: 2, name: "Pose Lace Wig", price: 120, duration: "2h30" },
    { id: 3, name: "Soins Profonds", price: 45, duration: "1h" },
  ];

  const handleValidation = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Veuillez remplir toutes les étapes !");
      return;
    }
    
    // Ici, on simule l'enregistrement du RDV
    console.log("RDV validé pour le salon", id);
    navigate('/dashboard-client', { state: { message: "RDV confirmé !" } });
  };

  return (
    <div style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Réserver chez MistralCare (Salon #{id})</h2>

      {/* ÉTAPE 1 : CHOIX DU SERVICE */}
      <section style={{ marginBottom: '30px' }}>
        <h3>1. Choisissez votre prestation</h3>
        {services.map(s => (
          <div 
            key={s.id} 
            onClick={() => setSelectedService(s)}
            style={{
              padding: '15px', border: selectedService?.id === s.id ? '2px solid #B37256' : '1px solid #ddd',
              borderRadius: '10px', marginBottom: '10px', cursor: 'pointer'
            }}
          >
            <strong>{s.name}</strong> - {s.price}€ ({s.duration})
          </div>
        ))}
      </section>

      {/* ÉTAPE 2 : CALENDRIER (S'affiche seulement si un service est choisi) */}
      {selectedService && (
        <section style={{ marginBottom: '30px' }}>
          <h3>2. Date et Heure</h3>
          <input 
            type="date" 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', marginRight: '10px' }}
          />
          <select onChange={(e) => setSelectedTime(e.target.value)} style={{ padding: '10px' }}>
            <option value="">Choisir l'heure</option>
            <option value="10:00">10:00</option>
            <option value="14:00">14:00</option>
            <option value="16:00">16:00</option>
          </select>
        </section>
      )}

      {/* ÉTAPE 3 : BOUTON DE VALIDATION FINAL */}
      <button 
        onClick={handleValidation}
        style={{
          width: '100%', padding: '20px', backgroundColor: '#B37256',
          color: 'white', border: 'none', borderRadius: '12px',
          fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
          opacity: (selectedService && selectedDate && selectedTime) ? 1 : 0.5
        }}
      >
        Confirmer la réservation
      </button>
    </div>
  );
};

export default SalonDetails;
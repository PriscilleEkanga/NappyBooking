import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageServices = () => {
  const navigate = useNavigate();
  
  // Simulation des services existants
  const [services, setServices] = useState([
    { id: 1, name: "Knotless Braids (Moyennes)", price: "120", duration: "4h" },
    { id: 2, name: "Pose Lace Wig + Custom", price: "80", duration: "2h" }
  ]);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const addService = (e) => {
    e.preventDefault();
    if(newName && newPrice) {
      const newService = {
        id: Date.now(),
        name: newName,
        price: newPrice,
        duration: "À définir"
      };
      setServices([...services, newService]);
      setNewName('');
      setNewPrice('');
    }
  };

  const deleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  const colors = {
    terracotta: '#B37256',
    black: '#1A1A1A',
    white: '#FFFFFF',
    porcelain: '#FAF9F6',
    gray: '#717171'
  };

  return (
    <div style={{ padding: '100px 20px', backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard-pro')} style={{ marginBottom: '20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Retour au Dashboard
        </button>

        <h1 style={{ marginBottom: '30px' }}>Gérer mes prestations ✂️</h1>

        {/* FORMULAIRE D'AJOUT */}
        <div style={{ backgroundColor: colors.white, padding: '25px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px' }}>Ajouter un nouveau service</h3>
          <form onSubmit={addService} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" placeholder="Nom du service (ex: Box Braids)" 
              value={newName} onChange={(e) => setNewName(e.target.value)}
              style={{ flex: 2, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
            />
            <input 
              type="number" placeholder="Prix (€)" 
              value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
            />
            <button type="submit" style={{ backgroundColor: colors.terracotta, color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              Ajouter
            </button>
          </form>
        </div>

        {/* LISTE DES SERVICES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {services.map(service => (
            <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, padding: '20px', borderRadius: '15px', border: '1px solid #eee' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{service.name}</div>
                <div style={{ color: colors.gray, fontSize: '0.9rem' }}>Durée estimée : {service.duration}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontWeight: '800', color: colors.terracotta, fontSize: '1.2rem' }}>{service.price}€</span>
                <button 
                  onClick={() => deleteService(service.id)}
                  style={{ backgroundColor: '#FFE5E5', color: '#D9534F', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ManageServices;
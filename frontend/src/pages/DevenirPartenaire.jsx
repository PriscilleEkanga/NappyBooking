import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DevenirPartenaire = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [avgPrice, setAvgPrice] = useState(60);
  const [bookings, setBookings] = useState(15);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = {
    terracotta: '#B37256',
    black: '#1A1A1A',
    porcelain: '#FAF9F6',
    white: '#FFFFFF',
    gray: '#666',
    lightGray: '#f4f4f4'
  };

  const monthlyRevenue = avgPrice * bookings;
  const freeCommission = monthlyRevenue * 0.10;

  const plans = [
    {
      name: "STANDARD",
      subtitle: "Pour les coiffeuses indépendantes",
      price: "0",
      commission: "10% de commission",
      button: "S'inscrire Gratuitement",
      features: ["Demandes de réservation illimitées", "Profil professionnel", "Vitrine de portfolio photos", "Messagerie client directe", "Gestion du calendrier", "Notes et avis des clients", "Expérience optimisée mobile"]
    },
    {
      name: "PRO",
      subtitle: "Pour les coiffeuses établies",
      price: isYearly ? "17" : "20",
      commission: "0% de commission",
      button: "S'inscrire",
      highlight: true,
      tag: "Le Plus Populaire",
      features: ["Tout dans STANDARD", "0% de commission - gardez 100%", "Tableau de bord analytique", "Suivi des vues de profil", "Métriques d'engagement", "Rappels SMS/Email", "Support email prioritaire"]
    },
    {
      name: "PREMIUM",
      subtitle: "Pour les professionnelles",
      price: isYearly ? "25" : "30",
      commission: "0% de commission",
      button: "S'inscrire",
      tag: "Meilleure Valeur",
      features: ["Tout dans PRO", "Paiement en ligne + Cash", "Suite CRM complète (à venir)", "Page de réservation personnalisée", "Outils marketing automatisés", "Gestionnaire de compte dédié"]
    }
  ];

  return (
    <div style={{ backgroundColor: colors.white, paddingTop: '100px' }}>
      
      {/* --- SECTION CLIENTS --- */}
      <section style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: colors.porcelain }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '800', marginBottom: '10px' }}>Choisissez Votre Plan</h1>
        <p style={{ color: colors.gray, marginBottom: '40px' }}>Tarification simple et transparente pour les clients et les coiffeuses.</p>
        
        <div style={{ backgroundColor: colors.white, padding: '40px', borderRadius: '25px', maxWidth: '900px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: colors.terracotta, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Pour les clients</h4>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Connectez-vous gratuitement avec des coiffeuses expertes</h2>
          <p style={{ color: colors.gray, lineHeight: '1.7', maxWidth: '700px', margin: '0 auto 25px' }}>
            Parcourez les coiffeuses, réservez des rendez-vous et gérez votre parcours capillaire sans frais. Vous ne payez que pour les services que vous réservez.
          </p>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '15px 40px', borderRadius: '12px', border: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '700', cursor: 'pointer' }}
          >
            Inscription gratuite
          </button>
        </div>
      </section>

      {/* --- SECTION ÉTABLISSEMENTS --- */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h4 style={{ color: colors.terracotta, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Pour les établissements</h4>
        <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>Commencez gratuitement et améliorez quand vous êtes prête.</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '50px' }}>
          <span style={{ fontWeight: !isYearly ? '700' : '400' }}>Mensuel</span>
          <div onClick={() => setIsYearly(!isYearly)} style={{ width: '55px', height: '28px', backgroundColor: colors.terracotta, borderRadius: '20px', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '4px', left: isYearly ? '31px' : '4px', transition: '0.3s' }} />
          </div>
          <span style={{ fontWeight: isYearly ? '700' : '400' }}>Annuel <span style={{color: colors.terracotta}}>(Économisez 17%)</span></span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '25px', maxWidth: '1200px', margin: '0 auto' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ 
              flex: '1', minWidth: '300px', maxWidth: '380px', padding: '40px 30px', borderRadius: '25px', 
              border: plan.highlight ? `2px solid ${colors.terracotta}` : '1px solid #eee',
              backgroundColor: colors.white, position: 'relative', textAlign: 'left',
              boxShadow: plan.highlight ? '0 15px 40px rgba(179, 114, 86, 0.1)' : 'none'
            }}>
              {plan.tag && <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: colors.terracotta, color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>{plan.tag}</div>}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.85rem', color: colors.gray, marginBottom: '25px' }}>{plan.subtitle}</p>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '5px' }}>{plan.price}€<small style={{fontSize: '1rem', fontWeight: '400', color: colors.gray}}>/mois</small></div>
              <p style={{ color: colors.terracotta, fontWeight: '700', marginBottom: '25px', fontSize: '0.9rem' }}>{plan.commission}</p>
              <button 
                onClick={() => navigate('/login')}
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: plan.highlight ? colors.terracotta : colors.black, color: 'white', fontWeight: '700', cursor: 'pointer', marginBottom: '30px' }}
              >
                {plan.button}
              </button>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {plan.features.map((f, j) => <li key={j} style={{ marginBottom: '12px', fontSize: '0.9rem', display: 'flex', gap: '10px' }}>
                  <span style={{color: colors.terracotta}}>✓</span> {f}
                </li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* --- CALCULATEUR --- */}
      <section style={{ padding: '80px 20px', backgroundColor: colors.lightGray }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Calculez Vos Économies</h2>
            <p style={{ color: colors.gray, marginBottom: '40px' }}>Voyez combien vous pourriez économiser en passant aux plans Pro ou Premium.</p>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <label style={{fontWeight:'600'}}>Prix Moyen de Réservation</label>
                <span style={{fontWeight:'700', color: colors.terracotta}}>{avgPrice}€</span>
              </div>
              <input type="range" min="20" max="500" value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} style={{ width: '100%', accentColor: colors.terracotta }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <label style={{fontWeight:'600'}}>Réservations par Mois</label>
                <span style={{fontWeight:'700', color: colors.terracotta}}>{bookings}</span>
              </div>
              <input type="range" min="1" max="200" value={bookings} onChange={(e) => setBookings(e.target.value)} style={{ width: '100%', accentColor: colors.terracotta }} />
            </div>
          </div>
          
          <div style={{ flex: 1, backgroundColor: colors.black, color: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <p style={{opacity: 0.7, textTransform:'uppercase', fontSize:'0.8rem', letterSpacing:'1px'}}>Revenu Mensuel Estimé</p>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '10px 0 30px' }}>{monthlyRevenue.toLocaleString()}€<small style={{fontSize:'1rem', opacity:0.6}}>/mois</small></h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '15px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <span>Plan STANDARD (10%)</span>
              <span style={{ color: '#ff4d4d', fontWeight: '700' }}>-{freeCommission.toFixed(2)}€</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderRadius: '12px', backgroundColor: 'rgba(77, 255, 136, 0.1)', color: '#4dff88' }}>
              <span>Plan PRO / PREMIUM</span>
              <span style={{ fontWeight: '700' }}>0€ Commission</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ 
        backgroundColor: colors.black, 
        color: colors.white, 
        padding: isMobile ? '60px 20px 30px' : '80px 60px 40px',
        marginTop: '0' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', 
          gap: '40px' 
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: colors.terracotta }}>
              NappyBooking
            </h2>
            <p style={{ opacity: 0.7, lineHeight: '1.6', fontSize: '0.95rem' }}>
              La première plateforme dédiée à la beauté afro en France. Réservez les meilleures expertes pour vos cheveux naturels, tresses et soins.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', opacity: 0.8, fontSize: '0.9rem' }}>
              <li><Link to="/coiffeuses" style={{ color: 'inherit', textDecoration: 'none' }}>Coiffure</Link></li>
              <li><Link to="/manucure" style={{ color: 'inherit', textDecoration: 'none' }}>Manucure</Link></li>
              <li><Link to="/maquillage" style={{ color: 'inherit', textDecoration: 'none' }}>Maquillage</Link></li>
              <li><Link to="/cils" style={{ color: 'inherit', textDecoration: 'none' }}>Cils & Sourcils</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Business</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', opacity: 0.8, fontSize: '0.9rem' }}>
              <li><Link to="/devenir-partenaire" style={{ color: 'inherit', textDecoration: 'none' }}>Devenir Partenaire</Link></li>
              <li><Link to="/connexion-pro" style={{ color: 'inherit', textDecoration: 'none' }}>Espace Pro</Link></li>
              <li><Link to="/aide" style={{ color: 'inherit', textDecoration: 'none' }}>Centre d'aide</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Suivez-nous</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: colors.white, opacity: 0.8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" style={{ color: colors.white, opacity: 0.8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" style={{ color: colors.white, opacity: 0.8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>
        </div>

        <div style={{ 
          maxWidth: '1200px', 
          margin: '60px auto 0 auto', 
          paddingTop: '30px', 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          textAlign: 'center', 
          fontSize: '0.85rem', 
          opacity: 0.5 
        }}>
          Copyright © 2026 NappyBooking. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default DevenirPartenaire;
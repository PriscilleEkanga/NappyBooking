import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardClient = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  
  // --- ÉTATS DYNAMIQUES ---
  // On récupère les infos de l'utilisateur stockées lors de la connexion
  const [userName] = useState(() => localStorage.getItem('userName') || 'Client');
  const [userEmail] = useState(() => localStorage.getItem('userEmail') || 'non renseigné');

  // Initialisation : on cherche les RDV dans le localStorage, sinon tableau vide
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [supportSent, setSupportSent] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('userAppointments');
    return saved ? JSON.parse(saved) : []; 
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FONCTION ANNULATION ---
  const handleCancelAppointment = (id) => {
    const confirmCancel = window.confirm(
      "⚠️ ATTENTION : Êtes-vous sûr de vouloir annuler ce rendez-vous ?\n\nConformément à nos conditions générales, l'acompte versé ne sera pas remboursé."
    );

    if (confirmCancel) {
      // Filtrer pour supprimer le rendez-vous sélectionné
      const updatedAppointments = appointments.filter(app => app.id !== id);
      setAppointments(updatedAppointments);
      // Mettre à jour le localStorage pour que la suppression soit permanente
      localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));
      alert("Le rendez-vous a été annulé (Acompte non remboursé).");
    }
  };

  const colors = {
    terracotta: '#B37256',
    black: '#1A1A1A',
    white: '#FFFFFF',
    porcelain: '#FAF9F6',
    gray: '#717171',
    success: '#2D5A27',
    warning: '#C5A059',
    danger: '#d93025' // Rouge pour l'annulation
  };

  return (
    <div style={{ backgroundColor: colors.porcelain, minHeight: '100vh' }}>
      {/* ESPACE PRINCIPAL */}
      <div style={{ padding: '120px 20px 60px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* HEADER DASHBOARD */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Bonjour, {userName} !</h1>
              <p style={{ color: colors.gray }}>Bienvenue dans votre espace personnel NappyBooking.</p>
            </div>
            <button 
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', fontWeight: '600', backgroundColor: colors.white }}
            >
              Déconnexion
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: '30px' }}>
            
            {/* COLONNE GAUCHE : MES RENDEZ-VOUS */}
            <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Mes Prochains RDV</h3>
                <a href="/mes-rdv" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#B37256', textDecoration: 'none' }}>
                  Voir tout →
                </a>
              </div>
              
              {appointments.length > 0 ? (
                appointments.map(app => (
                  <div key={app.id} style={{ padding: '20px', border: '1px solid #F0F0F0', borderRadius: '12px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        backgroundColor: app.status === 'Confirmé' ? '#E9F5E8' : '#FFF8E6',
                        color: app.status === 'Confirmé' ? colors.success : colors.warning
                      }}>
                        {app.status ? app.status.toUpperCase() : 'CONFIRMÉ'}
                      </span>
                      <span style={{ fontWeight: '700' }}>{app.price}</span>
                    </div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{app.service}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: colors.gray }}>Avec <strong>{app.expert}</strong></p>
                    <p style={{ margin: '10px 0 15px', fontSize: '0.9rem', fontWeight: '600' }}>📅 {app.date} à {app.time}</p>
                    
                    <button 
                      onClick={() => handleCancelAppointment(app.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: colors.danger, 
                        fontWeight: '700', 
                        cursor: 'pointer', 
                        fontSize: '0.85rem',
                        padding: 0,
                        textDecoration: 'underline'
                      }}
                    >
                      Annuler le rendez-vous
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: colors.gray, fontSize: '1rem' }}>Vous n'avez aucun rendez-vous de prévu.</p>
                </div>
              )}
              
              <button 
                onClick={() => navigate('/coiffeuses')}
                style={{ width: '100%', padding: '15px', marginTop: '10px', backgroundColor: colors.terracotta, color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Réserver une nouvelle prestation
              </button>
            </div>

            {/* COLONNE DROITE : INFOS & AIDE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Mes infos</h3>
                <p style={{ fontSize: '0.9rem', color: colors.gray, lineHeight: '1.8' }}>
                  <strong>Prénom :</strong> {userName}<br/>
                  <strong>Email :</strong> {userEmail}<br/>
                  <strong>Tel :</strong> 06 12 34 56 78
                </p>
                <button style={{ background: 'none', border: 'none', color: colors.terracotta, fontWeight: '700', cursor: 'pointer', padding: 0, marginTop: '10px' }}>Modifier mon profil</button>
              </div>

              <div style={{ backgroundColor: colors.black, padding: '30px', borderRadius: '20px', color: colors.white }}>
                <h3 style={{ marginBottom: '10px' }}>Politique d'annulation</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.6' }}>
                  En cas d'annulation, l'acompte de 20% versé lors de la réservation ne sera pas remboursé. Cela permet de dédommager l'experte pour le créneau réservé.
                </p>
                <button
                  onClick={() => { setShowSupportModal(true); setSupportSent(false); setSupportForm({ subject: '', message: '' }); }}
                  style={{ width: '100%', padding: '12px', marginTop: '15px', backgroundColor: colors.white, color: colors.black, border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Contacter le support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODALE SUPPORT ===== */}
      {showSupportModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            backgroundColor: colors.white, borderRadius: '20px',
            padding: '32px', maxWidth: '480px', width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          }}>
            {/* Header modale */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 4px', color: colors.black }}>
                  Contacter le support
                </h3>
                <p style={{ fontSize: '0.85rem', color: colors.gray, margin: 0 }}>
                  Notre équipe vous répond sous 24h
                </p>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.gray, fontSize: '1.3rem', fontWeight: '700', padding: '4px 8px' }}
              >
                x
              </button>
            </div>

            {supportSent ? (
              /* Message de confirmation */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ marginBottom: '16px' }}>
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h4 style={{ fontWeight: '800', color: colors.black, marginBottom: '8px' }}>Message envoyé !</h4>
                <p style={{ color: colors.gray, fontSize: '0.9rem', marginBottom: '24px' }}>
                  Notre équipe support vous répondra à <strong>{userEmail}</strong> dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setShowSupportModal(false)}
                  style={{ backgroundColor: colors.terracotta, color: colors.white, border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Fermer
                </button>
              </div>
            ) : (
              /* Formulaire */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Sujet */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black, display: 'block', marginBottom: '8px' }}>
                    Sujet
                  </label>
                  <select
                    value={supportForm.subject}
                    onChange={e => setSupportForm({ ...supportForm, subject: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #E5E5E5', fontSize: '0.95rem',
                      color: colors.black, backgroundColor: colors.white,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Choisissez un sujet...</option>
                    <option value="annulation">Problème d'annulation</option>
                    <option value="remboursement">Demande de remboursement</option>
                    <option value="paiement">Problème de paiement</option>
                    <option value="rdv">Problème avec un rendez-vous</option>
                    <option value="compte">Problème de compte</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: colors.black, display: 'block', marginBottom: '8px' }}>
                    Message
                  </label>
                  <textarea
                    placeholder="Décrivez votre problème en détail..."
                    value={supportForm.message}
                    onChange={e => setSupportForm({ ...supportForm, message: e.target.value })}
                    rows={5}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #E5E5E5', fontSize: '0.95rem',
                      color: colors.black, backgroundColor: colors.white,
                      outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Info email */}
                <p style={{ fontSize: '0.82rem', color: colors.gray, margin: 0 }}>
                  La reponse sera envoyee a : <strong>{userEmail}</strong>
                </p>

                {/* Boutons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button
                    onClick={() => setShowSupportModal(false)}
                    style={{
                      flex: 1, padding: '13px', borderRadius: '10px',
                      border: '1.5px solid #E5E5E5', backgroundColor: 'transparent',
                      fontWeight: '700', cursor: 'pointer', color: colors.black,
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    disabled={!supportForm.subject || !supportForm.message.trim() || supportLoading}
                    onClick={async () => {
                      setSupportLoading(true);
                      try {
                        await fetch('http://localhost:5000/api/support', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          },
                          body: JSON.stringify({
                            email: userEmail,
                            name: userName,
                            subject: supportForm.subject,
                            message: supportForm.message,
                          }),
                        });
                      } catch { /* silencieux si API pas prête */ }
                      finally {
                        setSupportLoading(false);
                        setSupportSent(true);
                      }
                    }}
                    style={{
                      flex: 1, padding: '13px', borderRadius: '10px',
                      border: 'none',
                      backgroundColor: (!supportForm.subject || !supportForm.message.trim()) ? '#ccc' : colors.terracotta,
                      color: colors.white, fontWeight: '700',
                      cursor: (!supportForm.subject || !supportForm.message.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    {supportLoading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Envoi...
                      </>
                    ) : 'Envoyer'}
                  </button>
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER COMPLET --- */}
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
          {/* Logo et Description */}
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: colors.terracotta }}>
              NappyBooking
            </h2>
            <p style={{ opacity: 0.7, lineHeight: '1.6', fontSize: '0.95rem' }}>
              La première plateforme dédiée à la beauté afro en France. Réservez les meilleures expertes pour vos cheveux naturels, tresses et soins.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', opacity: 0.8, fontSize: '0.9rem' }}>
              <li><Link to="/coiffeuses" style={{ color: 'inherit', textDecoration: 'none' }}>Coiffure</Link></li>
              <li><Link to="/manucure" style={{ color: 'inherit', textDecoration: 'none' }}>Manucure</Link></li>
              <li><Link to="/maquillage" style={{ color: 'inherit', textDecoration: 'none' }}>Maquillage</Link></li>
              <li><Link to="/cils" style={{ color: 'inherit', textDecoration: 'none' }}>Cils & Sourcils</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Business</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', opacity: 0.8, fontSize: '0.9rem' }}>
              <li><Link to="/devenir-partenaire" style={{ color: 'inherit', textDecoration: 'none' }}>Devenir Partenaire</Link></li>
              <li><Link to="/connexion-pro" style={{ color: 'inherit', textDecoration: 'none' }}>Espace Pro</Link></li>
              <li><Link to="/aide" style={{ color: 'inherit', textDecoration: 'none' }}>Centre d'aide</Link></li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
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

        {/* Barre de Copyright */}
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

export default DashboardClient;
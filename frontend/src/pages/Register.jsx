import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [activeTab, setActiveTab] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Champs du formulaire — correspondent exactement à ton modèle User.js
  const [formData, setFormData] = useState({
    nom_client: '',
    prenom_client: '',
    email: '',
    mdp: '',
    mdpConfirm: '',
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = {
    terracotta: '#B37256',
    terracottaLight: '#E8D5CC',
    black: '#1A1A1A',
    porcelain: '#FAF9F6',
    white: '#FFFFFF',
    gray: '#666',
    success: '#2D5A27',
    error: '#C0392B',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: colors.white,
    marginTop: '5px',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Efface l'erreur quand l'utilisateur retape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Vérification que les mots de passe correspondent
    if (formData.mdp !== formData.mdpConfirm) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.mdp.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom_client: formData.nom_client,
          prenom_client: formData.prenom_client,
          email: formData.email,
          mdp: formData.mdp,
          role: activeTab === 'pro' ? 'prestataire' : 'client',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Affiche le message d'erreur du backend (ex: "L'utilisateur existe déjà")
        setErrorMsg(data.message || "Erreur lors de l'inscription.");
        return;
      }

      // ✅ Compte créé — on redirige vers la page de connexion
      navigate('/login', {
        state: { successMsg: `Compte créé avec succès ! Connectez-vous, ${formData.prenom_client} 🎉` }
      });

    } catch {
      setErrorMsg('Impossible de contacter le serveur. Vérifie que ton backend tourne sur le port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.porcelain }}>

      {/* GAUCHE : VISUEL (PC uniquement) */}
      {!isMobile && (
        <div style={{
          flex: 1.2, backgroundColor: colors.terracottaLight,
          display: 'flex', flexDirection: 'column',
          padding: '80px', justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '520px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: colors.black, lineHeight: '1.1', marginBottom: '24px' }}>
              Rejoignez la communauté NappyBooking.
            </h1>
            <p style={{ fontSize: '1.2rem', color: colors.black, opacity: 0.85, marginBottom: '40px' }}>
              Des milliers de clientes et de professionnelles vous attendent.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {['Réservation 24h/24', 'Paiement sécurisé', 'Expertes certifiées', 'Annulation flexible'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: '600' }}>
                  <span style={{ color: colors.success }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DROITE : FORMULAIRE */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{
          width: '100%', maxWidth: '440px',
          backgroundColor: colors.white, padding: '40px',
          borderRadius: '28px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)'
        }}>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.black }}>Créer un compte</h2>
            <p style={{ color: colors.gray, fontSize: '0.95rem', marginTop: '8px' }}>
              Rejoignez NappyBooking gratuitement
            </p>
          </div>

          {/* TABS : Client / Pro */}
          <div style={{
            display: 'flex', marginBottom: '28px',
            backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '4px'
          }}>
            {['client', 'pro'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); setErrorMsg(''); }}
                style={{
                  flex: 1, padding: '12px', border: 'none', borderRadius: '10px',
                  cursor: 'pointer', fontWeight: '700',
                  backgroundColor: activeTab === tab ? colors.white : 'transparent',
                  color: activeTab === tab ? colors.terracotta : colors.gray,
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: '0.3s'
                }}
              >
                {tab === 'client' ? 'Client' : 'Professionnel'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Prénom + Nom */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Prénom *</label>
                <input
                  type="text"
                  name="prenom_client"
                  placeholder="Aminata"
                  value={formData.prenom_client}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Nom *</label>
                <input
                  type="text"
                  name="nom_client"
                  placeholder="Diallo"
                  value={formData.nom_client}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Mot de passe *</label>
              <input
                type="password"
                name="mdp"
                placeholder="Min. 6 caractères"
                value={formData.mdp}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Confirmer le mot de passe *</label>
              <input
                type="password"
                name="mdpConfirm"
                placeholder="Répétez votre mot de passe"
                value={formData.mdpConfirm}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: formData.mdpConfirm && formData.mdp !== formData.mdpConfirm ? '#FFB3B3' : '#E0E0E0'
                }}
                required
              />
              {formData.mdpConfirm && formData.mdp !== formData.mdpConfirm && (
                <p style={{ color: colors.error, fontSize: '0.8rem', marginTop: '4px' }}>
                  ⚠️ Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Consentement RGPD */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                type="checkbox"
                id="rgpd"
                required
                style={{ marginTop: '3px', accentColor: colors.terracotta, width: '16px', height: '16px', flexShrink: 0 }}
              />
              <label htmlFor="rgpd" style={{ fontSize: '0.82rem', color: colors.gray, lineHeight: '1.5' }}>
                J'accepte les{' '}
                <span style={{ color: colors.terracotta, fontWeight: '700', cursor: 'pointer' }}>
                  conditions d'utilisation
                </span>{' '}
                et la{' '}
                <span style={{ color: colors.terracotta, fontWeight: '700', cursor: 'pointer' }}>
                  politique de confidentialité
                </span>
              </label>
            </div>

            {/* Message d'erreur */}
            {errorMsg && (
              <div style={{
                backgroundColor: '#FFF0F0', border: '1px solid #FFB3B3',
                borderRadius: '10px', padding: '12px 16px',
                color: colors.error, fontSize: '0.9rem', fontWeight: '600'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '16px', borderRadius: '12px', border: 'none',
                backgroundColor: isLoading ? '#999' : colors.black,
                color: colors.white, fontWeight: '700', fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '6px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px'
              }}
            >
              {isLoading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Création du compte...
                </>
              ) : "Créer mon compte"}
            </button>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </form>

          <p style={{ textAlign: 'center', color: colors.gray, fontSize: '0.95rem', marginTop: '24px' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: colors.terracotta, fontWeight: '700', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.successMsg || '';
  const [activeTab, setActiveTab] = useState('client');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    setTimeout(() => setMounted(true), 50);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await fetch('https://nappybooking.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mdp: password }),
      });
      const data = await response.json();
      if (!response.ok) { setErrorMsg(data.message || 'Erreur de connexion'); return; }
      console.log('Réponse backend:', data); // DEBUG - à supprimer après
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.prenom || data.nom || '');
      const redirect = localStorage.getItem('redirectAfterLogin');
      if (redirect) { localStorage.removeItem('redirectAfterLogin'); navigate(redirect); return; }
      if (data.role === 'prestataire' || data.role === 'admin') { navigate('/dashboard-pro'); }
      else { navigate('/dashboard-client'); }
    } catch {
      setErrorMsg('Impossible de contacter le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { label: 'Réservation 24h/24' },
    { label: 'Paiement sécurisé' },
    { label: 'Expertes certifiées' },
    { label: 'Annulation flexible' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .nb-input {
          width: 100%; padding: 15px 0;
          background: transparent; border: none;
          border-bottom: 1.5px solid #D4B5A8;
          font-size: 0.98rem; font-family: 'DM Sans', sans-serif;
          color: #1A1A1A; outline: none;
          transition: border-color 0.3s ease;
        }
        .nb-input:focus { border-bottom-color: #B37256; }
        .nb-input::placeholder { color: #C0B0A8; font-size: 0.9rem; }
        .nb-tab {
          flex: 1; padding: 12px 8px; border: none; background: transparent;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.06em; cursor: pointer; transition: all 0.3s;
          position: relative; color: #BBB;
        }
        .nb-tab::after {
          content: ''; position: absolute; bottom: -1px;
          left: 50%; right: 50%; height: 2px;
          background: #B37256; transition: all 0.35s ease;
        }
        .nb-tab.active { color: #1A1A1A; }
        .nb-tab.active::after { left: 0; right: 0; }
        .nb-submit {
          width: 100%; padding: 16px;
          background: #1A1A1A; color: #FAF9F6;
          border: none; border-radius: 3px;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.88rem; letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .nb-submit:hover:not(:disabled) { background: #B37256; letter-spacing: 0.18em; }
        .nb-submit:disabled { background: #CCC; cursor: not-allowed; }
        .nb-feature { 
          display: flex; align-items: center; gap: 12px;
          opacity: 0; transform: translateX(-16px);
          transition: all 0.5s ease;
        }
        .nb-feature.show { opacity: 1; transform: translateX(0); }
        .nb-form-wrap {
          opacity: 0; transform: translateY(16px);
          transition: all 0.55s ease 0.15s;
        }
        .nb-form-wrap.show { opacity: 1; transform: translateY(0); }
        @keyframes nb-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ===== GAUCHE — VISUEL SOMBRE ===== */}
      {!isMobile && (
        <div style={{
          flex: '0 0 48%',
          background: 'linear-gradient(150deg, #1C0E08 0%, #1A1A1A 45%, #2E1408 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '52px 64px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Cercles décoratifs */}
          {[320, 220, 140].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: i === 2 ? 'auto' : `-${size / 2.5}px`,
              bottom: i === 2 ? `-${size / 3}px` : 'auto',
              right: i === 2 ? 'auto' : `-${size / 2.5}px`,
              left: i === 2 ? `-${size / 3}px` : 'auto',
              width: `${size}px`, height: `${size}px`,
              borderRadius: '50%',
              border: `1px solid rgba(179, 114, 86, ${0.12 - i * 0.03})`,
              pointerEvents: 'none',
            }} />
          ))}

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.55rem', fontWeight: '700',
              color: '#FAF9F6', letterSpacing: '0.01em',
            }}>
              Nappy<span style={{ color: '#B37256' }}>Booking</span>
            </span>
          </Link>

          {/* Texte principal */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
              <div style={{ width: '32px', height: '1px', background: '#B37256' }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.7rem', fontWeight: '600',
                color: '#B37256', letterSpacing: '0.22em', textTransform: 'uppercase',
              }}>
                Beauté Afro · France
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '3.4rem', fontWeight: '300',
              color: '#FAF9F6', lineHeight: '1.15',
              marginBottom: '24px', fontStyle: 'italic',
            }}>
              La beauté qui<br />
              <em style={{ fontWeight: '600', fontStyle: 'normal', color: '#C8805A' }}>
                vous ressemble.
              </em>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem', fontWeight: '300',
              color: 'rgba(250,249,246,0.55)',
              lineHeight: '1.85', maxWidth: '360px', marginBottom: '44px',
            }}>
              Des milliers de professionnelles spécialisées en beauté afro, disponibles près de chez vous.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`nb-feature ${mounted ? 'show' : ''}`}
                  style={{ transitionDelay: `${0.35 + i * 0.1}s` }}
                >
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: '#B37256', flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.87rem', color: 'rgba(250,249,246,0.75)',
                  }}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer gauche */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.72rem', color: 'rgba(250,249,246,0.25)',
          }}>
            © 2026 NappyBooking
          </p>
        </div>
      )}

      {/* ===== DROITE — FORMULAIRE ===== */}
      <div style={{
        flex: 1,
        backgroundColor: '#FAF9F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '48px 24px' : '60px 72px',
        position: 'relative',
      }}>
        {/* Accent décoratif coin */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '100px', height: '100px',
          borderLeft: '1px solid rgba(179,114,86,0.18)',
          borderBottom: '1px solid rgba(179,114,86,0.18)',
          borderBottomLeftRadius: '100px',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '60px', height: '60px',
          borderRight: '1px solid rgba(179,114,86,0.1)',
          borderTop: '1px solid rgba(179,114,86,0.1)',
          borderTopRightRadius: '60px',
          pointerEvents: 'none',
        }} />

        <div className={`nb-form-wrap ${mounted ? 'show' : ''}`} style={{ width: '100%', maxWidth: '390px' }}>

          {/* Logo mobile */}
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.9rem', fontWeight: '700', color: '#1A1A1A',
                }}>
                  Nappy<span style={{ color: '#B37256' }}>Booking</span>
                </span>
              </Link>
            </div>
          )}

          {/* Message succès */}
          {successMsg && (
            <div style={{
              background: '#F0FFF4', border: '1px solid #9AE6B4',
              borderRadius: '6px', padding: '12px 14px',
              color: '#276749', fontSize: '0.85rem',
              fontFamily: "'DM Sans', sans-serif", marginBottom: '24px',
            }}>
              ✅ {successMsg}
            </div>
          )}

          {/* Titre */}
          <div style={{ marginBottom: '36px' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem', fontWeight: '600',
              color: '#B37256', letterSpacing: '0.22em',
              textTransform: 'uppercase', marginBottom: '10px',
            }}>
              Bienvenue
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.7rem', fontWeight: '600',
              color: '#1A1A1A', lineHeight: '1.05',
            }}>
              Bon retour<span style={{ color: '#B37256' }}>.</span>
            </h2>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1.5px solid #EBE8E4',
            marginBottom: '34px',
          }}>
            {['client', 'pro'].map(tab => (
              <button
                key={tab}
                type="button"
                className={`nb-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab); setErrorMsg(''); }}
              >
                {tab === 'client' ? 'Client' : 'Professionnel'}
              </button>
            ))}
          </div>

          {/* Formulaire */}
          <form onSubmit={handleLogin}>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.68rem', fontWeight: '600',
                color: '#A89890', letterSpacing: '0.18em',
                textTransform: 'uppercase', display: 'block', marginBottom: '2px',
              }}>
                Adresse email
              </label>
              <input
                type="email"
                className="nb-input"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <label style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.68rem', fontWeight: '600',
                  color: '#A89890', letterSpacing: '0.18em', textTransform: 'uppercase',
                }}>
                  Mot de passe
                </label>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.75rem', color: '#B37256',
                  cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px',
                }}>
                  Oublié ?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="nb-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '50px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem',
                    color: '#B0A0A0', padding: '4px',
                  }}
                >
                  {showPassword ? 'Cacher' : 'Voir'}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {errorMsg && (
              <div style={{
                borderLeft: '3px solid #E53E3E',
                paddingLeft: '14px', marginBottom: '20px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.84rem', color: '#C0392B', lineHeight: '1.5',
              }}>
                {errorMsg}
              </div>
            )}

            {/* Bouton */}
            <button type="submit" disabled={isLoading} className="nb-submit">
              {isLoading ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: 'nb-spin 0.75s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#EBE8E4' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#C0B8B0' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#EBE8E4' }} />
          </div>

          {/* Lien inscription */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.86rem', color: '#9A908A', marginBottom: '10px',
            }}>
              {activeTab === 'client' ? "Pas encore de compte ?" : "Pas encore partenaire ?"}
            </p>
            <Link
              to={activeTab === 'client' ? '/register' : '/devenir-partenaire'}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.86rem', fontWeight: '700',
                color: '#1A1A1A', textDecoration: 'none',
                borderBottom: '1.5px solid #B37256', paddingBottom: '2px',
              }}
            >
              {activeTab === 'client' ? "Créer un compte gratuitement →" : "Inscrire mon établissement →"}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";

// Importation des images des villes et salons
import imgMistral from "../assets/mistral.jpg";
import imgAude from "../assets/aude.jpg";
import imgDedGlow from "../assets/dedGlow.jpg";
import imgParis from "../assets/paris.jpg";
import imgLyon from "../assets/lyon.jpg";
import imgMarseille from "../assets/marseille.jpeg";
import imgBordeaux from "../assets/bordeaux.jpg";
import imgNantes from "../assets/nantes.jpg";
import imgLille from "../assets/lille.jpg";

// Importation des images des prestations
import imgBraids from "../assets/braids.jpg";
import imgLace from "../assets/lace.jpg";
import imgPasseMeche from "../assets/passe-meche.jpg";
import imgLoxe from "../assets/loxe.jpg";

const Coiffeuses = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchCity, setSearchCity] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [salons, setSalons] = useState([]);
  const [loadingSalons, setLoadingSalons] = useState(false);
  const hypeSectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const currentRef = hypeSectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const colors = {
    terracotta: "#B37256",
    black: "#1A1A1A",
    white: "#FFFFFF",
    gray: "#666",
    bg: "#FAF9F6",
    lightGray: "#F5F5F5",
  };

  // --- LOGIQUE DE RÉSERVATION CORRIGÉE ---
  const handleBookingClick = (salonId, salonName, salonAddress) => {
    const auth = localStorage.getItem('isAuthenticated');
    const params = `category=coiffure&name=${encodeURIComponent(salonName)}&address=${encodeURIComponent(salonAddress)}`;

    if (auth === 'true') {
      navigate(`/booking/${salonId}?${params}`);
    } else {
      localStorage.setItem('redirectAfterLogin', `/booking/${salonId}?${params}`);
      navigate("/login");
    }
  };

  const cities = [
    { name: "Paris", slug: "paris", img: imgParis },
    { name: "Lyon", slug: "lyon", img: imgLyon },
    { name: "Marseille", slug: "marseille", img: imgMarseille },
    { name: "Bordeaux", slug: "bordeaux", img: imgBordeaux },
    { name: "Nantes", slug: "nantes", img: imgNantes },
    { name: "Lille", slug: "lille", img: imgLille },
  ];

  const prestationsPopulaires = [
    { id: 1, name: "Pose Lace Wig", img: imgLace, count: "120+ salons" },
    { id: 2, name: "Braids Butterfly", img: imgBraids, count: "85+ salons" },
    { id: 3, name: "Locks & Dreadlocks", img: imgLoxe, count: "50+ salons" },
    { id: 4, name: "Passes Mèches Américaines", img: imgPasseMeche, count: "95+ salons" },
  ];


  useEffect(() => {
    if (!city) return;
    setLoadingSalons(true);
    api.get(`/prestataires?city=${city.toLowerCase()}&categorie=coiffure`)
      .then(({ data }) => setSalons(data))
      .catch(() => setSalons([]))
      .finally(() => setLoadingSalons(false));
  }, [city]);

  const handleSearch = () => {
    if (searchCity.trim()) navigate(`/coiffeuses/${searchCity.toLowerCase().trim()}`);
  };

  const buildSalonUrl = (salon) => `/salon/${salon._id}`;

  // --- VUE 1 : RÉSULTATS PAR VILLE ---
  if (city) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", paddingTop: "80px" }}>
        <div style={{ flex: isMobile ? "1" : "0 0 60%", overflowY: "auto", padding: "20px 40px", backgroundColor: colors.white }}>
          <Link to="/coiffeuses" style={{ color: colors.terracotta, textDecoration: "none", fontWeight: "700", fontSize: "0.9rem" }}>
            ← RETOUR AUX VILLES
          </Link>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "20px 0 10px" }}>
            Coiffeuses Afro à {city.charAt(0).toUpperCase() + city.slice(1)}
          </h1>
          <p style={{ color: colors.gray, marginBottom: "30px" }}>
            {loadingSalons ? "Recherche en cours..." : `${salons.length} établissement${salons.length > 1 ? 's' : ''} trouvé${salons.length > 1 ? 's' : ''}`}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {loadingSalons ? (
              <p style={{ color: colors.gray, textAlign: "center", padding: "40px 0" }}>Chargement...</p>
            ) : salons.length === 0 ? (
              <p style={{ color: colors.gray, textAlign: "center", padding: "40px 0" }}>Aucun établissement trouvé dans cette ville.</p>
            ) : salons.map((salon) => (
              <div key={salon._id} style={{ display: "flex", border: "1px solid #EEE", borderRadius: "16px", overflow: "hidden" }}>
                <div
                  onClick={() => navigate(buildSalonUrl(salon))}
                  style={{ cursor: 'pointer', flexShrink: 0, width: "180px", height: "180px", backgroundColor: "#E8D5CC", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <span style={{ fontSize: "3rem" }}>💇🏾‍♀️</span>
                </div>
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h3
                        onClick={() => navigate(buildSalonUrl(salon))}
                        style={{ margin: 0, fontSize: "1.3rem", fontWeight: "800", cursor: "pointer" }}
                        onMouseEnter={(e) => e.target.style.color = colors.terracotta}
                        onMouseLeave={(e) => e.target.style.color = colors.black}
                      >
                        {salon.nom_salon}
                      </h3>
                      <div style={{ fontWeight: "700", color: colors.terracotta }}>★ {salon.note}</div>
                    </div>
                    <p style={{ color: colors.gray, fontSize: "0.9rem", margin: "5px 0" }}>{salon.adresse}</p>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                      {(salon.tags || []).map((tag) => (
                        <span key={tag} style={{ backgroundColor: colors.lightGray, padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>Dès {salon.tarif_moyen}€</span>
                    <button
                      onClick={() => handleBookingClick(salon._id, salon.nom_salon, salon.adresse)}
                      style={{ backgroundColor: colors.terracotta, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
                    >
                      Prendre RDV
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isMobile && (
          <div style={{ flex: "0 0 40%", backgroundColor: "#E5E3DF", borderLeft: "1px solid #EEE" }}>
            <iframe title="Map" width="100%" height="100%" frameBorder="0" src={`https://maps.google.com/maps?q=${city}+hair+salon&output=embed`} style={{ filter: "grayscale(0.2)" }}></iframe>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh", paddingTop: "120px" }}>
      <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER & RECHERCHE */}
        <div style={{ marginBottom: "60px", textAlign: "center" }}>
          <h1 style={{ fontSize: isMobile ? "2rem" : "3.5rem", fontWeight: "900", color: colors.black, marginBottom: "40px" }}>
            Réservez en ligne <br /> un RDV avec une coiffeuse
          </h1>
          <div style={{ backgroundColor: colors.white, borderRadius: "12px", padding: isMobile ? "8px" : "10px 15px", display: "flex", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", alignItems: "center", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ flex: 1.5, display: "flex", flexDirection: "column", padding: isMobile ? "5px 10px" : "5px 20px" }}>
              {!isMobile && <label style={{ color: "#717171", fontSize: "0.85rem", marginBottom: "4px", textAlign: "left", fontWeight: "700" }}>QUE CHERCHEZ-VOUS ?</label>}
              <input type="text" placeholder="Nom du salon, prestation..." style={{ width: "100%", border: "none", outline: "none", fontSize: "1rem" }} />
            </div>
            <div style={{ width: "1px", height: "35px", backgroundColor: "#E0E0E0" }}></div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: isMobile ? "5px 10px" : "5px 20px" }}>
              {!isMobile && <label style={{ color: "#717171", fontSize: "0.85rem", marginBottom: "4px", textAlign: "left", fontWeight: "700" }}>OÙ</label>}
              <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Ville..." style={{ width: "100%", border: "none", outline: "none", fontSize: "1rem" }} />
            </div>
            <button onClick={handleSearch} style={{ backgroundColor: colors.terracotta, color: colors.white, padding: isMobile ? "12px" : "18px 45px", borderRadius: "10px", fontWeight: "700", border: "none", cursor: "pointer" }}>RECHERCHER</button>
          </div>
        </div>

        {/* SECTION 1 : VILLES */}
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "30px" }}>Parcourir par ville</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px", marginBottom: "80px" }}>
          {cities.map((item) => (
            <Link key={item.slug} to={`/coiffeuses/${item.slug}`} style={{ position: "relative", height: "300px", borderRadius: "24px", overflow: "hidden", textDecoration: "none" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", zIndex: 1 }} />
              <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "25px", left: "25px", zIndex: 2, color: "white" }}>
                <h3 style={{ fontSize: "2rem", fontWeight: "800", margin: 0 }}>{item.name}</h3>
                <p style={{ margin: "5px 0 0", opacity: 0.9 }}>Voir les coiffeuses →</p>
              </div>
            </Link>
          ))}
        </div>

        {/* SECTION 2 : PRESTATIONS POPULAIRES */}
        <div style={{ paddingBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "30px" }}>Nos prestations populaires</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "20px" }}>
            {prestationsPopulaires.map((p) => (
              <div key={p.id} style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: colors.white, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer", transition: "0.3s" }}>
                <div style={{ height: "180px" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "15px" }}>
                  <h4 style={{ margin: "0 0 5px 0", fontWeight: "700", fontSize: "1rem" }}>{p.name}</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: colors.gray }}>{p.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 : HYPE TEXTE */}
        <div 
          ref={hypeSectionRef}
          style={{ 
            textAlign: 'center', 
            padding: isMobile ? '80px 0' : '120px 20px',
            maxWidth: '1000px',
            margin: '0 auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease-out'
          }}
        >
          <span style={{ color: colors.terracotta, fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', display: 'block', marginBottom: '20px' }}>
            L'Élite de la Coiffure Afro
          </span>
          <h2 style={{ fontSize: isMobile ? '2.2rem' : '3.8rem', fontWeight: '900', margin: '0 0 30px 0', color: colors.black, lineHeight: '1.1' }}>
            La coiffure de vos rêves,<br />réalisée par des expertes.
          </h2>
          <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', color: colors.gray, lineHeight: '1.8', marginBottom: '50px', fontWeight: '400' }}>
            Derrière chaque tresse, chaque boucle et chaque lissage invisible chez NappyBooking se cache une véritable artiste du cheveu. Nos coiffeuses ne se contentent pas de coiffer : elles sculptent, soignent et subliment votre identité avec une précision millimétrée. Nous avons parcouru la France pour dénicher ces mains d'or capables de maîtriser toutes les textures, des nattes les plus complexes aux soins profonds les plus délicats. Choisir une experte sur notre plateforme, c’est s’offrir l’assurance d’un résultat haute couture allié au respect total de votre fibre capillaire. Plus qu’un rendez-vous, c’est une célébration de votre beauté naturelle par celles qui la comprennent le mieux. Ne confiez plus vos cheveux au hasard, offrez-leur l'excellence qu'ils méritent.
          </p>
          <button 
            onClick={() => handleBookingClick('all')} // Redirige vers une liste globale ou salon par défaut
            style={{ backgroundColor: colors.black, color: colors.white, padding: '20px 50px', borderRadius: '50px', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: '0.3s' }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            TROUVER VOTRE EXPERT
          </button>
        </div>
      </div>

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
      
                {/* Partenaires */}
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
                    {/* Instagram */}
                    <a href="#" style={{ color: colors.white, opacity: 0.8 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    {/* Facebook */}
                    <a href="#" style={{ color: colors.white, opacity: 0.8 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    {/* TikTok (SVG Simples) */}
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

export default Coiffeuses;
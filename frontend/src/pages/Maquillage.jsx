import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Images des villes (communes)
import imgParis from "../assets/paris.jpg";
import imgLyon from "../assets/lyon.jpg";
import imgMarseille from "../assets/marseille.jpeg";
import imgBordeaux from "../assets/bordeaux.jpg";
import imgNantes from "../assets/nantes.jpg";
import imgLille from "../assets/lille.jpg";

// Images Maquillage renommées
import maq1 from "../assets/maquillage1.jpg";
import maq2 from "../assets/maquillage2.jpg";
import maq3 from "../assets/maquillage3.jpg";
import maq4 from "../assets/maquillage4.jpg";

const Maquillage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchCity, setSearchCity] = useState("");
  const [isVisible, setIsVisible] = useState(false);
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
    gold: "#C5A059",
    black: "#111111",
    white: "#FFFFFF",
    gray: "#777",
    bg: "#FDFCFB",
    lightGray: "#F5F5F5",
    terracotta: "#B37256",
  };

  // --- LOGIQUE DE RÉSERVATION CORRIGÉE ---
    const handleBookingClick = (salonId, salonName, salonAddress) => {
    const auth = localStorage.getItem('isAuthenticated');
    const params = `category=maquillage&name=${encodeURIComponent(salonName)}&address=${encodeURIComponent(salonAddress)}`;

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
    { id: 1, name: "Maquillage Soirée / Glam", img: maq1, count: "80+ MUAs" },
    { id: 2, name: "Maquillage Mariée", img: maq2, count: "50+ MUAs" },
    { id: 3, name: "Cours d'Auto-maquillage", img: maq3, count: "30+ MUAs" },
    { id: 4, name: "Maquillage Éditorial", img: maq4, count: "25+ MUAs" },
  ];

  const salonsData = [
    { id: 1, name: "Studio Glam Paris", rating: 5.0, address: "15 Avenue Montaigne, 75008 Paris", city: "paris", price: "75€", tags: ["Glam", "Mariage"], img: maq1, images: [maq1, maq2, maq3] },
    { id: 2, name: "Beauté Lyon", rating: 4.8, address: "5 Place Bellecour, 69002 Lyon", city: "lyon", price: "60€", tags: ["Naturel", "Cours"], img: maq3, images: [maq3, maq4, maq1] },
  ];

  const filteredSalons = city
    ? salonsData.filter((s) => s.city.toLowerCase() === city.toLowerCase())
    : [];

  const handleSearch = () => {
    if (searchCity.trim()) navigate(`/maquillage/${searchCity.toLowerCase().trim()}`);
  };

  if (city) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", paddingTop: "80px" }}>
        <div style={{ flex: isMobile ? "1" : "0 0 60%", overflowY: "auto", padding: "20px 40px", backgroundColor: colors.white }}>
          <Link to="/maquillage" style={{ color: colors.gold, textDecoration: "none", fontWeight: "700", fontSize: "0.9rem" }}>
            ← RETOUR AUX VILLES
          </Link>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "20px 0 10px" }}>
            Make-up Artists à {city.charAt(0).toUpperCase() + city.slice(1)}
          </h1>
          <p style={{ color: colors.gray, marginBottom: "30px" }}>{filteredSalons.length} maquilleuses trouvées</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredSalons.map((salon) => (
              <div key={salon.id} style={{ display: "flex", border: "1px solid #EEE", borderRadius: "16px", overflow: "hidden" }}>
                <div 
                  onClick={() => navigate(`/salon/${salon.id}?category=maquillage&name=${encodeURIComponent(salon.name)}&address=${encodeURIComponent(salon.address)}&rating=${salon.rating}&price=${encodeURIComponent(salon.price)}&tags=${encodeURIComponent(JSON.stringify(salon.tags))}&img=${encodeURIComponent(salon.img)}&images=${encodeURIComponent(JSON.stringify(salon.images || [salon.img]))}`)}
                  style={{ cursor: 'pointer', flexShrink: 0 }}
                >
                  <img src={salon.img} alt={salon.name} style={{ width: "180px", height: "180px", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h3 
                        onClick={() => navigate(`/salon/${salon.id}?category=maquillage&name=${encodeURIComponent(salon.name)}&address=${encodeURIComponent(salon.address)}&rating=${salon.rating}&price=${encodeURIComponent(salon.price)}&tags=${encodeURIComponent(JSON.stringify(salon.tags))}&img=${encodeURIComponent(salon.img)}&images=${encodeURIComponent(JSON.stringify(salon.images || [salon.img]))}`)}
                        style={{ margin: 0, fontSize: "1.3rem", fontWeight: "800", cursor: "pointer", textDecoration: "none" }}
                        onMouseEnter={(e) => e.target.style.color = colors.terracotta}
                        onMouseLeave={(e) => e.target.style.color = colors.black}
                      >
                        {salon.name}
                      </h3>
                      <div style={{ fontWeight: "700", color: colors.gold }}>★ {salon.rating}</div>
                    </div>
                    <p style={{ color: colors.gray, fontSize: "0.9rem", margin: "5px 0" }}>{salon.address}</p>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      {salon.tags.map((tag) => (
                        <span key={tag} style={{ backgroundColor: colors.lightGray, padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>Dès {salon.price}</span>
                    <button 
                      onClick={() => handleBookingClick(salon.id, salon.name, salon.address)} 
                      style={{ backgroundColor: colors.black, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isMobile && (
          <div style={{ flex: "0 0 40%", backgroundColor: "#E5E3DF" }}>
             <iframe title="Map" width="100%" height="100%" frameBorder="0" src={`https://maps.google.com/maps?q=${city}+makeup+artist&output=embed`} style={{ filter: "grayscale(0.5)" }}></iframe>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh", paddingTop: "120px" }}>
      <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "60px", textAlign: "center" }}>
          <h1 style={{ fontSize: isMobile ? "2.2rem" : "3.5rem", fontWeight: "900", color: colors.black, marginBottom: "40px" }}>
            Révélez votre éclat <br /> par des mains expertes
          </h1>
          <div style={{ backgroundColor: colors.white, borderRadius: "12px", padding: isMobile ? "8px" : "10px 15px", display: "flex", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", alignItems: "center", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ flex: 1.5, display: "flex", flexDirection: "column", padding: "5px 20px" }}>
              {!isMobile && <label style={{ color: "#717171", fontSize: "0.85rem", marginBottom: "4px", textAlign: "left", fontWeight: "700" }}>TYPE DE MAQUILLAGE</label>}
              <input type="text" placeholder="Mariage, Soirée, Cours..." style={{ width: "100%", border: "none", outline: "none", fontSize: "1rem" }} />
            </div>
            <div style={{ width: "1px", height: "35px", backgroundColor: "#E0E0E0" }}></div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "5px 20px" }}>
              {!isMobile && <label style={{ color: "#717171", fontSize: "0.85rem", marginBottom: "4px", textAlign: "left", fontWeight: "700" }}>VILLE</label>}
              <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Où ?" style={{ width: "100%", border: "none", outline: "none", fontSize: "1rem" }} />
            </div>
            <button onClick={handleSearch} style={{ backgroundColor: colors.black, color: colors.white, padding: isMobile ? "12px" : "18px 45px", borderRadius: "10px", fontWeight: "700", border: "none", cursor: "pointer" }}>RECHERCHER</button>
          </div>
        </div>

        {/* GRILLE VILLES */}
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "30px" }}>Les meilleures adresses par ville</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px", marginBottom: "80px" }}>
          {cities.map((item) => (
            <Link key={item.slug} to={`/maquillage/${item.slug}`} style={{ position: "relative", height: "300px", borderRadius: "24px", overflow: "hidden", textDecoration: "none" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", zIndex: 1 }} />
              <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "25px", left: "25px", zIndex: 2, color: "white" }}>
                <h3 style={{ fontSize: "2rem", fontWeight: "800", margin: 0 }}>{item.name}</h3>
                <p style={{ margin: "5px 0 0", opacity: 0.9 }}>Découvrir les talents →</p>
              </div>
            </Link>
          ))}
        </div>

        {/* SECTION PRESTATIONS */}
        <div style={{ paddingBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "30px" }}>Prestations Maquillage</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "20px" }}>
            {prestationsPopulaires.map((p) => (
              <div key={p.id} style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: colors.white, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ height: "200px" }}>
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

        {/* SECTION HYPE MAQUILLAGE */}
        <div 
          ref={hypeSectionRef}
          style={{ 
            textAlign: 'center', 
            padding: isMobile ? '80px 0' : '120px 20px',
            maxWidth: '900px',
            margin: '0 auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease-out'
          }}
        >
          <span style={{ color: colors.gold, fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '20px' }}>
            Artistry & Excellence
          </span>
          <h2 style={{ fontSize: isMobile ? '2.2rem' : '3.8rem', fontWeight: '900', margin: '0 0 30px 0', color: colors.black, lineHeight: '1.1' }}>
            Votre beauté mérite<br />une experte.
          </h2>
          <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', color: colors.gray, lineHeight: '1.8', marginBottom: '50px' }}>
            Qu’il s’agisse d’un événement spécial, de votre mariage ou simplement de l’envie d’apprendre les gestes parfaits, NappyBooking vous connecte aux Make-up Artists spécialisées. Nous mettons en avant des expertes qui maîtrisent toutes les carnations et textures de peau, pour un résultat zéro défaut.
          </p>
          <button 
            onClick={() => handleBookingClick('all')}
            style={{ backgroundColor: colors.black, color: colors.white, padding: '20px 50px', borderRadius: '50px', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            TROUVER MA MAQUILLEUSE
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

export default Maquillage; 
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Images des villes (communes)
import imgParis from "../assets/paris.jpg";
import imgLyon from "../assets/lyon.jpg";
import imgMarseille from "../assets/marseille.jpeg";
import imgBordeaux from "../assets/bordeaux.jpg";
import imgNantes from "../assets/nantes.jpg";
import imgLille from "../assets/lille.jpg";

// Images Cils renommées
import cils1 from "../assets/cils1.jpg";
import cils2 from "../assets/cils2.jpg";
import cils3 from "../assets/cils3.jpg";
import cils4 from "../assets/cils4.jpg";

// --- 1. COMPOSANT FOOTER SORTI DU RENDU ---
const Footer = ({ colors, isMobile }) => (
  <footer style={{ 
    backgroundColor: colors.black, 
    color: colors.white, 
    padding: isMobile ? '60px 20px 30px' : '80px 60px 40px',
    width: '100%'
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
          <a href="#" style={{ color: colors.white, opacity: 0.8 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          <a href="#" style={{ color: colors.white, opacity: 0.8 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
          <a href="#" style={{ color: colors.white, opacity: 0.8 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg></a>
        </div>
      </div>
    </div>
    <div style={{ maxWidth: '1200px', margin: '60px auto 0 auto', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.85rem', opacity: 0.5 }}>
      Copyright © 2026 NappyBooking. Tous droits réservés.
    </div>
  </footer>
);

const Cils = () => {
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
    softPink: "#E8C1C5",
    darkAnthracite: "#2C2C2C",
    white: "#FFFFFF",
    black: "#1A1A1A",
    gray: "#777",
    bg: "#FBFAFA",
    lightGray: "#F5F5F5",
    terracotta: "#B37256",
  };

    const handleBookingClick = (salonId, salonName, salonAddress) => {
    const auth = localStorage.getItem('isAuthenticated');
    const params = `category=cils&name=${encodeURIComponent(salonName)}&address=${encodeURIComponent(salonAddress)}`;

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
    { id: 1, name: "Extension Cil à Cil", img: cils1, count: "120+ salons" },
    { id: 2, name: "Volume Russe", img: cils2, count: "85+ salons" },
    { id: 3, name: "Rehaussement de Cils", img: cils3, count: "60+ salons" },
    { id: 4, name: "Restructuration Sourcils", img: cils4, count: "95+ salons" },
  ];

  const salonsData = [
    { id: 1, name: "L'Atelier du Regard", rating: 4.9, address: "40 rue du Bac, 75007 Paris", city: "paris", price: "80€", tags: ["Volume Russe", "Lash Lift"], img: cils2, images: [cils2, cils1, cils3] },
    { id: 2, name: "Regard de Soie", rating: 4.7, address: "12 rue de la République, 69002 Lyon", city: "lyon", price: "65€", tags: ["Cil à Cil"], img: cils1, images: [cils1, cils4, cils2] },
  ];

  const filteredSalons = city
    ? salonsData.filter((s) => s.city.toLowerCase() === city.toLowerCase())
    : [];

  const handleSearch = () => {
    if (searchCity.trim()) navigate(`/cils/${searchCity.toLowerCase().trim()}`);
  };

  // --- VUE RÉSULTATS PAR VILLE ---
  if (city) {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: "100vh" }}>
        <div style={{ display: "flex", minHeight: "calc(100vh - 80px)", width: "100%", paddingTop: "80px" }}>
          <div style={{ flex: isMobile ? "1" : "0 0 60%", padding: "20px 40px", backgroundColor: colors.white }}>
            <Link to="/cils" style={{ color: colors.terracotta, textDecoration: "none", fontWeight: "700", fontSize: "0.9rem" }}>
              ← TOUS LES SERVICES CILS
            </Link>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "20px 0 10px" }}>
              Lash Artists à {city.charAt(0).toUpperCase() + city.slice(1)}
            </h1>
            <p style={{ color: colors.gray, marginBottom: "30px" }}>{filteredSalons.length} expertes du regard disponibles</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {filteredSalons.map((salon) => (
                <div key={salon.id} style={{ display: "flex", border: "1px solid #EEE", borderRadius: "16px", overflow: "hidden" }}>
                  <div 
                  onClick={() => navigate(`/salon/${salon.id}?category=cils&name=${encodeURIComponent(salon.name)}&address=${encodeURIComponent(salon.address)}&rating=${salon.rating}&price=${encodeURIComponent(salon.price)}&tags=${encodeURIComponent(JSON.stringify(salon.tags))}&img=${encodeURIComponent(salon.img)}&images=${encodeURIComponent(JSON.stringify(salon.images || [salon.img]))}`)}
                  style={{ cursor: 'pointer', flexShrink: 0 }}
                >
                  <img src={salon.img} alt={salon.name} style={{ width: "180px", height: "180px", objectFit: "cover", display: "block" }} />
                </div>
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h3 
                        onClick={() => navigate(`/salon/${salon.id}?category=cils&name=${encodeURIComponent(salon.name)}&address=${encodeURIComponent(salon.address)}&rating=${salon.rating}&price=${encodeURIComponent(salon.price)}&tags=${encodeURIComponent(JSON.stringify(salon.tags))}&img=${encodeURIComponent(salon.img)}&images=${encodeURIComponent(JSON.stringify(salon.images || [salon.img]))}`)}
                        style={{ margin: 0, fontSize: "1.3rem", fontWeight: "800", cursor: "pointer", textDecoration: "none" }}
                        onMouseEnter={(e) => e.target.style.color = colors.terracotta}
                        onMouseLeave={(e) => e.target.style.color = colors.black}
                      >
                        {salon.name}
                      </h3>
                        <div style={{ fontWeight: "700", color: colors.terracotta }}>★ {salon.rating}</div>
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
                      <button onClick={() => handleBookingClick(salon.id, salon.name, salon.address)} style={{ backgroundColor: colors.darkAnthracite, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                        Prendre RDV
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!isMobile && (
            <div style={{ flex: "0 0 40%", position: "sticky", top: "80px", height: "calc(100vh - 80px)", backgroundColor: "#E5E3DF" }}>
              <iframe title="Map" width="100%" height="100%" frameBorder="0" src={`http://googleusercontent.com/maps.google.com/maps?q=${city}+eyelash+extensions&output=embed`} style={{ filter: "grayscale(0.5)" }}></iframe>
            </div>
          )}
        </div>
        <Footer colors={colors} isMobile={isMobile} />
      </div>
    );
  }

  // --- VUE ACCUEIL CILS ---
  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh", paddingTop: "120px" }}>
      <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "60px", textAlign: "center" }}>
          <h1 style={{ fontSize: isMobile ? "2.2rem" : "3.5rem", fontWeight: "900", color: colors.darkAnthracite, marginBottom: "40px" }}>
            Un regard captivant <br /> en un clin d'œil
          </h1>
          <div style={{ backgroundColor: colors.white, borderRadius: "12px", padding: isMobile ? "8px" : "10px 15px", display: "flex", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", alignItems: "center", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ flex: 1.5, display: "flex", flexDirection: "column", padding: "5px 20px" }}>
              {!isMobile && <label style={{ color: "#717171", fontSize: "0.85rem", marginBottom: "4px", textAlign: "left", fontWeight: "700" }}>PRESTATION</label>}
              <input type="text" placeholder="Extensions, Rehaussement..." style={{ width: "100%", border: "none", outline: "none", fontSize: "1rem" }} />
            </div>
            <div style={{ width: "1px", height: "35px", backgroundColor: "#E0E0E0" }}></div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "5px 20px" }}>
              {!isMobile && <label style={{ color: "#717171", fontSize: "0.85rem", marginBottom: "4px", textAlign: "left", fontWeight: "700" }}>VILLE</label>}
              <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Où ?" style={{ width: "100%", border: "none", outline: "none", fontSize: "1rem" }} />
            </div>
            <button onClick={handleSearch} style={{ backgroundColor: colors.darkAnthracite, color: colors.white, padding: isMobile ? "12px" : "18px 45px", borderRadius: "10px", fontWeight: "700", border: "none", cursor: "pointer" }}>TROUVER</button>
          </div>
        </div>

        {/* GRILLE VILLES */}
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "30px" }}>Trouver un studio par ville</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px", marginBottom: "80px" }}>
          {cities.map((item) => (
            <Link key={item.slug} to={`/cils/${item.slug}`} style={{ position: "relative", height: "300px", borderRadius: "24px", overflow: "hidden", textDecoration: "none" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", zIndex: 1 }} />
              <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "25px", left: "25px", zIndex: 2, color: "white" }}>
                <h3 style={{ fontSize: "2rem", fontWeight: "800", margin: 0 }}>{item.name}</h3>
                <p style={{ margin: "5px 0 0", opacity: 0.9 }}>Découvrir les studios →</p>
              </div>
            </Link>
          ))}
        </div>

        {/* SECTION PRESTATIONS */}
        <div style={{ paddingBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "30px" }}>Focus sur le regard</h2>
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

        {/* SECTION HYPE CILS */}
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
          <span style={{ color: colors.terracotta, fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '20px' }}>
            Precision & Beauty
          </span>
          <h2 style={{ fontSize: isMobile ? '2.2rem' : '3.8rem', fontWeight: '900', margin: '0 0 30px 0', color: colors.darkAnthracite, lineHeight: '1.1' }}>
            L'art de sublimer <br /> votre regard.
          </h2>
          <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', color: colors.gray, lineHeight: '1.8', marginBottom: '50px' }}>
            Plus besoin de mascara. Nos techniciennes certifiées utilisent les meilleures fibres et colles hypoallergéniques pour vous offrir un regard sur-mesure.
          </p>
          <button 
            onClick={() => handleBookingClick('all')} 
            style={{ backgroundColor: colors.darkAnthracite, color: colors.white, padding: '20px 50px', borderRadius: '50px', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            DÉCOUVRIR LES STUDIOS
          </button>
        </div>
      </div>

      {/* Appel du footer avec les props */}
      <Footer colors={colors} isMobile={isMobile} />
    </div>
  );
};

export default Cils;
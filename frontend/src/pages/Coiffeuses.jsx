import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Importation des images
import imgMistral from "../assets/mistral.jpg";
import imgAude from "../assets/aude.jpg";
import imgDedGlow from "../assets/dedGlow.jpg";
import imgParis from "../assets/paris.jpg";
import imgLyon from "../assets/lyon.jpg";
import imgMarseille from "../assets/marseille.jpeg";
import imgBordeaux from "../assets/bordeaux.jpg";
import imgNantes from "../assets/nantes.jpg";
import imgLille from "../assets/lille.jpg";

const Coiffeuses = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colors = {
    terracotta: "#B37256",
    black: "#1A1A1A",
    white: "#FFFFFF",
    gray: "#666",
    bg: "#FAF9F6",
    lightGray: "#F5F5F5",
  };

  const cities = [
    { name: "Paris", slug: "paris", img: imgParis },
    { name: "Lyon", slug: "lyon", img: imgLyon },
    { name: "Marseille", slug: "marseille", img: imgMarseille },
    { name: "Bordeaux", slug: "bordeaux", img: imgBordeaux },
    { name: "Nantes", slug: "nantes", img: imgNantes },
    { name: "Lille", slug: "lille", img: imgLille },
  ];

  // DONNÉES RÉELLES DES SALONS
  const salonsData = [
    {
      id: 1,
      name: "MistralCare",
      rating: 4.9,
      address: "15 rue Gauthey, 75017 Paris",
      city: "paris",
      price: "45€",
      tags: ["Tissage", "Soins"],
      img: imgMistral,
    },
    {
      id: 2,
      name: "Ded Glow Beauty",
      rating: 4.8,
      address: "54 rue Veron, 94140 Alfortville",
      city: "paris",
      price: "35€",
      tags: ["Nattes", "Beauté"],
      img: imgDedGlow,
    },
    {
      id: 3,
      name: "audeBraids",
      rating: 5.0,
      address: "Corbeil Essonnes, Paris Sud",
      city: "paris", // CHANGÉ ICI pour apparaître dans la recherche Paris
      price: "60€",
      tags: ["Braids", "Crochet"],
      img: imgAude,
    },
  ];

  // Filtrage selon l'URL
  const filteredSalons = city
    ? salonsData.filter((s) => s.city.includes(city.toLowerCase()))
    : [];

  const handleSearch = () => {
    if (searchCity.trim()) {
      navigate(`/coiffeuses/${searchCity.toLowerCase().trim()}`);
    }
  };

  // --- VUE 1 : RÉSULTATS PAR VILLE (SPLIT SCREEN) ---
  if (city) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          paddingTop: "80px",
        }}
      >
        {/* COLONNE GAUCHE : LISTE */}
        <div
          style={{
            flex: isMobile ? "1" : "0 0 60%",
            overflowY: "auto",
            padding: "20px 40px",
            backgroundColor: colors.white,
          }}
        >
          <Link
            to="/coiffeuses"
            style={{
              color: colors.terracotta,
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.9rem",
            }}
          >
            ← RETOUR AUX VILLES
          </Link>

          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "900",
              margin: "20px 0 10px",
            }}
          >
            Coiffeuses Afro à {city.charAt(0).toUpperCase() + city.slice(1)}
          </h1>
          <p style={{ color: colors.gray, marginBottom: "30px" }}>
            {filteredSalons.length} établissements trouvés
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {filteredSalons.map((salon) => (
              <div
                key={salon.id}
                style={{
                  display: "flex",
                  border: "1px solid #EEE",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "0.3s",
                }}
              >
                <img
                  src={salon.img}
                  alt={salon.name}
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    padding: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.3rem",
                          fontWeight: "800",
                        }}
                      >
                        {salon.name}
                      </h3>
                      <div
                        style={{ fontWeight: "700", color: colors.terracotta }}
                      >
                        ★ {salon.rating}
                      </div>
                    </div>
                    <p
                      style={{
                        color: colors.gray,
                        fontSize: "0.9rem",
                        margin: "5px 0",
                      }}
                    >
                      {salon.address}
                    </p>
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "10px" }}
                    >
                      {salon.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            backgroundColor: colors.lightGray,
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>
                      Dès {salon.price}
                    </span>
                    <button
                      style={{
                        backgroundColor: colors.terracotta,
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Prendre RDV
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE : MAP */}
        {!isMobile && (
          <div
            style={{
              flex: "0 0 40%",
              backgroundColor: "#E5E3DF",
              borderLeft: "1px solid #EEE",
            }}
          >
            <iframe
              title="Localisation Salon"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${city}+hair+salon&output=embed`}
              style={{ filter: "grayscale(0.2)" }}
            ></iframe>
          </div>
        )}
      </div>
    );
  }

  // --- VUE 2 : GRILLE DES VILLES ---
  return (
    <div
      style={{
        backgroundColor: colors.bg,
        minHeight: "100vh",
        paddingTop: "120px",
      }}
    >
      <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "80px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              fontWeight: "900",
              color: colors.black,
              marginBottom: "40px",
            }}
          >
            Réservez en ligne <br /> un RDV avec une coiffeuse
          </h1>

          {/* BARRE DE RECHERCHE */}
          <div
            style={{
              backgroundColor: colors.white,
              borderRadius: "12px",
              padding: isMobile ? "8px" : "10px 15px",
              display: "flex",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              alignItems: "center",
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                flex: 1.5,
                display: "flex",
                flexDirection: "column",
                padding: isMobile ? "5px 10px" : "5px 20px",
              }}
            >
              {!isMobile && (
                <label
                  style={{
                    color: "#717171",
                    fontSize: "0.85rem",
                    marginBottom: "4px",
                    textAlign: "left",
                    fontWeight: "700",
                  }}
                >
                  QUE CHERCHEZ-VOUS ?
                </label>
              )}
              <input
                type="text"
                placeholder={
                  isMobile ? "Prestation..." : "Nom du salon, prestation"
                }
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "500",
                  color: colors.black,
                }}
              />
            </div>

            <div
              style={{
                width: "1px",
                height: "35px",
                backgroundColor: "#E0E0E0",
              }}
            ></div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: isMobile ? "5px 10px" : "5px 20px",
              }}
            >
              {!isMobile && (
                <label
                  style={{
                    color: "#717171",
                    fontSize: "0.85rem",
                    marginBottom: "4px",
                    textAlign: "left",
                    fontWeight: "700",
                  }}
                >
                  OÙ
                </label>
              )}
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={isMobile ? "Ville..." : "Adresse, ville..."}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "500",
                  color: colors.black,
                }}
              />
            </div>

            <button
              onClick={handleSearch}
              style={{
                backgroundColor: colors.terracotta,
                color: colors.white,
                padding: isMobile ? "12px" : "18px 45px",
                borderRadius: "10px",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                marginLeft: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isMobile ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              ) : (
                "RECHERCHER"
              )}
            </button>
          </div>
        </div>

        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            marginBottom: "30px",
          }}
        >
          Parcourir par ville
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "30px",
            paddingBottom: "60px",
          }}
        >
          {cities.map((item) => (
            <Link
              key={item.slug}
              to={`/coiffeuses/${item.slug}`}
              style={{
                position: "relative",
                height: "300px",
                borderRadius: "24px",
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  zIndex: 1,
                }}
              />
              <img
                src={item.img}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "25px",
                  left: "25px",
                  zIndex: 2,
                  color: "white",
                }}
              >
                <h3 style={{ fontSize: "2rem", fontWeight: "800", margin: 0 }}>
                  {item.name}
                </h3>
                <p style={{ margin: "5px 0 0", opacity: 0.9 }}>
                  Voir les coiffeuses →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coiffeuses;

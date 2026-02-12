import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Imports des services
import imgCoiffure from '../assets/service-coiffure.jpg'
import imgManucure from '../assets/service-manucure.jpg'
import imgMaquillage from '../assets/service-maquillage.jpg'
import imgCils from '../assets/service-cils.jpg'

// Imports des avis
import imgPriscille from '../assets/avis-priscille.jpg'
import imgLaury from '../assets/avis-laury.jpg'
import imgRebecca from '../assets/avis-rebecca.jpg'

// Imports du Hero
import hero1 from '../assets/hero1.jpg'
import hero2 from '../assets/hero2.jpg'
import hero4 from '../assets/hero4.jpg'
import hero5 from '../assets/hero5.jpg'

function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);

  const colors = {
    terracotta: '#B37256',
    white: '#FFFFFF',
    black: '#1A1A1A',
    porcelain: '#FAF9F6'
  }

  const imagesHero = [hero1, hero2, hero4, hero5]

  const services = [
    { title: "Coiffeuses", desc: "Envie de changer de tête ou de coupe ? Vous avez besoin d'un expert pour vous conseiller sur vos soins naturels, tresses ou locks.", img: imgCoiffure, link: "/coiffeuses" },
    { title: "Manucure", desc: "Offrez à vos mains le soin qu'elles méritent. Pose de vernis, gel ou nail art par nos prothésistes ongulaires expertes.", img: imgManucure, link: "/manucure" },
    { title: "Maquillage", desc: "Sublimez votre visage pour vos grands événements. Un maquillage professionnel qui respecte votre carnation et vos envies.", img: imgMaquillage, link: "/maquillage" },
    { title: "Extensions de cils", desc: "Un regard intense dès le réveil. Nos techniciennes spécialisées vous proposent des poses classiques ou volume russe.", img: imgCils, link: "/cils" }
  ]

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev === imagesHero.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => {
      clearInterval(heroTimer);
      window.removeEventListener('resize', handleResize);
    }
  }, [imagesHero.length])

  useEffect(() => {
    const duration = 10000; 
    const intervalTime = 100; 
    const step = (intervalTime / duration) * 100;
    const serviceTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current === services.length - 1 ? 0 : current + 1));
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);
    return () => clearInterval(serviceTimer);
  }, [activeIndex, services.length]);

  const handleNext = () => { setActiveIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1)); setProgress(0); };
  const handlePrev = () => { setActiveIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1)); setProgress(0); };

  return (
    <div style={{ backgroundColor: colors.porcelain, overflowX: 'hidden' }}>
      
      {/* HERO SECTION */}
      <section style={{ 
        position: 'relative', minHeight: isMobile ? '85vh' : '100vh', width: '100vw', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        color: colors.white, textAlign: 'center', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${imagesHero[currentHeroIndex]})`,
          backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 1.2s ease-in-out', zIndex: 1
        }}></div>
        
        <div style={{ zIndex: 2, width: '100%', maxWidth: '850px', padding: '0 20px' }}>
          <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: '800', marginBottom: '15px' }}>Réservez en beauté</h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.3rem', marginBottom: '40px', opacity: 0.9 }}>Coiffeuses expertes en soins naturels, tresses, locs et twists en France.</p>
          
          {/* BARRE DE RECHERCHE */}
          <div style={{ backgroundColor: colors.white, borderRadius: '12px', padding: isMobile ? '8px' : '10px 15px', display: 'flex', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', alignItems: 'center', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', padding: isMobile ? '5px 10px' : '5px 20px' }}>
                {!isMobile && <label style={{ color: '#717171', fontSize: '0.85rem', marginBottom: '4px', textAlign: 'left' }}>Que cherchez-vous ?</label>}
                <input type="text" placeholder={isMobile ? "Prestation..." : "Nom du salon, prestation"} style={{ width: '100%', border: 'none', outline: 'none', fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: '500', color: colors.black }} />
            </div>
            <div style={{ width: '1px', height: '35px', backgroundColor: '#E0E0E0' }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: isMobile ? '5px 10px' : '5px 20px' }}>
                {!isMobile && <label style={{ color: '#717171', fontSize: '0.85rem', marginBottom: '4px', textAlign: 'left' }}>Où</label>}
                <input type="text" placeholder={isMobile ? "Ville..." : "Adresse, ville..."} style={{ width: '100%', border: 'none', outline: 'none', fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: '500', color: colors.black }} />
            </div>
            <button style={{ backgroundColor: colors.terracotta, color: colors.white, padding: isMobile ? '12px' : '18px 45px', borderRadius: '10px', fontWeight: '700', border: 'none', cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isMobile ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> : "RECHERCHER"}
            </button>
          </div>

          {/* BOUTON DEVENIR PARTENAIRE */}
          <div style={{ marginTop: '30px' }}>
            <Link to="/devenir-partenaire" style={{ 
              display: 'inline-block',
              padding: isMobile ? '14px 25px' : '16px 35px',
              backgroundColor: colors.terracotta,
              color: colors.white,
              borderRadius: '10px',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}>
              DEVENIR PARTENAIRE
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION DÉCOUVRIR NOS SERVICES --- */}
      <section style={{ 
        padding: isMobile ? '60px 20px' : '100px 60px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: 'center', 
        gap: isMobile ? '40px' : '60px'
      }}>
        <div style={{ flex: 1, textAlign: 'left', width: '100%' }}>
          <h3 style={{ fontSize: isMobile ? '2.2rem' : '3rem', fontWeight: '800', marginBottom: '40px', color: colors.black }}>
            Découvrez nos services
          </h3>
          <div style={{ minHeight: isMobile ? 'auto' : '220px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: colors.terracotta, marginBottom: '15px' }}>
              {services[activeIndex].title}
            </h3>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px', maxWidth: '450px' }}>
              {services[activeIndex].desc}
            </p>
            <Link to={services[activeIndex].link} style={{ 
              color: colors.black, fontWeight: '700', textDecoration: 'none', borderBottom: `2px solid ${colors.terracotta}`, paddingBottom: '5px' 
            }}>
              VOIR LES PRESTATAIRES
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
            <button onClick={handlePrev} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span>←</span>
            </button>
            <button onClick={handleNext} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <svg width="55" height="55" style={{ position: 'absolute', top: -1, left: -1, transform: 'rotate(-90deg)' }}>
                <circle cx="27.5" cy="27.5" r="26" fill="none" stroke={colors.terracotta} strokeWidth="3" strokeDasharray="163.36" strokeDashoffset={163.36 - (163.36 * progress) / 100} style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
              </svg>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* IMAGE CONTAINER CORRIGÉ PAR TOI MÊME ;) */}
        <div style={{ 
          flex: isMobile ? 'none' : '1', 
          width: '100%', 
          height: isMobile ? '350px' : '550px',
          minHeight: isMobile ? '350px' : '550px', 
          borderRadius: '30px', 
          overflow: 'hidden', 
          position: 'relative', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          backgroundColor: '#f0f0f0',
          display: 'block' 
        }}>
          {services.map((service, index) => (
            <div 
              key={index} 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%',
                height: '100%',
                backgroundImage: `url(${service.img})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out', 
                opacity: activeIndex === index ? 1 : 0, 
                transform: activeIndex === index ? 'scale(1)' : 'scale(1.05)',
                zIndex: activeIndex === index ? 2 : 1,
                pointerEvents: activeIndex === index ? 'auto' : 'none'
              }} 
            />
          ))}
        </div>
      </section>

    {/* --- SECTION MISSIONS & VALEURS --- */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 20px', backgroundColor: colors.white }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h3 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '800', color: colors.black, marginBottom: '25px' }}>
                    Plus qu'une plateforme de réservation
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444', maxWidth: '800px', margin: '0 auto' }}>
                    Chez <span style={{ fontWeight: '700', color: colors.terracotta }}>NappyBooking</span>, notre mission est de célébrer la beauté des cheveux afro sans complexe partout en France. 
                </p>
            </div>
            
            {/* Grille de 4 missions */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
              gap: '30px' 
            }}>
                {/* Mission 1 */}
                <div style={{ padding: '40px', borderRadius: '20px', backgroundColor: colors.porcelain, border: '1px solid #eee' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta, textTransform: 'uppercase' }}>Expertise Afro</h4>
                    <p style={{ color: '#666' }}>Des professionnels qui maîtrisent réellement les cheveux crépus, frisés et bouclés.</p>
                </div>

                {/* Mission 2 */}
                <div style={{ padding: '40px', borderRadius: '20px', backgroundColor: colors.porcelain, border: '1px solid #eee' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta, textTransform: 'uppercase' }}>Confiance & Respect</h4>
                    <p style={{ color: '#666' }}>Une charte stricte pour garantir la ponctualité et la bienveillance à chaque prestation.</p>
                </div>

                {/* Mission 3 - NOUVELLE */}
                <div style={{ padding: '40px', borderRadius: '20px', backgroundColor: colors.porcelain, border: '1px solid #eee' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta, textTransform: 'uppercase' }}>Inclusion Partout</h4>
                    <p style={{ color: '#666' }}>Rendre les soins spécialisés accessibles dans toutes les villes de France, même les plus petites.</p>
                </div>

                {/* Mission 4 - NOUVELLE */}
                <div style={{ padding: '40px', borderRadius: '20px', backgroundColor: colors.porcelain, border: '1px solid #eee' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta, textTransform: 'uppercase' }}>Digitalisation</h4>
                    <p style={{ color: '#666' }}>Moderniser les salons afro avec des outils de réservation innovants et un paiement sécurisé.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION PROFESSIONNELS --- */}
      <section style={{ 
        padding: isMobile ? '60px 20px' : '100px 60px', 
        backgroundColor: colors.white 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', marginBottom: '15px', color: colors.black }}>
            Vous êtes un professionnel ? Découvrez la prise de RDV en ligne !
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '60px', maxWidth: '700px', margin: '0 auto 60px' }}>
            NappyBooking recherche des partenaires dans toute la France pour digitaliser le secteur de la beauté.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', 
            gap: '25px' 
          }}>
            {[
              { title: "Rappels SMS", desc: "Réduisez les rendez-vous non honorés grâce aux rappels automatiques par SMS." },
              { title: "24h/24 & 7j/7", desc: "50% des rendez-vous sont pris en ligne en dehors de vos horaires d'ouverture." },
              { title: "Visibilité ciblée", desc: "Apparaissez devant des milliers de clientes cherchant spécifiquement votre expertise." },
              { title: "Paiement sécurisé", desc: "Garantissez vos revenus avec le système d'acompte obligatoire en ligne." },
              { title: "Gestion simplifiée", desc: "Un agenda intelligent pour piloter votre activité et vos collaboratrices sans stress." },
              { title: "Suivi Personnalisé", desc: "Historique, préférences et statistiques : connaissez vos clientes et leurs besoins sur le bout des doigts."}
            ].map((box, index) => (
              <div 
                key={index}
                onMouseEnter={() => setHoveredBox(index)}
                onMouseLeave={() => setHoveredBox(null)}
                style={{
                  backgroundColor: colors.porcelain,
                  padding: '40px 30px',
                  borderRadius: '25px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: hoveredBox === index ? `1px solid ${colors.terracotta}` : '1px solid #eee',
                  transform: hoveredBox === index ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: hoveredBox === index ? '0 20px 40px rgba(0,0,0,0.1)' : 'none',
                  minHeight: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Le Texte (qui reste toujours visible) */}
                <div style={{ 
                  transition: 'transform 0.3s ease',
                  transform: hoveredBox === index ? 'translateY(-20px)' : 'translateY(0)'
                }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta }}>
                    {box.title}
                  </h4>
                  <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                    {box.desc}
                  </p>
                </div>

                {/* Le Bouton (qui apparaît en glissant vers le haut) */}
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  opacity: hoveredBox === index ? 1 : 0,
                  transform: hoveredBox === index ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.3s ease',
                  pointerEvents: hoveredBox === index ? 'auto' : 'none'
                }}>
                  <Link 
                    to="/devenir-partenaire" 
                    style={{ 
                      backgroundColor: colors.terracotta,
                      color: colors.white, 
                      textDecoration: 'none', 
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      padding: '12px 25px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(179, 114, 86, 0.3)',
                      display: 'inline-block'
                    }}
                  >
                    DEVENIR PRESTATAIRE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- SECTION AVIS CLIENTS --- */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 20px', backgroundColor: colors.porcelain }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: isMobile ? '2.2rem' : '3rem', fontWeight: '800', marginBottom: '15px', color: colors.black }}>
                Avis des clients
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#666', 
              maxWidth: '700px', 
              margin: '0 auto 60px auto', 
              lineHeight: '1.5'
            }}>
              Découvrez les témoignages de nos clients satisfaites à travers la France
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '30px' }}>
                {[
                    { name: "Priscille", city: "Paris, France", img: imgPriscille, text: "Enfin une plateforme qui me connecte avec des coiffeuses qui comprennent vraiment les cheveux naturels." },
                    { name: "Laury", city: "Nantes, France", img: imgLaury, text: "Le cadre est super professionnel et j'ai enfin trouvé une experte pour mes locks à Nantes." },
                    { name: "Rebecca", city: "Paris, France", img: imgRebecca, text: "La réservation est fluide et le paiement sécurisé rassure énormément." }
                ].map((avis, index) => (
                    <div key={index} style={{ backgroundColor: 'white', padding: '35px', borderRadius: '25px', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <img 
                              src={avis.img} 
                              alt={avis.name} 
                              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors.terracotta}` }} 
                            />
                            <div>
                                <h4 style={{ fontWeight: '700', margin: 0 }}>{avis.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>{avis.city}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '15px' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={colors.terracotta}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                            ))}
                        </div>
                        <p style={{ color: '#444', fontStyle: 'italic' }}>"{avis.text}"</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- SECTION MAILLAGE LOCAL (Style Planity) --- */}
      <section style={{ 
        padding: isMobile ? '60px 20px' : '80px 60px', 
        backgroundColor: colors.white,
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: '800', marginBottom: '40px', color: colors.black }}>
            Trouvez votre établissement partout en France
          </h3>

          <div style={{ 
            display: 'grid', 
            // 1fr sur mobile, 1fr 1fr sur tablette (entre 600px et 1024px), 1fr 1fr 1fr 1fr sur desktop
            gridTemplateColumns: window.innerWidth < 600 
              ? '1fr' 
              : (window.innerWidth < 1024 ? '1fr 1fr' : '1fr 1fr 1fr 1fr'), 
            gap: '40px' 
          }}>
            {/* Colonne Coiffure */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta }}>
                Coiffeuses populaires
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes', 'Toulouse', 'Nice', 'Strasbourg'].map(city => (
                  <Link key={city} to={`/coiffure/${city.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>
                    {city}
                  </Link>
                ))}
              </div>
            </div>

            {/* Colonne Manucure */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta }}>
                Manucure & Ongles
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes', 'Toulouse', 'Nice', 'Strasbourg'].map(city => (
                  <Link key={city} to={`/manucure/${city.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>
                     {city}
                  </Link>
                ))}
              </div>
            </div>

            {/* Colonne Maquillage */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta }}>
                Maquillage Pro
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes', 'Toulouse', 'Nice', 'Strasbourg'].map(city => (
                  <Link key={city} to={`/maquillage/${city.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>
                     {city}
                  </Link>
                ))}
              </div>
            </div>

            {/* Colonne Cils */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: colors.terracotta }}>
                Extensions de cils
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes', 'Toulouse', 'Nice', 'Strasbourg'].map(city => (
                  <Link key={city} to={`/cils/${city.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>
                     {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION FAQ (Questions Fréquentes) --- */}
      <section style={{ 
        padding: isMobile ? '60px 20px' : '100px 20px', 
        backgroundColor: colors.porcelain 
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ 
            fontSize: isMobile ? '2rem' : '2.8rem', 
            fontWeight: '800', 
            textAlign: 'center', 
            marginBottom: '50px', 
            color: colors.black 
          }}>
            Les questions fréquentes
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              {
                q: "Qu'est-ce que NappyBooking ?",
                a: "NappyBooking est la plateforme de référence en France pour la beauté afro. Elle permet de connecter les clients avec des professionnels experts en cheveux crépus, frisés, bouclés, ainsi qu'en soins esthétiques spécialisés."
              },
              {
                q: "Comment prendre rendez-vous sur NappyBooking ?",
                a: "C'est très simple : recherchez une prestation ou un salon, choisissez votre créneau dans l'agenda en temps réel du partenaire, et validez. Vous recevrez une confirmation immédiate par email."
              },
              {
                q: "Est-ce que je dois payer en ligne sur NappyBooking ?",
                a: "Oui, le paiement d'un acompte est nécessaire pour confirmer votre réservation. Cet acompte garantit votre créneau avec la professionnelle et sera déduit du montant total le jour de votre prestation au salon."
              },
              {
                q: "Comment gérer mes rendez-vous sur NappyBooking ?",
                a: "Depuis votre espace client, vous pouvez consulter vos rendez-vous à venir, les déplacer ou les annuler (selon les conditions d'annulation du salon choisi)."
              },
              {
                q: "Comment faire apparaître mon salon sur NappyBooking ?",
                a: "Cliquez sur le bouton 'Devenir Partenaire'. Remplissez le formulaire et notre équipe vous contactera pour configurer votre agenda professionnel et booster votre visibilité."
              }
            ].map((faq, index) => (
              <div key={index} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '25px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: colors.black,
                    outline: 'none'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{faq.q}</span>
                  <svg 
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ 
                      transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.3s ease',
                      color: colors.terracotta
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                <div style={{
                  maxHeight: openFaqIndex === index ? '200px' : '0',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: openFaqIndex === index ? 1 : 0
                }}>
                  <p style={{ 
                    paddingBottom: '25px', 
                    color: '#666', 
                    lineHeight: '1.6',
                    fontSize: '1rem' 
                  }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
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
  )
}

export default Home;
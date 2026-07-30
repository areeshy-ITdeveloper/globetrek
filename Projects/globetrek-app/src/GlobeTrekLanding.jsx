import React, { useState, useEffect } from 'react'; 
import './GlobeTrekLanding.css';
import { useNavigate, useLocation } from 'react-router-dom'; 

import logo from "./assets/logo.png";
import hero1 from "./assets/hero1.jpg";
import hero2 from "./assets/hero2.jpg";
import hero3 from "./assets/hero3.jpg";
import dashboardMockup from "./assets/dashboardMockup.png";

export default function GlobeTrekLanding() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activities, setActivities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPreviewDay, setSelectedPreviewDay] = useState(null);

  const heroImages = [hero1, hero2, hero3];

  // Securely load dynamic plans from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem('globetrek_activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, [selectedPreviewDay]);

  const existingDays = Array.from(new Set(activities.map((act) => act.day))).sort((a, b) => Number(a) - Number(b));

  // Background Slider Engine
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Pure Smooth Scrolling Engine for Page Section IDs (Fixes hash conflicts)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      
      // If it's a structural element on the page, scroll smoothly to it
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); 
      }
    }
  }, [location.hash]);

  const handleScroll = (sectionId) => {
    if (sectionId === 'hero-or-planner') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/'); 
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      navigate(`/#${sectionId}`); 
    }
  };

  // Filter conditions securely
  const modalActivities = activities.filter(act => Number(act.day) === Number(selectedPreviewDay));
  const modalDayBudget = modalActivities.reduce((sum, act) => sum + Number(act.cost), 0);

  return (
    <div className="gt-landing-wrapper" style={{ position: 'relative' }}>
      
      {/* HEADER NAVBAR */}
      <header className="gt-header">
        <div className="gt-logo-area" onClick={() => handleScroll('hero-or-planner')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="GlobeTrek Logo" className="gt-logo-img" />
          <span className="gt-logo-text">GlobeTrek Itinerary Planner</span>
        </div>

        <nav className="gt-nav">
          <a className={`gt-nav-link ${location.hash === '#features' ? 'active-link' : ''}`} onClick={() => handleScroll('features')}>
            Features <span className="gt-nav-arrow">▼</span>
          </a>
          <a className={`gt-nav-link ${location.hash === '#how-it-works' ? 'active-link' : ''}`} onClick={() => handleScroll('how-it-works')}>
            How it works <span className="gt-nav-arrow">▼</span>
          </a>
          
          {/* PLANNED ACTIVITIES DROPDOWN */}
          <div 
            className="gt-dropdown-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <a className={`gt-nav-link planned-trigger ${selectedPreviewDay ? 'active-link' : ''}`}>
              Planned Activities <span className="gt-nav-arrow">▼</span>
            </a>
            
            {showDropdown && (
              <div className="gt-header-dropdown">
                {existingDays.length === 0 ? (
                  <span className="gt-dropdown-item empty-state">No active plans</span>
                ) : (
                  existingDays.map((dayNum) => (
                    <button 
                      key={dayNum} 
                      className="gt-dropdown-item-btn"
                      onClick={() => {
                        setSelectedPreviewDay(Number(dayNum));
                        setShowDropdown(false);
                      }}
                    >
                      📅 Day {dayNum} Overview
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>

        <button className="gt-btn-start" onClick={() => navigate('/planner')}>
          Start Planning
        </button>
      </header>

      {/* HERO SECTION */}
      <main className="gt-hero-container">
        <div className="gt-hero-background" style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }} />
        <div className="gt-hero-content">
          <h1 className="gt-hero-title">
            Design seamless journeys with the world’s most intuitive and interactive visual travel planner
          </h1>
          <p className="gt-hero-subtitle">
            “No sign-ups required. Map your adventure and track budgets instantly”
          </p>
          <button className="gt-btn-cta" onClick={() => navigate('/planner')}>
            Build Your Itinerary Now <span>➔</span>
          </button>
        </div>
      </main>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="gt-workflow-section">
        <h2 className="gt-workflow-heading">How GlobeTrek Works?</h2>
        <div className="gt-workflow-container">
          <div className="gt-workflow-text-block">
            <p className="gt-workflow-description">
              Simply enter your activity name, timing, and ticket price in the <strong>Control Panel</strong> on the left.
            </p>
            <p className="gt-workflow-description">
              Once added, watch your trip come to life on our unique <strong>S-shaped Interactive Timeline</strong>, where your daily itineraries connect seamlessly like a real journey while the <strong>Live Budget Estimator</strong> tracks and updates your total expenses in real-time.
            </p>
          </div>

          <div className="gt-workflow-image-block">
            <div className="gt-mockup-wrapper">
              <img src={dashboardMockup} alt="GlobeTrek App Dashboard Mockup" className="gt-dashboard-img" />
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURES SECTION */}
      <section id="features" className="gt-features-section">
        <h2 className="gt-features-title">Interactive Core Features</h2>
        <div className="gt-features-pathway">
          {/* ROW 1: TIMELINE */}
          <div className="gt-feature-flow-row">
            <div className="gt-feature-content-side">
              <div className="gt-feature-portal-circle ring-accent-green">
                <div className="mock-mini-box">
                  <div style={{ fontSize: '32px', marginBottom: '4px' }}>🗺️</div>
                  <div className="mock-mini-title" style={{ color: '#047857' }}>S-Timeline</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>Day 1 → Day 2 → Day 3</div>
                </div>
              </div>
              <h3 className="gt-feature-label-text">S-Shaped Interactive Timeline</h3>
            </div>
            <div className="gt-feature-space-balancer" />
            <div className="gt-horizontal-curve-wire" />
          </div>

          {/* ROW 2: QUICK NAV */}
          <div className="gt-feature-flow-row">
            <div className="gt-feature-content-side">
              <div className="gt-feature-portal-circle ring-accent-yellow">
                <div className="mock-mini-box">
                  <div className="mock-mini-title" style={{ fontSize: '10px', color: '#475569', marginBottom: '8px' }}>
                    Your Saved Days
                  </div>
                  <div className="mock-day-pill active-pill">
                    <span>📅 Day 1 Overview</span>
                  </div>
                  <div className="mock-day-pill">
                    <span>📅 Day 2 Overview</span>
                  </div>
                </div>
              </div>
              <h3 className="gt-feature-label-text">Saved Days Quick Navigator</h3>
            </div>
            <div className="gt-feature-space-balancer" />
            <div className="gt-horizontal-curve-wire" />
          </div>

          {/* ROW 3: BUDGET */}
          <div className="gt-feature-flow-row">
            <div className="gt-feature-content-side">
              <div className="gt-feature-portal-circle ring-accent-orange">
                <div className="mock-mini-box">
                  <div className="mock-mini-title">Live Budget Estimator</div>
                  <div className="mock-mini-value">$280</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Total Estimated Budget</div>
                </div>
              </div>
              <h3 className="gt-feature-label-text">Instant Budget Estimator</h3>
            </div>
            <div className="gt-feature-space-balancer" />
          </div>
        </div>
      </section>

      {/* FOOTER & CTA BANNER */}
      <div className="gt-footer-wrapper">
        <div className="gt-cta-container">
          <h2 className="gt-cta-title">Ready to experience the future of travel planning?</h2>
          <button className="gt-cta-btn" onClick={() => navigate('/planner')}>
            Get Started for free →
          </button>
          <p className="gt-cta-subtitle">No credit card needed. Its Free Forever</p>
        </div>

        <footer className="gt-main-footer-card">
          <div className="gt-footer-columns-grid">
            <div className="gt-footer-col">
              <h4>Features</h4>
              <span onClick={() => handleScroll('how-it-works')}>Mapping</span>
              <span onClick={() => handleScroll('features')}>Budgeting</span>
              <span onClick={() => handleScroll('features')}>Scheduling</span>
              <span onClick={() => handleScroll('features')}>Validating</span>
              <span onClick={() => handleScroll('features')}>Previewing</span>
              <span onClick={() => handleScroll('features')}>Persisting</span>
            </div>

            <div className="gt-footer-col">
              <h4>Made For</h4>
              <span>Solo Travellers & Backpackers</span>
              <span>Social Media Influencers & Content Creators</span>
              <span>Budget-Conscious Explorers</span>
              <span>Visual Thinkers</span>
            </div>

            <div className="gt-footer-col">
              <h4>Support</h4>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/help')}>Help Center</span>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/contact')}>Contact us</span>
            </div>
          </div>

          <div className="gt-footer-bottom-row">
            <div className="gt-footer-brand-meta">
              <img src={logo} alt="GlobeTrek Branded Logo" className="gt-footer-logo-img" />
              <span className="gt-footer-brand-name">GlobeTrek Itinerary Planner</span>
            </div>
            <div className="gt-footer-copyright">
              Copyright ©2026 GlobeTrek | Designed & Engineered By Areesha Asmat
            </div>
          </div>
        </footer>
      </div>

      {/* 🌟 FIXED INJECTED MODAL LAYER (Independent of Hash Loops) */}
      {selectedPreviewDay !== null && (
        <div className="gt-modal-overlay" onClick={() => setSelectedPreviewDay(null)}>
          <div className="gt-mini-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gt-modal-header">
              <h3>🗓️ Day {selectedPreviewDay} Summary</h3>
              <button className="gt-modal-close-btn" onClick={() => setSelectedPreviewDay(null)}>×</button>
            </div>
            
            <div className="gt-modal-budget-badge">
              <span>Day Budget: <strong>${modalDayBudget}</strong></span>
            </div>

            <div className="gt-modal-body-list">
              {modalActivities.length === 0 ? (
                <div className="gt-modal-empty-msg" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  No activities mapped for this day yet.
                </div>
              ) : (
                modalActivities.map((act) => (
                  <div key={act.id} className="gt-modal-activity-row">
                    <div className="gt-modal-row-left">
                      <span className="gt-modal-act-time">⏰ {act.time}</span>
                      <span className="gt-modal-act-title">{act.title}</span>
                      {act.desc && <p className="gt-modal-act-desc">{act.desc}</p>}
                    </div>
                    <span className="gt-modal-act-cost">${act.cost}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
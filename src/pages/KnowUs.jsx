import Header from '../components/Header';
import './KnowUs.css';

export default function KnowUs() {
  return (
    <div className="know-us-page">
      <Header />
      
      <section className="know-hero">
        <h1 className="hero-title">BEYOND THE FABRIC.</h1>
        <p className="hero-subtitle">Est. 2024 | Gurugram, India</p>
      </section>

      <section className="know-content">
        <div className="know-grid">
          <div className="know-text">
            <h2>OUR STORY</h2>
            <p>
              SwiftStyle was born out of a simple realization: the fashion industry is ready for its next evolution. 
              Founded in 2024 by <strong>Anika Bisht</strong> and <strong>Sanjana Gupta</strong>, our mission is to 
              bridge the gap between digital creativity and physical craftsmanship.
            </p>
            <p>
              We believe that every individual deserves a garment that is as unique as their story. 
              By combining cutting-edge 3D visualization with artisan manufacturing, we provide a 
              platform where you are the designer, and we are the builders.
            </p>
          </div>
          <div className="know-stats">
            <div className="stat-item">
              <h3>2024</h3>
              <p>Founded</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>Custom Made</p>
            </div>
            <div className="stat-item">
              <h3>0%</h3>
              <p>Inventory Waste</p>
            </div>
          </div>
        </div>
      </section>

      <section className="founders-section">
        <h2>MEET THE FOUNDERS</h2>
        <div className="founders-grid">
          <div className="founder-card">
            <div className="founder-info">
              <h3>Anika Bisht</h3>
              <p>Visionary & Tech Lead</p>
            </div>
          </div>
          <div className="founder-card">
            <div className="founder-info">
              <h3>Sanjana Gupta</h3>
              <p>Design & Operations Lead</p>
            </div>
          </div>
        </div>
      </section>

      <section className="social-connect">
        <h2>JOIN THE MOVEMENT</h2>
        <div className="social-links">
          <a href="https://instagram.com/swiftstyle" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          <a href="https://linkedin.com/company/swiftstyle" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href="https://twitter.com/swiftstyle" target="_blank" rel="noopener noreferrer">TWITTER</a>
        </div>
      </section>

      <footer className="know-footer">
        <span className="brand-logo">SWIFTSTYLE.</span>
        <p>© 2026 SwiftStyle. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

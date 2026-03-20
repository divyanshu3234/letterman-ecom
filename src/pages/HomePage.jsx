import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { PRODUCTS } from '../constants/products';
import './HomePage.css';



export default function HomePage() {
  const featured = PRODUCTS[0];

  return (
    <div className="home-page">
      <Header />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">Three clicks. One Jacket.</p>
          <h1 className="hero-headline">YOUR<br/>SIGNATURE<br/>STYLE.</h1>
          <Link to="/collection" className="btn btn-primary hero-cta">
            Start Designing <span>→</span>
          </Link>
        </div>

        <div className="hero-video-frame">
          <div className="video-box">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="hero-video-player"
            >
              <source src="/video/landing.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay-final"></div>
          </div>
          <div className="hero-3d-label">
            <span className="label-big">100% CUSTOM</span>
            <span className="label-sub">Every detail, your way</span>
          </div>
        </div>
      </section>

      {/* ── EMOTIONAL STATEMENT ──────────────────────── */}
      <section className="statement-section">
        <div className="statement-left">
          <p className="statement-tag">Real-time 3D · Instant pricing · Runway preview · Direct to factory</p>
          <p className="statement-year">Since 2024 – 2026</p>
        </div>
        <div className="statement-right">
          <h2>DESIGN YOURS</h2>
          <h2 className="accent-line">OWN IT PROUDLY</h2>
        </div>
      </section>

      {/* ── PROCESS STRIP ────────────────────────────── */}
      <section className="process-strip">
        {[
          { num: '01', title: 'Browse', desc: 'Explore our jacket & hoodie collections' },
          { num: '02', title: 'Customize', desc: 'Design every detail in 3D real-time' },
          { num: '03', title: 'Preview', desc: 'Watch your design walk the runway' },
          { num: '04', title: 'Own It', desc: 'Direct to factory, made just for you' },
        ].map(step => (
          <div key={step.num} className="process-step">
            <span className="process-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </section>

      {/* ── NAV BAND ─────────────────────────────────── */}
      <nav className="nav-band" aria-label="Category navigation">
        {['Jackets', 'Hoodies', 'Materials', 'Endurance Collection', 'Search designs'].map(item => (
          <Link key={item} to="/collection" className="nav-band-link">{item}</Link>
        ))}
      </nav>

      {/* ── FEATURED PRODUCT CARD ────────────────────── */}
      <section className="featured-section">
        <div className="featured-specs">
          <p className="text-secondary uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>Deep wool melton · Full-grain leather · Precision stitching</p>
        </div>
        <div className="featured-card">
          <div className="featured-img-wrap">
            <img src={featured.thumbnail} alt={featured.name} className="featured-img" />
          </div>
          <div className="featured-info">
            <span className="badge">VARSITY LEGACY EDITION</span>
            <h2 className="featured-title">{featured.shortName}</h2>
            <p className="featured-desc">Fully customizable</p>
            <p className="price-main">From ${featured.basePrice}</p>
            <Link to={`/product/${featured.id}`} className="btn btn-primary">
              DESIGN NOW →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="home-footer">
        <span className="brand-logo" style={{fontFamily:'Oswald',fontSize:'1.2rem',fontWeight:700,letterSpacing:'0.06em'}}>SWIFTSTYLE.</span>
        <p style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>© 2026 SwiftStyle. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

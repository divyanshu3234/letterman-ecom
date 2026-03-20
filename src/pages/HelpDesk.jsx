import Header from '../components/Header';
import './HelpDesk.css';

export default function HelpDesk() {
  const faqs = [
    { q: 'How long does shipping take?', a: 'All our garments are made-to-order. Production takes 2-3 days, and shipping typically takes 3-5 business days depending on your location.' },
    { q: 'What is your return policy?', a: 'Since each item is custom-made just for you, we cannot accept returns for change of mind. However, if there is a manufacturing defect or sizing issue from our end, we offer a 14-day replacement guarantee.' },
    { q: 'Are your materials sustainable?', a: 'Yes. We use GOTS-certified organic cotton for our hoodies and ethically sourced wool and leather for our jackets. We operate on a zero-inventory model to minimize waste.' },
    { q: 'Can I change my design after ordering?', a: 'We allow a 12-hour window after order placement for any design changes. Once the production process starts, we cannot make modifications.' }
  ];

  return (
    <div className="help-desk-page">
      <Header />
      
      <section className="help-hero">
        <h1>HELP DESK.</h1>
        <p>Support, Sizing, and FAQ</p>
      </section>

      <div className="help-container">
        <aside className="help-sidebar">
          <nav>
            <a href="#faq">FAQ</a>
            <a href="#sizing">Size Guide</a>
            <a href="#shipping">Shipping & Returns</a>
            <a href="#contact">Contact Us</a>
          </nav>
        </aside>

        <main className="help-main">
          <section id="faq" className="help-section">
            <h2>FREQUENTLY ASKED QUESTIONS</h2>
            <div className="faq-grid">
              {faqs.map((item, i) => (
                <div key={i} className="faq-item">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="sizing" className="help-section">
            <h2>SIZE GUIDE</h2>
            <div className="sizing-table-wrap">
              <table className="sizing-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (in)</th>
                    <th>Shoulder (in)</th>
                    <th>Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size, idx) => (
                    <tr key={size}>
                      <td>{size}</td>
                      <td>{36 + idx * 2}</td>
                      <td>{16 + idx * 0.5}</td>
                      <td>{25 + idx * 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sizing-note">All measurements are in inches. Our jackets have a tailored fit; if you prefer a relaxed look, size up.</p>
          </section>

          <section id="contact" className="help-section contact-card">
            <h2>NEED LIVE SUPPORT?</h2>
            <p>Our team is available Mon-Fri, 9am - 6pm IST.</p>
            <div className="contact-methods">
              <div className="method">
                <span className="method-label">Email</span>
                <span className="method-value">support@swiftstyle.com</span>
              </div>
              <div className="method">
                <span className="method-label">WhatsApp</span>
                <span className="method-value">+91 98765 43210</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{marginTop:'30px'}}>START LIVE CHAT</button>
          </section>
        </main>
      </div>

      <footer className="help-footer">
        <span className="brand-logo">SWIFTSTYLE.</span>
        <p>© 2026 SwiftStyle. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

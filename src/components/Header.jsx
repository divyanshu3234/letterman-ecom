import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useCustomStore from '../store/useCustomStore';
import './Header.css';

export default function Header({ variant = 'default' }) {
  const cartItems = useCustomStore(s => s.cartItems);
  const totalQty  = cartItems.reduce((s, i) => s + i.qty, 0);
  const location  = useLocation();
  const [showCollections, setShowCollections] = useState(false);

  const navLinks = [
    { label: 'Helpdesk',   to: '/helpdesk'   },
    { label: 'Know Us',    to: '/know-us'     },
  ];

  return (
    <header className={`site-header ${variant === 'dark' ? 'header-dark' : ''}`}>
      <Link to="/" className="brand-logo">SWIFTSTYLE.</Link>

      <nav className="site-nav" aria-label="Main navigation">
        <div className="nav-item-wrapper" 
             style={{ position: 'relative', zIndex: 110 }}
             onMouseEnter={() => setShowCollections(true)} 
             onMouseLeave={() => setShowCollections(false)}>
          <button className={`nav-link collections-trigger ${showCollections ? 'active' : ''}`}>
            Collections
          </button>
          
          {showCollections && (
            <div className="collections-mega-popup">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Men</h4>
                  <Link to="/collection?gender=men&cat=jacket">Jackets</Link>
                  <Link to="/collection?gender=men&cat=hoodie">Hoodies</Link>
                </div>
                <div className="mega-col">
                  <h4>Women</h4>
                  <Link to="/collection?gender=women&cat=jacket">Jackets</Link>
                  <Link to="/collection?gender=women&cat=hoodie">Hoodies</Link>
                </div>
                <div className="mega-col">
                  <h4>Kids</h4>
                  <Link to="/collection?gender=kids&cat=jacket">Jackets</Link>
                  <Link to="/collection?gender=kids&cat=hoodie">Hoodies</Link>
                  <div className="kids-ages">
                    <span>Ages: 2-5 | 6-10 | 11-14</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link to="/cart" className="cart-btn" aria-label={`Cart, ${totalQty} items`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
      </Link>
    </header>
  );
}

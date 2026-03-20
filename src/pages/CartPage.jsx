import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import useCustomStore from '../store/useCustomStore';
import './CartPage.css';

/* ════════════════════════════════════════════════════════════
   CART LINE ITEM
════════════════════════════════════════════════════════════ */
function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCustomStore();

  const bodyColor   = item.selections?.body?.color   || '#111';
  const sleeveColor = item.selections?.sleeveLeft?.color || '#0a0';

  return (
    <div className="cart-item">
      {/* Thumbnail — SVG jacket preview */}
      <div className="cart-item-thumb" style={{ background: '#1a1a1a' }}>
        <svg viewBox="0 0 80 100" className="cart-thumb-svg" aria-hidden="true">
          <rect x="18" y="22" width="44" height="62" rx="2" fill={bodyColor} />
          <rect x="2"  y="23" width="18" height="42" rx="2" fill={sleeveColor} transform="rotate(-5,11,23)" />
          <rect x="60" y="23" width="18" height="42" rx="2" fill={sleeveColor} transform="rotate(5,69,23)" />
          <path d="M32 22 Q40 15 48 22 L46 30 Q40 25 34 30 Z" fill={item.selections?.collar?.color || bodyColor} />
          <rect x="38" y="26" width="2" height="54" fill="#888" opacity="0.6" />
          <rect x="18" y="42" width="44" height="3" fill="#FF4D00" opacity="0.45" />
        </svg>
      </div>

      {/* Info */}
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.product?.shortName || 'Custom Jacket'}</h3>
        <p className="cart-item-detail text-secondary">
          {item.selections?.body?.material?.replace(/-/g,' ')} · Size {item.selections?.size || 'M'}
        </p>
        {item.addOns?.length > 0 && (
          <ul className="cart-item-addons">
            {item.addOns.map((a, i) => (
              <li key={i} className="text-secondary">+ {a.label} <span className="text-accent">+${a.price}</span></li>
            ))}
          </ul>
        )}
      </div>

      {/* Qty + Price */}
      <div className="cart-item-controls">
        <div className="qty-row">
          <button
            className="qty-btn"
            onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)}
            aria-label="Decrease quantity"
          >−</button>
          <span className="qty-val">{item.qty}</span>
          <button
            className="qty-btn"
            onClick={() => updateQty(item.id, item.qty + 1)}
            aria-label="Increase quantity"
          >+</button>
        </div>
        <p className="cart-item-total">${(item.total * item.qty).toLocaleString()}</p>
        <button
          className="cart-remove-btn"
          onClick={() => removeFromCart(item.id)}
          aria-label="Remove item"
        >REMOVE</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CHECKOUT FORM
════════════════════════════════════════════════════════════ */
function CheckoutForm({ grandTotal, onSuccess }) {
  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', zip: '', country: 'US',
    card: '', expiry: '', cvv: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]     = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.address.trim()) e.address  = 'Required';
    if (!form.city.trim())    e.city     = 'Required';
    if (!form.zip.match(/^\d{4,10}$/)) e.zip = 'Valid zip required';
    if (!form.card.replace(/\s/g,'').match(/^\d{16}$/)) e.card = '16-digit card number';
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'MM/YY';
    if (!form.cvv.match(/^\d{3,4}$/)) e.cvv = '3-4 digits';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
    onSuccess?.();
  };

  if (submitted) return (
    <div className="checkout-success animate-fade-in">
      <div className="success-icon">✓</div>
      <h2>ORDER CONFIRMED</h2>
      <p className="text-secondary">We've received your order for <strong>${grandTotal.toLocaleString()}</strong>. Expect a confirmation email shortly.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>BACK TO HOME</Link>
    </div>
  );

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h3 className="checkout-section-title">SHIPPING</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="co-name">Full Name</label>
          <input id="co-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="co-email">Email</label>
          <input id="co-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="co-addr">Address</label>
        <input id="co-addr" value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Runway Ave" />
        {errors.address && <span className="form-error">{errors.address}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="co-city">City</label>
          <input id="co-city" value={form.city} onChange={e => set('city', e.target.value)} placeholder="New York" />
          {errors.city && <span className="form-error">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="co-zip">ZIP / Postal</label>
          <input id="co-zip" value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="10001" />
          {errors.zip && <span className="form-error">{errors.zip}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="co-country">Country</label>
          <select id="co-country" value={form.country} onChange={e => set('country', e.target.value)}>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
          </select>
        </div>
      </div>

      <div className="divider" />
      <h3 className="checkout-section-title">PAYMENT</h3>
      <div className="form-group">
        <label htmlFor="co-card">Card Number</label>
        <input
          id="co-card"
          value={form.card}
          onChange={e => set('card', e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim())}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
        {errors.card && <span className="form-error">{errors.card}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="co-exp">Expiry (MM/YY)</label>
          <input
            id="co-exp"
            value={form.expiry}
            onChange={e => {
              let v = e.target.value.replace(/\D/g,'');
              if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
              set('expiry', v);
            }}
            placeholder="09/27"
            maxLength={5}
          />
          {errors.expiry && <span className="form-error">{errors.expiry}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="co-cvv">CVV</label>
          <input id="co-cvv" value={form.cvv} onChange={e => set('cvv', e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123" maxLength={4} />
          {errors.cvv && <span className="form-error">{errors.cvv}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 20, justifyContent: 'center', fontSize: '1rem' }}>
        PLACE ORDER · ${grandTotal.toLocaleString()}
      </button>
      <p className="checkout-secure text-secondary">🔒 Secured & encrypted checkout</p>
    </form>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN CART PAGE
════════════════════════════════════════════════════════════ */
export default function CartPage() {
  const cartItems = useCustomStore(s => s.cartItems);
  const navigate  = useNavigate();
  const [checkout, setCheckout] = useState(false);

  const grandTotal = cartItems.reduce((sum, i) => sum + i.total * i.qty, 0);
  const itemCount  = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">YOUR CART</h1>
          <span className="cart-count text-secondary">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty animate-fade-in">
            <div className="cart-empty-icon">🧥</div>
            <h2>Your cart is empty</h2>
            <p className="text-secondary">Design something incredible and add it here.</p>
            <Link to="/collection" className="btn btn-primary" style={{ marginTop: 24 }}>
              BROWSE COLLECTION →
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* LEFT: Items + Checkout Form */}
            <div className="cart-left">
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {checkout && (
                <div className="checkout-section animate-fade-in">
                  <CheckoutForm grandTotal={grandTotal} />
                </div>
              )}
            </div>

            {/* RIGHT: Order Summary */}
            <div className="cart-summary card">
              <h3 className="summary-title">ORDER SUMMARY</h3>

              <div className="summary-lines">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-line">
                    <span className="text-secondary">{item.product?.shortName} ×{item.qty}</span>
                    <span>${(item.total * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="divider" style={{ margin: '16px 0' }} />

              <div className="summary-line">
                <span className="text-secondary">Shipping</span>
                <span className="text-accent">FREE</span>
              </div>
              <div className="summary-line">
                <span className="text-secondary">Tax (estimated)</span>
                <span>${Math.round(grandTotal * 0.08).toLocaleString()}</span>
              </div>

              <div className="divider" style={{ margin: '16px 0' }} />

              <div className="summary-total">
                <span>TOTAL</span>
                <span className="text-accent">${(grandTotal + Math.round(grandTotal * 0.08)).toLocaleString()}</span>
              </div>

              {!checkout ? (
                <button
                  className="btn btn-primary w-full"
                  style={{ marginTop: 24, justifyContent: 'center' }}
                  onClick={() => setCheckout(true)}
                >
                  PROCEED TO CHECKOUT →
                </button>
              ) : (
                <button
                  className="btn btn-secondary w-full"
                  style={{ marginTop: 24, justifyContent: 'center' }}
                  onClick={() => setCheckout(false)}
                >
                  ← EDIT CART
                </button>
              )}

              <button
                className="btn-text"
                style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: 12 }}
                onClick={() => navigate('/collection')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

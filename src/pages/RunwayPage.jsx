import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import useCustomStore from '../store/useCustomStore';
import './RunwayPage.css';

/* ════════════════════════════════════════════════════════════
   5-ACT RUNWAY SCENE DEFINITIONS
════════════════════════════════════════════════════════════ */
const ACTS = [
  {
    id: 1,
    title: 'THE ENTRANCE',
    subtitle: 'A presence that commands the room',
    accent: 'ACT I',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a0800 100%)',
    spotlightColor: 'rgba(255,77,0,0.18)',
  },
  {
    id: 2,
    title: 'THE TURN',
    subtitle: 'Every angle. Perfected.',
    accent: 'ACT II',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #001a0a 100%)',
    spotlightColor: 'rgba(255,77,0,0.12)',
  },
  {
    id: 3,
    title: 'THE DETAIL',
    subtitle: 'Craftsmanship at every stitch',
    accent: 'ACT III',
    bg: 'linear-gradient(135deg, #0a0a14 0%, #14001a 100%)',
    spotlightColor: 'rgba(255,77,0,0.22)',
  },
  {
    id: 4,
    title: 'THE STATEMENT',
    subtitle: 'Bold. Unapologetic. Yours.',
    accent: 'ACT IV',
    bg: 'linear-gradient(135deg, #0a0000 0%, #1a0a00 100%)',
    spotlightColor: 'rgba(255,77,0,0.30)',
  },
  {
    id: 5,
    title: 'YOURS FOREVER',
    subtitle: 'Design made. Story begun.',
    accent: 'ACT V',
    bg: 'linear-gradient(135deg, #121212 0%, #0d0d0d 100%)',
    spotlightColor: 'rgba(255,77,0,0.15)',
  },
];

/* ════════════════════════════════════════════════════════════
   RUNWAY JACKET — CSS/3D animated silhouette
════════════════════════════════════════════════════════════ */
function RunwayJacket({ actId, selections }) {
  const bodyColor   = selections?.body?.color   || '#111111';
  const sleeveColor = selections?.sleeveLeft?.color || '#0a0a0a';
  const jacketRef   = useRef();

  useEffect(() => {
    if (!jacketRef.current) return;
    const el = jacketRef.current;
    // Each act gets its own motion
    const timelines = [
      () => gsap.fromTo(el, { x: -120, opacity: 0, rotateY: -25 }, { x: 0, opacity: 1, rotateY: 0, duration: 1.1, ease: 'power3.out' }),
      () => gsap.fromTo(el, { rotateY: 0 }, { rotateY: 360, duration: 2, ease: 'power1.inOut' }),
      () => gsap.fromTo(el, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: 'back.out(1.4)' }),
      () => gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out' }),
      () => gsap.fromTo(el, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'sine.out' }),
    ];
    const tl = timelines[actId - 1];
    if (tl) tl();
  }, [actId]);

  return (
    <div className="runway-jacket-wrap" ref={jacketRef} style={{ perspective: '800px' }}>
      <svg viewBox="0 0 200 260" className="runway-jacket-svg" aria-hidden="true">
        {/* Body */}
        <rect x="50" y="60" width="100" height="150" rx="4"
          fill={bodyColor} stroke="#2a2a2a" strokeWidth="1" />
        {/* Left sleeve */}
        <rect x="10" y="62" width="42" height="100" rx="3"
          fill={sleeveColor} stroke="#2a2a2a" strokeWidth="1"
          transform="rotate(-6, 31, 62)" />
        {/* Right sleeve */}
        <rect x="148" y="62" width="42" height="100" rx="3"
          fill={sleeveColor} stroke="#2a2a2a" strokeWidth="1"
          transform="rotate(6, 169, 62)" />
        {/* Collar */}
        <path d="M80 60 Q100 45 120 60 L115 75 Q100 65 85 75 Z"
          fill={selections?.collar?.color || bodyColor} />
        {/* Zipper */}
        <rect x="98" y="68" width="4" height="130" rx="1"
          fill={selections?.closure?.zipperColor || '#888'} opacity="0.7" />
        {/* Chest stripe accent */}
        <rect x="50" y="110" width="100" height="5" rx="1"
          fill="#FF4D00" opacity="0.5" />
        {/* Chest pocket */}
        <rect x="56" y="88" width="28" height="18" rx="2"
          fill="none" stroke={sleeveColor} strokeWidth="1.2" opacity="0.6" />
        {/* Lower pockets */}
        <rect x="56" y="148" width="34" height="24" rx="2"
          fill="none" stroke={sleeveColor} strokeWidth="1.2" opacity="0.5" />
        <rect x="110" y="148" width="34" height="24" rx="2"
          fill="none" stroke={sleeveColor} strokeWidth="1.2" opacity="0.5" />
        {/* Hem */}
        <rect x="50" y="203" width="100" height="7" rx="2"
          fill={bodyColor} stroke="#3a3a3a" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN RUNWAY PAGE
════════════════════════════════════════════════════════════ */
export default function RunwayPage() {
  const navigate   = useNavigate();
  const selections = useCustomStore(s => s.selections);
  const product    = useCustomStore(s => s.currentProduct);

  const [act, setAct]         = useState(1);
  const [playing, setPlaying] = useState(true);
  const [exiting, setExiting] = useState(false);
  const sceneRef              = useRef();
  const timerRef              = useRef();

  const goToAct = useCallback((n) => {
    setAct(n);
  }, []);

  /* Auto-advance every 3 s while playing */
  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setAct(a => {
        if (a < ACTS.length) return a + 1;
        setPlaying(false);
        return a;
      });
    }, 3000);
    return () => clearTimeout(timerRef.current);
  }, [act, playing]);

  /* Scene enter animation */
  useEffect(() => {
    if (!sceneRef.current) return;
    gsap.fromTo(
      sceneRef.current.querySelector('.runway-text-block'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3 }
    );
  }, [act]);

  /* Keyboard: Escape exits, ArrowRight/Left navigate */
  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape') handleExit();
      if (e.key === 'ArrowRight') setAct(a => Math.min(a + 1, ACTS.length));
      if (e.key === 'ArrowLeft')  setAct(a => Math.max(a - 1, 1));
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  function handleExit() {
    setExiting(true);
    setTimeout(() => navigate(-1), 500);
  }

  const currentAct = ACTS[act - 1];

  return (
    <div
      className={`runway-overlay ${exiting ? 'exiting' : ''}`}
      style={{ background: currentAct.bg }}
      ref={sceneRef}
      aria-label="Runway presentation"
      role="dialog"
    >
      {/* Spotlight glow */}
      <div
        className="runway-spotlight"
        style={{ background: `radial-gradient(ellipse 500px 600px at 50% 40%, ${currentAct.spotlightColor}, transparent 70%)` }}
      />

      {/* Top Bar */}
      <header className="runway-topbar">
        <span className="runway-brand">SWIFTSTYLE<span className="text-accent">.</span></span>
        <button
          className="runway-close-btn"
          onClick={handleExit}
          aria-label="Exit runway (Escape)"
        >
          ✕ EXIT
        </button>
      </header>

      {/* Center Stage */}
      <main className="runway-stage">
        <RunwayJacket actId={act} selections={selections} />

        <div className="runway-text-block">
          <span className="runway-act-label">{currentAct.accent}</span>
          <h1 className="runway-title">{currentAct.title}</h1>
          <p className="runway-subtitle">{currentAct.subtitle}</p>
          {product && (
            <p className="runway-product-name text-secondary">{product.shortName}</p>
          )}
        </div>
      </main>

      {/* Scene Progress Indicator */}
      <nav className="runway-progress" aria-label="Scene navigation">
        {ACTS.map(a => (
          <button
            key={a.id}
            className={`runway-dot ${act === a.id ? 'active' : ''} ${a.id < act ? 'done' : ''}`}
            onClick={() => { setPlaying(false); goToAct(a.id); }}
            aria-label={`Scene ${a.id}: ${a.title}`}
            aria-current={act === a.id ? 'step' : undefined}
          >
            <span className="runway-dot-num">{a.id}</span>
          </button>
        ))}
      </nav>

      {/* Arrow Navigation */}
      <div className="runway-arrows">
        <button
          className="runway-arrow-btn"
          onClick={() => { setPlaying(false); setAct(a => Math.max(a - 1, 1)); }}
          disabled={act === 1}
          aria-label="Previous scene"
        >
          ←
        </button>
        <button
          className={`runway-play-btn ${playing ? 'active' : ''}`}
          onClick={() => { setPlaying(p => !p); }}
          aria-label={playing ? 'Pause sequence' : 'Play sequence'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          className="runway-arrow-btn"
          onClick={() => { setPlaying(false); setAct(a => Math.min(a + 1, ACTS.length)); }}
          disabled={act === ACTS.length}
          aria-label="Next scene"
        >
          →
        </button>
      </div>

      {/* Action Buttons */}
      <footer className="runway-footer">
        <button className="btn btn-ghost" onClick={handleExit} aria-label="Back to customizer">
          ← BACK TO CUSTOMIZER
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => window.print()}
          aria-label="Download / print"
        >
          ↓ DOWNLOAD 4K
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            navigator.share?.({
              title: `My ${product?.shortName || 'SwiftStyle'} Design`,
              text: 'Check out my custom jacket on SwiftStyle!',
              url: window.location.href,
            }).catch(() => {
              navigator.clipboard?.writeText(window.location.href);
            });
          }}
          aria-label="Share design"
        >
          ↗ SHARE
        </button>
      </footer>
    </div>
  );
}

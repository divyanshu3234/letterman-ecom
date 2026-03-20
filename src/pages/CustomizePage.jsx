import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import Header from '../components/Header';
import { getProductById } from '../constants/products';
import useCustomStore from '../store/useCustomStore';
import './CustomizePage.css';

/* ═══════════════════════════════════════════════════════════
   3D JACKET MODEL — Detailed geometry matching real jacket
═══════════════════════════════════════════════════════════ */
function JacketModel({ selections }) {
  const bodyRef      = useRef();
  const leftSleeveRef  = useRef();
  const rightSleeveRef = useRef();

  useEffect(() => {
    if (bodyRef.current)      bodyRef.current.color.set(selections.body.color);
    if (leftSleeveRef.current)  leftSleeveRef.current.color.set(selections.sleeveLeft.color);
    if (rightSleeveRef.current) rightSleeveRef.current.color.set(selections.sleeveRight.color);
  }, [selections]);

  const isLeather = (mat) => mat?.includes('leather');
  
  const bodyProps = {
    roughness: isLeather(selections.body.material) ? 0.35 : 0.85,
    metalness: isLeather(selections.body.material) ? 0.05 : 0,
    clearcoat: isLeather(selections.body.material) ? 0.4 : 0,
    sheen: isLeather(selections.body.material) ? 0 : 0.9,
    sheenColor: '#ffffff',
  };

  const sleeveProps = {
    roughness: isLeather(selections.sleeveLeft.material) ? 0.38 : 0.88,
    metalness: isLeather(selections.sleeveLeft.material) ? 0.04 : 0,
    clearcoat: isLeather(selections.sleeveLeft.material) ? 0.2 : 0,
    sheen: isLeather(selections.sleeveLeft.material) ? 0 : 0.9,
    sheenColor: '#ffffff',
  };

  return (
    <group position={[0, -0.4, 0]}>
      {/* ── CORE BODY (Segmented for Realism) ── */}
      <group>
        {/* Chest & Shoulders */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.78, 0.4, 12, 24]} />
          <meshPhysicalMaterial ref={bodyRef} color={selections.body.color} {...bodyProps} />
        </mesh>
        
        {/* Middle Torso (Slightly tapered) */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.72, 1.0, 32]} />
          <meshPhysicalMaterial color={selections.body.color} {...bodyProps} />
        </mesh>

        {/* Lower Torso / Waist */}
        <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.72, 0.76, 0.5, 32]} />
          <meshPhysicalMaterial color={selections.body.color} {...bodyProps} />
        </mesh>
      </group>

      {/* ── FRONT PLACKET / FASTENING ── */}
      <mesh position={[0, 0.6, 0.74]} castShadow>
        <boxGeometry args={[0.16, 1.7, 0.05]} />
        <meshPhysicalMaterial color={selections.body.color} {...bodyProps} />
      </mesh>

      {/* ── LEFT SLEEVE ── */}
      <group position={[-0.9, 0.9, 0]} rotation={[0, 0, 0.2]}>
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.26, 1.2, 12, 24]} />
          <meshPhysicalMaterial ref={leftSleeveRef} color={selections.sleeveLeft.color} {...sleeveProps} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 24]} />
          <meshPhysicalMaterial color={selections.body.color} roughness={0.9} sheen={1} />
        </mesh>
      </group>

      {/* ── RIGHT SLEEVE ── */}
      <group position={[0.9, 0.9, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.26, 1.2, 12, 24]} />
          <meshPhysicalMaterial ref={rightSleeveRef} color={selections.sleeveRight.color} {...sleeveProps} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 24]} />
          <meshPhysicalMaterial color={selections.body.color} roughness={0.9} sheen={1} />
        </mesh>
      </group>

      {/* ── COLLAR ── */}
      <mesh position={[0, 1.45, 0.05]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.28, 0.08, 16, 48, Math.PI * 1.4]} />
        <meshPhysicalMaterial color={selections.collar?.color || selections.body.color} roughness={0.9} sheen={1} />
      </mesh>

      {/* ── RIBBED HEM ── */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.76, 0.76, 0.2, 40]} />
        <meshPhysicalMaterial color={selections.body.color} roughness={0.9} sheen={1} />
      </mesh>

      {/* ── BUTTONS ── */}
      {[1.25, 0.9, 0.55, 0.2, -0.15].map((y, i) => (
        <mesh key={i} position={[0.04, y, 0.78]} rotation={[0,0,Math.PI/2]}>
          <sphereGeometry args={[0.045, 16, 16]} scale={[1, 0.4, 1]} />
          <meshPhysicalMaterial 
            color={selections.hardware?.buttonMaterial === 'brass' ? '#b8860b' : '#c0c0c0'} 
            metalness={1} roughness={0.05} clearcoat={1} 
          />
        </mesh>
      ))}

      {/* ── STITCHING DETAILS ── */}
      <group position={[0,0,0.76]}>
        {[1.3, 1.0, 0.7, 0.4, 0.1, -0.2].map((y, k) => (
          <mesh key={k} position={[-0.1, y, 0]} rotation={[0,0,Math.PI/2]}>
             <boxGeometry args={[0.04, 0.005, 0.002]} />
             <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function HoodieModel({ selections }) {
  const bodyRef = useRef();
  
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.color.set(selections.body.color);
  }, [selections]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* ── OVERSIZED BODY ── */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.85, 1.35, 12, 24]} />
        <meshPhysicalMaterial ref={bodyRef} color={selections.body.color} roughness={0.92} sheen={1} sheenColor="#fff" />
      </mesh>

      {/* ── HOOD ── */}
      <mesh position={[0, 1.15, -0.15]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial color={selections.hood?.liningColor || selections.body.color} roughness={0.95} side={2} />
      </mesh>

      {/* ── SLEEVES ── */}
      <group position={[-1, 0.45, 0]} rotation={[0, 0, 0.25]}>
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.32, 1.3, 8, 20]} />
          <meshPhysicalMaterial color={selections.sleeveLeft.color} roughness={0.92} sheen={1} />
        </mesh>
      </group>
      <group position={[1, 0.45, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.32, 1.3, 8, 20]} />
          <meshPhysicalMaterial color={selections.sleeveRight.color} roughness={0.92} sheen={1} />
        </mesh>
      </group>

      {/* ── KANGAROO POCKET ── */}
      <mesh position={[0, -0.4, 0.81]} rotation={[-0.08, 0, 0]}>
        <capsuleGeometry args={[0.45, 0.45, 4, 16]} scale={[1, 0.7, 0.1]} />
        <meshPhysicalMaterial color={selections.body.color} roughness={0.95} sheen={1} />
      </mesh>

      {/* ── HEM ── */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.86, 0.86, 0.22, 40]} />
        <meshPhysicalMaterial color={selections.body.color} roughness={0.9} sheen={1} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   VIEWER COMPONENT
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   VIEWER COMPONENT (Studio Lighting & Shadows)
═══════════════════════════════════════════════════════════ */
function Viewer3D({ product, selections }) {
  const [controlling, setControlling] = useState(false);

  return (
    <div
      className={`viewer-wrapper ${controlling ? 'controlling' : ''}`}
      onPointerDown={() => setControlling(true)}
      onPointerUp={() => setControlling(false)}
    >
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 35 }} 
        shadows 
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.2} />
        
        {/* Key Light (Stronger highlight) */}
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Rim Light (Highlights edges) */}
        <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#ffffff" />
        
        {/* Fill Light (Softens shadows) */}
        <pointLight position={[0, -2, 3]} intensity={0.4} color="#f0f0ff" />
        
        <Environment preset="studio" />

        {/* Realistic Contact Shadows */}
        <ContactShadows 
          position={[0, -1.2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />

        {product?.category === 'hoodie'
          ? <HoodieModel selections={selections} />
          : <JacketModel selections={selections} />
        }

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.5}
          maxDistance={5.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          enableDamping={true}
          dampingFactor={0.05}
          makeDefault 
        />
      </Canvas>
      <div className="viewer-hint">Drag to rotate · Scroll to zoom</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CUSTOMIZATION PANEL
═══════════════════════════════════════════════════════════ */
function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cust-section">
      <button className="section-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {title}
        <span className="section-chevron">{open ? '−' : '+'}</span>
      </button>
      <div className={`section-body ${open ? 'open' : ''}`}>
        <div className="section-body-inner">{children}</div>
      </div>
    </div>
  );
}

const COLORS_PALETTE = [
  '#111111','#FFFFFF','#1a2744','#8b1a1a','#2d4a2d','#c8a05a',
  '#6b1a2a','#f5e6d3','#4a4a2a','#2a4a7a','#808080','#5a1a1a',
  '#b8860b','#1a4a8a','#6b4e37','#f0ede8','#9a9a9a','#333333',
];

const JACKET_MATERIALS = [
  { id:'wool-melton',        label:'Wool Melton' },
  { id:'genuine-leather',   label:'Genuine Leather' },
  { id:'full-grain-leather',label:'Full-Grain Leather', extra:'+$40' },
  { id:'suede',             label:'Suede', extra:'+$25' },
  { id:'denim',             label:'Denim' },
  { id:'nylon',             label:'Nylon' },
  { id:'cotton-canvas',     label:'Cotton Canvas' },
  { id:'softshell',         label:'Softshell', extra:'+$15' },
];

const HOODIE_MATERIALS = [
  { id:'french-terry',  label:'French Terry' },
  { id:'fleece',        label:'Fleece' },
  { id:'sherpa',        label:'Sherpa', extra:'+$10' },
  { id:'merino-wool',   label:'Merino Wool', extra:'+$20' },
];

function SwatchPicker({ current, onChange, label }) {
  return (
    <div className="swatch-picker">
      {label && <span className="pdp-label" style={{marginBottom:8,display:'block'}}>{label}</span>}
      <div className="swatch-row">
        {COLORS_PALETTE.map(hex => (
          <button
            key={hex}
            className={`swatch ${current === hex ? 'selected' : ''}`}
            style={{ background: hex, border: hex === '#FFFFFF' || hex === '#f5e6d3' || hex === '#f0ede8' ? '1px solid #444' : undefined }}
            onClick={() => onChange(hex)}
            aria-label={hex}
          />
        ))}
      </div>
    </div>
  );
}

function MaterialPicker({ current, onChange, materials }) {
  return (
    <div className="material-picker">
      {materials.map(m => (
        <button
          key={m.id}
          className={`material-chip ${current === m.id ? 'active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          {m.label}
          {m.extra && <span className="material-price">{m.extra}</span>}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRICE BREAKDOWN
═══════════════════════════════════════════════════════════ */
function PriceBreakdown({ product }) {
  const addOns     = useCustomStore(s => s.addOns);
  const totalPrice = useCustomStore(s => s.totalPrice);
  const setRunwayOpen = useCustomStore(s => s.setRunwayOpen);
  const navigate      = useNavigate();

  if (!product) return null;

  return (
    <div className="price-breakdown card">
      <div className="price-breakdown-header">
        <span>PRICE BREAKDOWN</span>
        <span className="price-flash">${totalPrice}</span>
      </div>
      <div className="price-line-items">
        <div className="price-line">
          <span>Base</span>
          <span>${product?.basePrice || 0}</span>
        </div>
        {addOns.map((a, i) => (
          <div key={i} className="price-line addon">
            <span>{a.label}</span>
            <span className="text-accent">+${a.price}</span>
          </div>
        ))}
        <div className="divider" style={{ margin: '8px 0' }} />
        <div className="price-line total">
          <span>TOTAL</span>
          <span className="text-accent">${totalPrice}</span>
        </div>
      </div>
      <button
        className="btn btn-ghost runway-btn animate-pulse"
        onClick={() => { setRunwayOpen(true); navigate('/runway'); }}
      >
        ▶ RUNWAY PREVIEW
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CUSTOMIZE PAGE
═══════════════════════════════════════════════════════════ */
export default function CustomizePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = getProductById(id);
  
  // Specific selectors — avoids re-rendering when unrelated store parts change
  const selections     = useCustomStore(s => s.selections);
  const currentProduct = useCustomStore(s => s.currentProduct);
  const linkSleeves    = useCustomStore(s => s.linkSleeves);
  
  // Action refs — usually stable but better as selectors
  const initProduct    = useCustomStore(s => s.initProduct);
  const setColor       = useCustomStore(s => s.setColor);
  const setMaterial    = useCustomStore(s => s.setMaterial);
  const setSelection   = useCustomStore(s => s.setSelection);
  const setLinkSleeves = useCustomStore(s => s.setLinkSleeves);
  const addToCart      = useCustomStore(s => s.addToCart);

  useEffect(() => {
    if (product) {
      initProduct(product);
    }
  }, [id, product, initProduct]);

  if (!product) return <div style={{padding:'200px',textAlign:'center'}}><h2>Product not found</h2></div>;

  const materials = product.category === 'hoodie' ? HOODIE_MATERIALS : JACKET_MATERIALS;

  const handleAddToCart = () => {
    addToCart();
    navigate('/cart');
  };

  return (
    <div className="customize-page">
      <Header />

      {/* Page Header */}
      <div className="customize-topbar">
        <button className="btn-text" onClick={() => navigate(-1)} style={{display:'flex',alignItems:'center',gap:6}}>
          ← Back
        </button>
        <div>
          <span className="customize-prod-name">{product.shortName}</span>
          <span className="customize-prod-start"> · Starting at ${product.basePrice}</span>
        </div>
      </div>

      <div className="customize-layout">
        {/* ── LEFT: 3D VIEWER + PRICE ── */}
        <div className="customize-left">
          <Viewer3D product={currentProduct || product} selections={selections} />
          <PriceBreakdown product={currentProduct || product} />
        </div>

        {/* ── RIGHT: CUSTOMIZATION PANEL ── */}
        <div className="customize-panel">
          <h2 className="panel-title">CUSTOMIZE</h2>
          <div className="panel-scroll">

            {/* BODY */}
            <CollapsibleSection title="BODY" defaultOpen={true}>
              <SwatchPicker
                label="Color"
                current={selections.body.color}
                onChange={hex => setColor('body', hex)}
              />
              <div style={{marginTop:14}}>
                <span className="pdp-label" style={{display:'block',marginBottom:8}}>Material</span>
                <MaterialPicker
                  current={selections.body.material}
                  onChange={mat => setMaterial('body', mat)}
                  materials={materials}
                />
              </div>
            </CollapsibleSection>

            {/* SLEEVES */}
            <CollapsibleSection title="SLEEVES" defaultOpen={true}>
              <label className="link-toggle">
                <input type="checkbox" checked={linkSleeves} onChange={e => setLinkSleeves(e.target.checked)} />
                <span>Link Left &amp; Right</span>
              </label>
              <div className="sleeve-row">
                <div className="sleeve-col">
                  <SwatchPicker
                    label={linkSleeves ? 'Both Sleeves' : 'Left Sleeve'}
                    current={selections.sleeveLeft.color}
                    onChange={hex => setColor('sleeveLeft', hex)}
                  />
                </div>
                {!linkSleeves && (
                  <div className="sleeve-col">
                    <SwatchPicker
                      label="Right Sleeve"
                      current={selections.sleeveRight.color}
                      onChange={hex => setColor('sleeveRight', hex)}
                    />
                  </div>
                )}
              </div>
              <div style={{marginTop:12}}>
                <MaterialPicker
                  current={selections.sleeveLeft.material}
                  onChange={mat => setMaterial('sleeveLeft', mat)}
                  materials={materials}
                />
              </div>
            </CollapsibleSection>

            {/* COLLAR */}
            <CollapsibleSection title="COLLAR">
              <div style={{marginBottom:12}}>
                <span className="pdp-label" style={{display:'block',marginBottom:8}}>Style</span>
                <MaterialPicker
                  current={selections.collar?.style || 'ribbed'}
                  onChange={v => setSelection('collar','style',v)}
                  materials={[
                    {id:'ribbed',label:'Ribbed'},
                    {id:'stand',label:'Stand Collar'},
                    {id:'mandarin',label:'Mandarin'},
                    {id:'shawl',label:'Shawl'},
                  ]}
                />
              </div>
              <SwatchPicker
                label="Color"
                current={selections.collar?.color || selections.body.color}
                onChange={hex => setSelection('collar','color',hex)}
              />
            </CollapsibleSection>

            {/* CLOSURE */}
            <CollapsibleSection title="CLOSURE">
              <div style={{marginBottom:12}}>
                <span className="pdp-label" style={{display:'block',marginBottom:8}}>Type</span>
                <MaterialPicker
                  current={selections.closure.type}
                  onChange={v => setSelection('closure','type',v)}
                  materials={[
                    {id:'snap',label:'Snap Button'},
                    {id:'exposed',label:'Exposed YKK'},
                    {id:'hidden',label:'Hidden Zip',extra:'+$5'},
                    {id:'two-way',label:'Two-Way',extra:'+$8'},
                    {id:'waterproof',label:'Waterproof',extra:'+$10'},
                  ]}
                />
              </div>
              <SwatchPicker
                label="Zipper Color"
                current={selections.closure.zipperColor}
                onChange={hex => setSelection('closure','zipperColor',hex)}
              />
            </CollapsibleSection>

            {/* POCKETS */}
            <CollapsibleSection title="POCKETS">
              <MaterialPicker
                current={selections.pockets.style}
                onChange={v => setSelection('pockets','style',v)}
                materials={[
                  {id:'standard',label:'Side Pockets'},
                  {id:'cargo',label:'Cargo',extra:'+$8'},
                  {id:'zippered',label:'Zippered',extra:'+$6'},
                  {id:'hidden',label:'Hidden',extra:'+$5'},
                ]}
              />
            </CollapsibleSection>

            {/* HARDWARE */}
            <CollapsibleSection title="HARDWARE">
              <div style={{marginBottom:12}}>
                <span className="pdp-label" style={{display:'block',marginBottom:8}}>Button Metal</span>
                <MaterialPicker
                  current={selections.hardware.buttonMaterial}
                  onChange={v => setSelection('hardware','buttonMaterial',v)}
                  materials={[
                    {id:'plastic',label:'Plastic'},
                    {id:'brass',label:'Brass',extra:'+$6'},
                    {id:'silver',label:'Silver',extra:'+$6'},
                    {id:'antique',label:'Antique',extra:'+$8'},
                  ]}
                />
              </div>
              <div>
                <span className="pdp-label" style={{display:'block',marginBottom:8}}>Zipper Pull</span>
                <MaterialPicker
                  current={selections.hardware.zipperPull}
                  onChange={v => setSelection('hardware','zipperPull',v)}
                  materials={[
                    {id:'standard',label:'Standard'},
                    {id:'leather',label:'Leather Tab'},
                    {id:'paracord',label:'Paracord'},
                  ]}
                />
              </div>
            </CollapsibleSection>

            {/* TEXT */}
            <CollapsibleSection title="TEXT & EMBROIDERY">
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div>
                  <span className="pdp-label" style={{display:'block',marginBottom:6}}>Your Text</span>
                  <input
                    type="text"
                    value={selections.text.value}
                    onChange={e => setSelection('text','value',e.target.value)}
                    placeholder="e.g. CHAMPION 23"
                    maxLength={20}
                  />
                </div>
                <div>
                  <span className="pdp-label" style={{display:'block',marginBottom:6}}>Font</span>
                  <MaterialPicker
                    current={selections.text.font}
                    onChange={v => setSelection('text','font',v)}
                    materials={[
                      {id:'Oswald',label:'Block'},
                      {id:'Georgia',label:'Serif'},
                      {id:'Impact',label:'Impact'},
                      {id:'Courier New',label:'Mono'},
                    ]}
                  />
                </div>
                <div>
                  <span className="pdp-label" style={{display:'block',marginBottom:6}}>Placement</span>
                  <MaterialPicker
                    current={selections.text.placement}
                    onChange={v => setSelection('text','placement',v)}
                    materials={[
                      {id:'chest',label:'Chest'},
                      {id:'back',label:'Back'},
                      {id:'sleeve',label:'Sleeve'},
                      {id:'hood',label:'Hood'},
                    ]}
                  />
                </div>
                <div>
                  <span className="pdp-label" style={{display:'block',marginBottom:6}}>Effect</span>
                  <MaterialPicker
                    current={selections.text.effect}
                    onChange={v => setSelection('text','effect',v)}
                    materials={[
                      {id:'none',label:'Standard'},
                      {id:'puff',label:'3D Puff',extra:'+$10'},
                      {id:'reflective',label:'Reflective',extra:'+$12'},
                      {id:'metallic',label:'Metallic',extra:'+$8'},
                      {id:'glitter',label:'Glitter',extra:'+$10'},
                    ]}
                  />
                </div>
                <SwatchPicker label="Text Color" current={selections.text.color} onChange={hex => setSelection('text','color',hex)} />
              </div>
            </CollapsibleSection>

            {/* STRAPS & SHOULDERS */}
            <CollapsibleSection title="STRAPS & SHOULDERS">
              <div className="toggle-row">
                <label className="link-toggle">
                  <input type="checkbox"
                    checked={selections.straps.epaulets}
                    onChange={e => setSelection('straps','epaulets',e.target.checked)}
                  />
                  <span>Epaulets (+$8)</span>
                </label>
                <label className="link-toggle">
                  <input type="checkbox"
                    checked={selections.straps.waistBelt}
                    onChange={e => setSelection('straps','waistBelt',e.target.checked)}
                  />
                  <span>Waist Belt</span>
                </label>
              </div>
            </CollapsibleSection>

            {/* HOOD (jacket with hood / hoodie) */}
            {(product.category === 'hoodie' || selections.hood.enabled) && (
              <CollapsibleSection title="HOOD">
                <div className="toggle-row">
                  <label className="link-toggle">
                    <input type="checkbox"
                      checked={selections.hood.detachable}
                      onChange={e => setSelection('hood','detachable',e.target.checked)}
                    />
                    <span>Detachable (+$20)</span>
                  </label>
                </div>
                <SwatchPicker
                  label="Lining Color"
                  current={selections.hood.liningColor}
                  onChange={hex => setSelection('hood','liningColor',hex)}
                />
              </CollapsibleSection>
            )}
          </div>

          {/* ADD TO CART CTA */}
          <div className="panel-cta">
            <Link to="/runway" className="btn btn-secondary runway-cta-btn">
              RUNWAY
            </Link>
            <button className="btn btn-primary panel-add-btn" onClick={handleAddToCart}>
              ADD TO CART · <TotalDisplay />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TotalDisplay() {
  const total = useCustomStore(s => s.totalPrice);
  return <>${total}</>;
}

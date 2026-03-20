SwiftStyle – Task Checklist
Phase 1: Planning
 Read PRD and UI/UX Design Document
 Create task.md
 Write implementation_plan.md
 Get user approval on plan
Phase 2: Project Setup
 Initialize Vite + React project in c:\Users\Anika Bisht\OneDrive\Desktop\varsity
 Install dependencies: Three.js, React Three Fiber, Drei, Zustand, GSAP, React Router
Phase 3: Core Architecture
 Set up global store (Zustand) for customization state + pricing
 Create constants: materials, colors, pricing rules
 Set up router (React Router) for pages: Home, Gallery, ProductDetail, Customize, Runway, Cart
 Apply global CSS design system (colors, typography, components)
Phase 4: Landing Page (Home)
 Brand header with logo + cart icon
 Hero section: tagline + primary CTA
 Auto-rotating 3D jacket viewer (Three.js / R3F)
 "100% CUSTOM" anchor + emotional two-line statement
 Process strip
 Product card footer (Varsity Legacy Edition)
 Navigation bar (Jackets | Hoodies | Materials | Endurance | Search)
Phase 5: Gallery / Collection Page
 Asymmetric product grid (jackets + hoodies) with real product photos
 Product cards: photo, name, price, color swatches
 Filter tabs: Jackets / Hoodies / All
 Hover reveals "Quick Customize" button (orange)
Phase 6: Product Details Page
 Large product photo
 Product title + price (sale price + crossed out original)
 Short description
 Color swatches with "36+ more" indicator
 Support prompt
 Specifications: Closure Type, Materials
 Size selector: XXS – 5XL
 Two action buttons: "Personalize" and "Add to Cart"
Phase 7: Customization Engine (Key Feature)
 3D Viewer (R3F) – dominant left zone
 Jacket model with independent component coloring via PBR materials
 Hoodie model
 Orbit controls + zoom; orange outline in control mode
 Customization Panel (right, dark, collapsible sections)
 Body: material + color (MUST match product clicked from gallery)
 Sleeves: Left/Right independent toggle + color
 Collar: style + material + color
 Closure: zipper type + color + pull style
 Pockets: style + placement
 Straps / Belts / Shoulders
 Back design
 Hood (if applicable)
 Text editor: font, size, placement, effect, stitch
 Hardware: buttons, zipper, snaps, eyelets
 Color swatch component (double ring selected state)
 Price Breakdown Card (sticky, itemized, live total with flip animation)
 Runway Preview CTA button
Phase 8: Runway Presentation Overlay
 Fullscreen overlay (escape = exit)
 5-act animated scene sequence (CSS/GSAP driven)
 Scene selector / progress indicator
 Share, Download 4K, Back to Customizer buttons
Phase 9: Cart & Checkout
 Cart page: line items with thumbnail, description, qty, price
 "Proceed to Checkout" orange CTA
 Minimal checkout form
Phase 10: Micro-interactions & Motion
 Button hovers (0.1s fill)
 Swatch selection animation (scale + double ring)
 Price flip animation (digit roll)
 Runway trigger pulse
 3D viewport orange outline in control mode
Phase 11: Responsive Design
 Desktop two-column asymmetric layout
 Tablet stacked view
 Mobile accordion panel + sticky price bar + hamburger nav
Phase 12: Accessibility
 WCAG AA contrast
 Focus outlines (2px orange)
 ARIA labels
Phase 13: Verification
 Browser test: Home page renders
 Browser test: Gallery with real photos
 Browser test: Product Details page
 Browser test: Customization page – sleeve colors, price updates
 Browser test: Runway overlay plays
 Browser test: Cart page
 Check console errors
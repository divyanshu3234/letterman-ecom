import { create } from 'zustand';
import { MATERIAL_PRICES, CONTRAST_SLEEVE_PRICE, HARDWARE_PRICES, ZIPPER_PRICES, TEXT_PRICES, POCKET_PRICES, CUSTOM_LINING_PRICE, EPAULET_PRICE, DETACHABLE_HOOD_PRICE } from '../constants/pricing';

const defaultSelections = (product) => ({
  body: {
    material: product?.materials?.body || 'wool-melton',
    color: product?.colors?.[0]?.body || '#111111',
  },
  sleeveLeft: {
    material: product?.materials?.sleeve || 'genuine-leather',
    color: product?.colors?.[0]?.sleeve || '#0a0a0a',
  },
  sleeveRight: {
    material: product?.materials?.sleeve || 'genuine-leather',
    color: product?.colors?.[0]?.sleeve || '#0a0a0a',
  },
  collar: { style: 'ribbed', material: 'wool-melton', color: '#111111' },
  closure: { type: 'snap', zipperColor: '#888888', pullStyle: 'standard', buttonMaterial: 'brass', buttonColor: '#888888' },
  pockets: { style: 'standard', placement: 'side', flap: true, liningColor: '#1a1a1a' },
  straps: { epaulets: false, waistBelt: false, color: '#111111' },
  back: { design: 'solid', print: null, vent: 'none' },
  hood: { enabled: false, detachable: false, liningColor: '#1a1a1a', drawstringStyle: 'rope' },
  text: { value: '', font: 'Oswald', size: 3, color: '#FFFFFF', placement: 'chest', effect: 'none', stitch: 'satin', backing: 'cutaway' },
  hardware: { buttonMaterial: 'brass', zipperPull: 'standard', snaps: 'classic', eyelets: 'brass' },
  lining: { custom: false, color: '#1a1a1a' },
  size: 'M',
});

const computeAddOns = (sel, product) => {
  if (!product || !sel) return [];
  const addOns = [];

  // Contrast sleeves
  if (sel.sleeveLeft.color !== sel.body.color || sel.sleeveRight.color !== sel.body.color) {
    addOns.push({ label: 'Sleeve contrast', price: CONTRAST_SLEEVE_PRICE });
  }
  // Material upgrades
  const bodyExtra = MATERIAL_PRICES[sel.body.material] || 0;
  if (bodyExtra > 0) addOns.push({ label: `${sel.body.material} body`, price: bodyExtra });
  
  const sleeveExtra = MATERIAL_PRICES[sel.sleeveLeft.material] || 0;
  if (sleeveExtra > 0) addOns.push({ label: `${sel.sleeveLeft.material} sleeves`, price: sleeveExtra });

  // Pockets
  const pocketExtra = POCKET_PRICES[sel.pockets?.style] || 0;
  if (pocketExtra > 0) addOns.push({ label: `${sel.pockets.style} pockets`, price: pocketExtra });

  // Hardware
  const hwExtra = HARDWARE_PRICES[sel.hardware.buttonMaterial] || 0;
  if (hwExtra > 0) addOns.push({ label: `${sel.hardware.buttonMaterial} hardware`, price: hwExtra });

  // Zipper
  const zipExtra = ZIPPER_PRICES[sel.closure.type] || 0;
  if (zipExtra > 0) addOns.push({ label: `${sel.closure.type} zipper`, price: zipExtra });

  // Text
  if (sel.text.value) {
    addOns.push({ label: 'Custom text', price: TEXT_PRICES.placement });
    if (sel.text.effect !== 'none') {
      const effectPrice = TEXT_PRICES[sel.text.effect] || 0;
      if (effectPrice > 0) addOns.push({ label: `${sel.text.effect} effect`, price: effectPrice });
    }
  }

  // Epaulets
  if (sel.straps.epaulets) addOns.push({ label: 'Epaulets', price: EPAULET_PRICE });

  // Hood
  if (sel.hood.detachable) addOns.push({ label: 'Detachable hood', price: DETACHABLE_HOOD_PRICE });

  // Custom lining
  if (sel.lining.custom) addOns.push({ label: 'Custom lining', price: CUSTOM_LINING_PRICE });

  return addOns;
};

const useCustomStore = create((set, get) => {
  const refreshPrice = (state) => {
    const { currentProduct, selections } = state;
    if (!currentProduct) return { addOns: [], totalPrice: 0 };
    const addOns = computeAddOns(selections, currentProduct);
    const totalPrice = currentProduct.basePrice + addOns.reduce((sum, item) => sum + item.price, 0);
    return { addOns, totalPrice };
  };

  return {
    // Current product being customized
    currentProduct: null,
    selections: defaultSelections(null),
    linkSleeves: true,
    totalPrice: 0,
    addOns: [],

    // Runway
    runwayOpen: false,

    // Cart
    cartItems: [],

    // ——— Actions ———
    initProduct: (product) => {
      if (!product || get().currentProduct?.id === product.id) return;
      const selections = defaultSelections(product);
      set({
        currentProduct: product,
        selections,
        linkSleeves: true,
        ...refreshPrice({ currentProduct: product, selections })
      });
    },

    setColor: (part, color) => set((state) => {
      const newSel = { ...state.selections };
      if (part === 'body') {
        newSel.body = { ...newSel.body, color };
      } else if (part === 'sleeveLeft') {
        newSel.sleeveLeft = { ...newSel.sleeveLeft, color };
        if (state.linkSleeves) newSel.sleeveRight = { ...newSel.sleeveRight, color };
      } else if (part === 'sleeveRight') {
        newSel.sleeveRight = { ...newSel.sleeveRight, color };
      }
      return { 
        selections: newSel,
        ...refreshPrice({ ...state, selections: newSel })
      };
    }),

    setProductColor: (colorObj) => set((state) => {
      const newSel = {
        ...state.selections,
        body:        { ...state.selections.body,        color: colorObj.body },
        sleeveLeft:  { ...state.selections.sleeveLeft,  color: colorObj.sleeve },
        sleeveRight: { ...state.selections.sleeveRight, color: colorObj.sleeve },
      };
      return {
        selections: newSel,
        ...refreshPrice({ ...state, selections: newSel })
      };
    }),

    setMaterial: (part, material) => set((state) => {
      const newSel = { ...state.selections };
      newSel[part] = { ...newSel[part], material };
      if (part === 'sleeveLeft' && state.linkSleeves) newSel.sleeveRight = { ...newSel.sleeveRight, material };
      return { 
        selections: newSel,
        ...refreshPrice({ ...state, selections: newSel })
      };
    }),

    setSelection: (section, key, value) => set((state) => {
      const newSel = {
        ...state.selections,
        [section]: { ...state.selections[section], [key]: value },
      };
      return {
        selections: newSel,
        ...refreshPrice({ ...state, selections: newSel })
      };
    }),

    setLinkSleeves: (val) => set({ linkSleeves: val }),
    setSize: (size) => set((state) => ({ selections: { ...state.selections, size } })),
    setRunwayOpen: (val) => set({ runwayOpen: val }),

    addToCart: () => {
      const { currentProduct, selections, addOns, totalPrice } = get();
      if (!currentProduct) return;
      set((state) => ({
        cartItems: [
          ...state.cartItems,
          {
            id: Date.now(),
            product: currentProduct,
            selections: { ...selections },
            addOns: [...addOns],
            total: totalPrice,
            qty: 1,
          },
        ],
      }));
    },

    removeFromCart: (id) => set((state) => ({ cartItems: state.cartItems.filter(i => i.id !== id) })),
    updateQty: (id, qty) => set((state) => ({
      cartItems: state.cartItems.map(i => i.id === id ? { ...i, qty } : i),
    })),
  };
});

export default useCustomStore;

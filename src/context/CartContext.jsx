import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  deliveryZone: null,
  deliveryType: 'delivery', // 'delivery' | 'pickup'
  notes: '',
  promoCode: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };
    }
    case 'SET_DELIVERY_ZONE':
      return { ...state, deliveryZone: action.zone };
    case 'SET_DELIVERY_TYPE':
      return { ...state, deliveryType: action.deliveryType };
    case 'SET_NOTES':
      return { ...state, notes: action.notes };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', item }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), []);
  const updateQty = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }), []);
  const setDeliveryZone = useCallback((zone) => dispatch({ type: 'SET_DELIVERY_ZONE', zone }), []);
  const setDeliveryType = useCallback((t) => dispatch({ type: 'SET_DELIVERY_TYPE', deliveryType: t }), []);
  const setNotes = useCallback((notes) => dispatch({ type: 'SET_NOTES', notes }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const itemCount = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = state.deliveryType === 'pickup' ? 0
    : subtotal >= 35 ? 0
    : (state.deliveryZone?.deliveryFee ?? 0);
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      ...state,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      addItem,
      removeItem,
      updateQty,
      setDeliveryZone,
      setDeliveryType,
      setNotes,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

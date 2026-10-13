'use client'
import { createContext, useContext, useReducer, useState, useEffect } from 'react'

const CartCtx = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return Array.isArray(action.payload) ? action.payload : []
    case 'ADD': {
      const addQty = action.item.qty || 1
      const key = `${action.item.id}-${action.item.variant}`
      const existing = state.find(i => `${i.id}-${i.variant}` === key)
      if (existing) return state.map(i => `${i.id}-${i.variant}` === key ? { ...i, qty: i.qty + addQty } : i)
      return [...state, { ...action.item, qty: addQty }]
    }
    case 'REMOVE':
      return state.filter(i => `${i.id}-${i.variant}` !== action.key)
    case 'UPDATE_QTY':
      return state.map(i => `${i.id}-${i.variant}` === action.key ? { ...i, qty: Math.max(1, action.qty) } : i)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children, storeSettings }) {
  const [cart, dispatch] = useReducer(cartReducer, [])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [mounted, setMounted] = useState(false)

  const currency = storeSettings?.currency_symbol || storeSettings?.currency || 'LKR'
  const freeThreshold = storeSettings?.free_delivery_threshold ?? 0
  const deliveryFee = storeSettings?.delivery_fee ?? 350

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cc_cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'HYDRATE', payload: parsed })
        }
      }
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem('cc_cart', JSON.stringify(cart)) } catch {}
    }
  }, [cart, mounted])

  const addToCart = (item) => {
    dispatch({ type: 'ADD', item })
    setDrawerOpen(true)
    showToast(`${item.name} added to cart`)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : deliveryFee
  const total = subtotal + delivery
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartCtx.Provider value={{
      cart, dispatch, drawerOpen, setDrawerOpen,
      toast, addToCart, showToast,
      subtotal, delivery, total, itemCount,
      currency, freeThreshold, deliveryFee,
      isHydrated: mounted,
    }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => useContext(CartCtx)

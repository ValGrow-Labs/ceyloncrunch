'use client'
import { createContext, useContext, useReducer, useState, useEffect } from 'react'

const CartCtx = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.id}-${action.item.variant}`
      const existing = state.find(i => `${i.id}-${i.variant}` === key)
      if (existing) return state.map(i => `${i.id}-${i.variant}` === key ? { ...i, qty: i.qty + 1 } : i)
      return [...state, { ...action.item, qty: 1 }]
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
  const init = () => { try { return JSON.parse(localStorage.getItem('cc_cart')) || [] } catch { return [] } }
  const [cart, dispatch] = useReducer(cartReducer, [], init)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const currency = storeSettings?.currency_symbol || storeSettings?.currency || 'LKR'
  const freeThreshold = storeSettings?.free_delivery_threshold ?? 3000
  const deliveryFee = storeSettings?.delivery_fee ?? 300

  useEffect(() => {
    try { localStorage.setItem('cc_cart', JSON.stringify(cart)) } catch {}
  }, [cart])

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
  const delivery = subtotal >= freeThreshold ? 0 : deliveryFee
  const total = subtotal + delivery
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartCtx.Provider value={{
      cart, dispatch, drawerOpen, setDrawerOpen,
      toast, addToCart, showToast,
      subtotal, delivery, total, itemCount,
      currency, freeThreshold, deliveryFee,
    }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => useContext(CartCtx)

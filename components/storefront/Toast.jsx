'use client'
import { useCart } from '@/contexts/CartContext'

export default function Toast() {
  const { toast } = useCart()
  if (!toast) return null
  return <div className="toast-pill">{toast}</div>
}

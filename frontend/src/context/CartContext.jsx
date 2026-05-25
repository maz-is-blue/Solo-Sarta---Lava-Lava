import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

function loadSaved() {
  try {
    const raw = localStorage.getItem('ss_cart')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function CartProvider({ children }) {
  const saved = loadSaved()
  const [cart, setCart] = useState(saved?.cart ?? { solo: 0, lava: 0 })
  const [cartItems, setCartItems] = useState(saved?.cartItems ?? [])

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('ss_cart', JSON.stringify({ cart, cartItems }))
  }, [cart, cartItems])

  const addItem = (brand, product, size, quantity = 1) => {
    setCart(prev => ({ ...prev, [brand]: (prev[brand] ?? 0) + quantity }))
    setCartItems(prev => {
      const existing = prev.find(i => i.slug === product.slug && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.slug === product.slug && i.size === size
            ? { ...i, qty: i.qty + quantity }
            : i
        )
      }
      return [...prev, { ...product, brand, size, qty: quantity }]
    })
  }

  const removeItem = (slug, size) => {
    const item = cartItems.find(i => i.slug === slug && i.size === size)
    if (!item) return
    const brand = item.brand ?? 'lava'
    setCart(prev => ({ ...prev, [brand]: Math.max(0, (prev[brand] ?? 0) - item.qty) }))
    setCartItems(prev => prev.filter(i => !(i.slug === slug && i.size === size)))
  }

  const clearCart = () => {
    setCart({ solo: 0, lava: 0 })
    setCartItems([])
    localStorage.removeItem('ss_cart')
  }

  return (
    <CartContext.Provider value={{ cart, cartItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

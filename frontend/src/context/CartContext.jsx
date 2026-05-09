import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ solo: 0, lava: 0 })
  const [cartItems, setCartItems] = useState([])

  const addItem = (brand, product, size, quantity = 1) => {
    setCart(prev => ({ ...prev, [brand]: prev[brand] + quantity }))
    setCartItems(prev => {
      const existing = prev.find(i => i.slug === product.slug && i.size === size)
      if (existing) {
        return prev.map(i => i.slug === product.slug && i.size === size ? { ...i, qty: i.qty + quantity } : i)
      }
      return [...prev, { ...product, size, qty: quantity }]
    })
  }

  const removeItem = (slug, size) => {
    const item = cartItems.find(i => i.slug === slug && i.size === size)
    if (item) {
      setCart(prev => ({ ...prev, lava: Math.max(0, prev.lava - item.qty) }))
      setCartItems(prev => prev.filter(i => !(i.slug === slug && i.size === size)))
    }
  }

  return (
    <CartContext.Provider value={{ cart, cartItems, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

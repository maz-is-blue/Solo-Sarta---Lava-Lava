import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Landing from './components/landing/Landing'
import SoloPage from './components/solo/SoloPage'
import LavaHome from './components/lava/LavaHome'
import LavaCollection from './components/lava/LavaCollection'
import LavaProduct from './components/lava/LavaProduct'
import LavaStory from './components/lava/LavaStory'
import LavaContact from './components/lava/LavaContact'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/solo" element={<SoloPage />} />
          <Route path="/lava" element={<LavaHome />} />
          <Route path="/lava/collection" element={<LavaCollection />} />
          <Route path="/lava/product/:slug" element={<LavaProduct />} />
          <Route path="/lava/story" element={<LavaStory />} />
          <Route path="/lava/contact" element={<LavaContact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

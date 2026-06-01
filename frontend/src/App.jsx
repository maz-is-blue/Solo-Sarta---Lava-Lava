import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ContentProvider } from './context/ContentContext'
import Landing from './components/landing/Landing'
import SoloPage from './components/solo/SoloPage'
import SoloCollection from './components/solo/SoloCollection'
import SoloPiece from './components/solo/SoloPiece'
import SoloStory from './components/solo/SoloStory'
import SoloContact from './components/solo/SoloContact'
import LavaHome from './components/lava/LavaHome'
import LavaCollection from './components/lava/LavaCollection'
import LavaProduct from './components/lava/LavaProduct'
import LavaStory from './components/lava/LavaStory'
import LavaContact from './components/lava/LavaContact'
import BagPage from './components/BagPage'
import CheckoutPage from './components/CheckoutPage'
import AdminLogin from './components/admin/AdminLogin'
import SoloAdminDashboard from './components/admin/SoloAdminDashboard'
import LavaAdminDashboard from './components/admin/LavaAdminDashboard'

export default function App() {
  return (
    <HashRouter>
      <ContentProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/solo" element={<SoloPage />} />
            <Route path="/solo/collection" element={<SoloCollection />} />
            <Route path="/solo/piece/:slug" element={<SoloPiece />} />
            <Route path="/solo/story" element={<SoloStory />} />
            <Route path="/solo/contact" element={<SoloContact />} />
            <Route path="/lava" element={<LavaHome />} />
            <Route path="/lava/collection" element={<LavaCollection />} />
            <Route path="/lava/product/:slug" element={<LavaProduct />} />
            <Route path="/lava/story" element={<LavaStory />} />
            <Route path="/lava/contact" element={<LavaContact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/solo" element={<SoloAdminDashboard />} />
            <Route path="/admin/lava" element={<LavaAdminDashboard />} />
            <Route path="/admin" element={<Navigate to="/admin/solo" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </ContentProvider>
    </HashRouter>
  )
}

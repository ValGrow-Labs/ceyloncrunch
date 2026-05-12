import { getAllSettings } from '@/lib/settings'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { CartProvider } from '@/contexts/CartContext'
import Navbar from '@/components/storefront/Navbar'
import CartDrawer from '@/components/storefront/CartDrawer'
import Toast from '@/components/storefront/Toast'
import AnnouncementBar from '@/components/storefront/AnnouncementBar'
import Footer from '@/components/storefront/Footer'

export default async function StoreLayout({ children }) {
  const settings = await getAllSettings()
  const store = settings.store || {}

  return (
    <SettingsProvider settings={settings}>
      <CartProvider storeSettings={store}>
        <AnnouncementBar settings={settings} />
        <Navbar />
        {children}
        <Footer settings={settings} />
        <CartDrawer />
        <Toast />
      </CartProvider>
    </SettingsProvider>
  )
}

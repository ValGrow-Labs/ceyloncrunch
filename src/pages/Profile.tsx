import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useStore, Order, SavedAddress } from '../lib/store';
import { formatRs, Product } from '../data/products';
import { trackOrderRpc, supabase } from '../lib/supabase';
import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Tag,
  Sliders,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Phone,
  Mail,
  ShoppingBag,
  HelpCircle,
  X,
  Printer,
  AlertCircle,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  RefreshCw,
  Store,
} from 'lucide-react';

export const SRI_LANKAN_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Galle',
  'Matara',
  'Kurunegala',
  'Puttalam',
  'Jaffna',
  'Badulla',
  'Ratnapura',
  'Anuradhapura',
  'Batticaloa',
  'Hambantota',
  'Matale',
  'Nuwara Eliya',
  'Trincomalee',
  'Kegalle',
  'Ampara',
  'Monaragala',
  'Polonnaruwa',
  'Vavuniya',
  'Kilinochchi',
  'Mannar',
  'Mullaitivu',
];

interface VoucherItem {
  code: string;
  title: string;
  description: string;
  minSpend: number;
  discount: string;
  badge: string;
}

const ACTIVE_VOUCHERS: VoucherItem[] = [
  {
    code: 'CRUNCH10',
    title: '10% Small-Batch Harvest Discount',
    description: 'Enjoy 10% off on all artisan nuts, dried fruits, and whole spices.',
    minSpend: 4000,
    discount: '10% OFF',
    badge: 'Popular',
  },
  {
    code: 'HARVESTFREESHIP',
    title: 'Complimentary Island Delivery',
    description: 'Free expedited delivery across all 25 districts of Sri Lanka.',
    minSpend: 3500,
    discount: 'FREE SHIPPING',
    badge: 'Island-wide',
  },
  {
    code: 'CEYLONVIP',
    title: 'Rs. 500 Off Luxury Hampers',
    description: 'Applicable on premium wooden boxes, curated gift hampers, and reserve harvests.',
    minSpend: 8000,
    discount: 'Rs. 500 OFF',
    badge: 'VIP Reserve',
  },
  {
    code: 'FIRSTCRUNCH',
    title: 'Rs. 250 First Customer Welcome',
    description: 'Welcome gift for new customers tasting Ceylon Crunch small-batch provisions.',
    minSpend: 3000,
    discount: 'Rs. 250 OFF',
    badge: 'Welcome Gift',
  },
];

type ProfileTab = 'orders' | 'addresses' | 'wishlist' | 'perks' | 'preferences';

export interface ProfileProps {
  defaultMode?: 'signin' | 'signup';
}

export const Profile: React.FC<ProfileProps> = ({ defaultMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    patronProfile,
    updatePatronProfile,
    savedAddresses,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    orders,
    linkOrderToProfile,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    showToast,
    customerEmail,
    isCustomerLoggedIn,
    loginCustomer,
    signupCustomer,
    logoutCustomer,
  } = useStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedWaybill, setCopiedWaybill] = useState<string | null>(null);

  // Search & Filter Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // "Find & Link Order" modal state
  const [showLinkOrderModal, setShowLinkOrderModal] = useState(false);
  const [linkOrderId, setLinkOrderId] = useState('');
  const [linkOrderPhone, setLinkOrderPhone] = useState(patronProfile.phone || '');
  const [isLinkingOrder, setIsLinkingOrder] = useState(false);
  const [linkOrderError, setLinkOrderError] = useState<string | null>(null);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    recipientName: patronProfile.name || '',
    phone: patronProfile.phone || '',
    street: '',
    landmark: '',
    city: patronProfile.city || 'Colombo',
    district: patronProfile.district || 'Colombo',
    postalCode: '',
    isDefault: false,
  });

  // Edit Customer Profile Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: patronProfile.name,
    phone: patronProfile.phone,
    email: patronProfile.email,
    city: patronProfile.city,
    district: patronProfile.district,
  });

  // Selected Order for Receipt Modal
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Customer Auth Modal State (Supabase / Guest)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(defaultMode || 'signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auto-open Customer Auth Modal for /login, /signin, /register, /signup or query params
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const action = searchParams.get('action') || searchParams.get('mode');

    if (path === '/register' || path === '/signup' || action === 'register' || action === 'signup' || defaultMode === 'signup') {
      if (!customerEmail) {
        setAuthMode('signup');
        setAuthError(null);
        setIsAuthModalOpen(true);
      }
    } else if (path === '/login' || path === '/signin' || action === 'login' || action === 'signin' || defaultMode === 'signin') {
      if (!customerEmail) {
        setAuthMode('signin');
        setAuthError(null);
        setIsAuthModalOpen(true);
      }
    }
  }, [location.pathname, searchParams, defaultMode, customerEmail]);

  // Total spent calculation
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.items.some((i) => i.productName.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
        (o.waybill && o.waybill.toLowerCase().includes(orderSearchQuery.toLowerCase()));

      const matchesStatus =
        orderStatusFilter === 'all' ? true : o.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Wishlisted products
  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Curated recommended products when wishlist is empty
  const recommendedProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // Copy voucher handler
  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon ${code} copied! Apply at checkout.`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Copy waybill handler
  const handleCopyWaybill = (waybill: string) => {
    navigator.clipboard.writeText(waybill);
    setCopiedWaybill(waybill);
    showToast(`Tracking code ${waybill} copied!`);
    setTimeout(() => setCopiedWaybill(null), 2500);
  };

  // Reorder all items in an order
  const handleReorder = (order: Order) => {
    let addedCount = 0;
    order.items.forEach((item) => {
      const prod = products.find((p) => p.name === item.productName || p.id === item.productId);
      if (prod) {
        const variant =
          prod.variants.find((v) => v.weight === item.variantWeight) ||
          prod.variants[0];
        if (variant && variant.stock > 0) {
          addToCart(prod, variant, item.quantity);
          addedCount += item.quantity;
        }
      }
    });

    if (addedCount > 0) {
      showToast(`${addedCount} items added to your cart!`, 'View Cart', () =>
        navigate('/cart')
      );
    } else {
      showToast('Items from this order are currently preparing fresh small-batch harvest.');
    }
  };

  // Handle Find & Link Guest Order
  const handleLinkOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkOrderError(null);
    if (!linkOrderId.trim() || !linkOrderPhone.trim()) {
      setLinkOrderError('Please enter both Order ID and Phone Number.');
      return;
    }

    setIsLinkingOrder(true);
    try {
      const res = await trackOrderRpc(linkOrderId.trim(), linkOrderPhone.trim());
      if (res.found && res.order) {
        const o = res.order;
        const linkedOrder: Order = {
          id: o.id,
          createdAt: o.created_at
            ? new Date(o.created_at).toLocaleDateString()
            : 'Recent Order',
          customer: {
            name: patronProfile.name || 'Valued Customer',
            phone: linkOrderPhone.trim(),
            email: patronProfile.email || undefined,
          },
          shippingAddress: {
            street: 'Island-wide Tracked Delivery',
            city: o.shipping_city,
            district: o.shipping_district,
          },
          paymentMethod: (o.payment_method as any) || 'cod',
          paymentStatus: (o.payment_status as any) || 'pending',
          paymentSlipUrl: o.payment_slip_url || undefined,
          subtotal: Number(o.subtotal || 0),
          deliveryFee: Number(o.delivery_fee || 0),
          total: Number(o.total || 0),
          status: (o.status as any) || 'placed',
          waybill: o.waybill || 'CLN-DISPATCH-LK',
          estimatedArrival: o.estimated_arrival || '1-2 business days',
          items: (o.items || []).map((it) => ({
            productId: '',
            variantId: '',
            productName: it.product_name,
            variantWeight: it.variant_weight,
            price: Number(it.price),
            quantity: it.quantity,
            image: it.image || '',
            slug: '',
          })),
          timeline: [
            {
              status: 'placed',
              title: 'Order Placed',
              timestamp: o.created_at
                ? new Date(o.created_at).toLocaleDateString()
                : 'Confirmed',
              description: 'Verified with small-batch packaging queue',
              completed: true,
            },
          ],
        };

        linkOrderToProfile(linkedOrder);
        showToast(`Order #${linkedOrder.id} successfully linked to your customer profile!`);
        setShowLinkOrderModal(false);
        setLinkOrderId('');
      } else {
        setLinkOrderError(
          'No matching order found. Please check your Order ID (e.g., CC-000123) and the mobile phone number entered at checkout.'
        );
      }
    } catch (err: any) {
      setLinkOrderError(err?.message || 'Failed to search order. Please check your connection.');
    } finally {
      setIsLinkingOrder(false);
    }
  };

  // Handle Add/Edit Address Form
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.recipientName.trim() || !addressForm.street.trim() || !addressForm.phone.trim()) {
      showToast('Please fill in required fields (Recipient, Mobile, Street).');
      return;
    }

    if (editingAddressId) {
      updateSavedAddress(editingAddressId, {
        label: addressForm.label,
        recipientName: addressForm.recipientName.trim(),
        phone: addressForm.phone.trim(),
        street: addressForm.street.trim(),
        landmark: addressForm.landmark.trim() || undefined,
        city: addressForm.city.trim(),
        district: addressForm.district,
        postalCode: addressForm.postalCode.trim() || undefined,
        isDefault: addressForm.isDefault,
      });
      showToast('Delivery address updated!');
    } else {
      addSavedAddress({
        label: addressForm.label,
        recipientName: addressForm.recipientName.trim(),
        phone: addressForm.phone.trim(),
        street: addressForm.street.trim(),
        landmark: addressForm.landmark.trim() || undefined,
        city: addressForm.city.trim(),
        district: addressForm.district,
        postalCode: addressForm.postalCode.trim() || undefined,
        isDefault: addressForm.isDefault,
      });
      showToast('New delivery address saved!');
    }

    setIsAddressModalOpen(false);
    setEditingAddressId(null);
  };

  // Open Edit Address Modal
  const openEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      street: addr.street,
      landmark: addr.landmark || '',
      city: addr.city,
      district: addr.district,
      postalCode: addr.postalCode || '',
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  // Open New Address Modal
  const openNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: 'Home',
      recipientName: patronProfile.name || '',
      phone: patronProfile.phone || '',
      street: '',
      landmark: '',
      city: patronProfile.city || 'Colombo',
      district: patronProfile.district || 'Colombo',
      postalCode: '',
      isDefault: savedAddresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  // Save Customer Profile Modal
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatronProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      email: profileForm.email.trim(),
      city: profileForm.city.trim(),
      district: profileForm.district,
    });
    showToast('Customer profile updated successfully!');
    setIsProfileModalOpen(false);
  };

  // Customer Supabase Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signin') {
        const result = await loginCustomer(authEmail, authPassword);
        if (!result.success) {
          throw new Error(result.error || 'Authentication failed. Please check your credentials.');
        }
        showToast(`Welcome back, ${authEmail}!`);
        setIsAuthModalOpen(false);
        setAuthPassword('');
        if (['/login', '/signin', '/register', '/signup'].includes(location.pathname.toLowerCase())) {
          navigate('/profile', { replace: true });
        }
      } else {
        if (authPassword.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const result = await signupCustomer(authEmail, authPassword, authName, authPhone);
        if (!result.success) {
          throw new Error(result.error || 'Registration failed. Please try again.');
        }
        showToast('Customer account created! Welcome to Ceylon Crunch.');
        setIsAuthModalOpen(false);
        setAuthPassword('');
        if (['/login', '/signin', '/register', '/signup'].includes(location.pathname.toLowerCase())) {
          navigate('/profile', { replace: true });
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out of your customer account?')) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await logoutCustomer();
      showToast('Logged out successfully. You are now browsing in guest mode.');
    } catch {
      showToast('Error during sign out.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Customer Avatar monogram initials
  const avatarInitials = useMemo(() => {
    if (patronProfile.name && patronProfile.name.trim()) {
      const parts = patronProfile.name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return patronProfile.name.slice(0, 2).toUpperCase();
    }
    return 'CC';
  }, [patronProfile.name]);

  // Order status badge colors
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return {
          label: 'Order Placed',
          bg: 'bg-[#ffdeaa]/60 text-[#4a2e00] border-[#ffdeaa]',
          icon: Clock,
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          bg: 'bg-[#d8e2ff] text-[#001944] border-[#bac6ea]',
          icon: CheckCircle2,
        };
      case 'packed':
        return {
          label: 'Packed Fresh',
          bg: 'bg-[#d2e8d4] text-[#0b3818] border-[#a5d6ad]',
          icon: Package,
        };
      case 'dispatched':
        return {
          label: 'Dispatched & In Transit',
          bg: 'bg-[#e0d6ff] text-[#29135e] border-[#c4b5fd]',
          icon: Truck,
        };
      case 'delivered':
        return {
          label: 'Delivered',
          bg: 'bg-[#c8ebd1] text-[#022111] border-[#86efac]',
          icon: CheckCircle2,
        };
      default:
        return {
          label: status,
          bg: 'bg-[#f0eded] text-[#424843] border-[#EADFD0]',
          icon: Clock,
        };
    }
  };

  // When customer is not authenticated, show the Customer Login / Registration page first.
  // Upon successful login or registration, the profile page opens immediately!
  if (!customerEmail) {
    return (
      <div className="flex flex-col w-full space-y-6 max-w-xl mx-auto pb-16 pt-2 sm:pt-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <Link to="/" className="hover:text-[#1F3D2B] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1F3D2B] font-medium">
            {authMode === 'signin' ? 'Customer Sign In' : 'Create Customer Account'}
          </span>
        </nav>

        {/* Customer Login / Register Card */}
        <div className="bg-white rounded-3xl border border-[#EADFD0] p-6 sm:p-10 shadow-lg space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#1F3D2B] text-[#C5A059] flex items-center justify-center mx-auto shadow-md">
              <UserRound className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B] tracking-tight">
              {authMode === 'signin' ? 'Customer Sign In' : 'Create Customer Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
              {authMode === 'signin'
                ? 'Sign in to access your orders, track shipments, and manage saved addresses.'
                : 'Register a customer account for instant order tracking and saved preferences.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center p-1 bg-[#FAF8F4] border border-[#EADFD0] rounded-2xl max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#1F3D2B] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1F3D2B]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#1F3D2B] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1F3D2B]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 pt-1">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <UserRound className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Priyantha Perera"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1.5">
                    Mobile Phone
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. 077 123 4567"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] shadow-2xs"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#6B6B6B] hover:text-[#1F3D2B] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authMode === 'signup' && (
                <p className="text-[11px] text-[#6B6B6B] mt-1">Must be at least 6 characters</p>
              )}
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{authMode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
                  </>
                ) : authMode === 'signin' ? (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In to Profile</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Customer Account</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setAuthError(null);
                }}
                className="text-xs text-[#8B5E3C] hover:text-[#1F3D2B] hover:underline cursor-pointer font-medium"
              >
                {authMode === 'signin'
                  ? "Don't have an account yet? Create one here"
                  : 'Already registered? Sign in here'}
              </button>
            </div>
          </form>

          {/* Quick Assurance Badges */}
          <div className="pt-4 border-t border-[#EADFD0] grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/80">
              <Truck className="w-4 h-4 text-[#8B5E3C] mx-auto mb-1" />
              <p className="text-[11px] font-bold text-[#1F3D2B]">Order Tracking</p>
              <p className="text-[10px] text-[#6B6B6B]">Live dispatch status</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/80">
              <MapPin className="w-4 h-4 text-[#8B5E3C] mx-auto mb-1" />
              <p className="text-[11px] font-bold text-[#1F3D2B]">Saved Addresses</p>
              <p className="text-[10px] text-[#6B6B6B]">1-click easy checkout</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/80">
              <ShieldCheck className="w-4 h-4 text-[#8B5E3C] mx-auto mb-1" />
              <p className="text-[11px] font-bold text-[#1F3D2B]">Secure Account</p>
              <p className="text-[10px] text-[#6B6B6B]">Encrypted patron data</p>
            </div>
          </div>

          {/* Single Order Tracking Callout */}
          <div className="text-center pt-1">
            <Link
              to="/track"
              className="inline-flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#1F3D2B] transition-colors"
            >
              <span>Need to track an order without signing in?</span>
              <span className="font-semibold text-[#8B5E3C] underline">Track Order →</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B6B6B]">
        <Link to="/" className="hover:text-[#1F3D2B] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#1F3D2B] font-medium">Customer Profile & Orders</span>
      </nav>

      {/* Customer Hero Identity Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#162C1F] via-[#1F3D2B] to-[#2B4E38] text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-[#C5A059]/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Customer Details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#8B5E3C] to-[#C5A059] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#1F3D2B] rounded-2xl flex items-center justify-center text-[#FBF7F0] font-serif text-2xl sm:text-3xl font-bold tracking-wider">
                  {avatarInitials}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileForm({
                    name: patronProfile.name,
                    phone: patronProfile.phone,
                    email: patronProfile.email,
                    city: patronProfile.city,
                    district: patronProfile.district,
                  });
                  setIsProfileModalOpen(true);
                }}
                title="Edit Customer Profile"
                className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#C5A059] text-[#1F3D2B] flex items-center justify-center shadow-md hover:bg-[#d8b56d] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FBF7F0]">
                  {patronProfile.name
                    ? patronProfile.name
                    : customerEmail
                    ? customerEmail.split('@')[0]
                    : 'Valued Customer'}
                </h1>
                {customerEmail ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#2E7D4F]/30 text-[#85E3A0] border border-[#2E7D4F]/60 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                    <span>Verified Customer</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                    <Sparkles className="w-3 h-3" />
                    <span>Guest Patron Mode</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#EADFD0]/80 font-sans">
                {patronProfile.phone ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{patronProfile.phone}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-[#C5A059] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add mobile number
                  </button>
                )}

                {customerEmail || patronProfile.email ? (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{customerEmail || patronProfile.email}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-[#C5A059] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add email address
                  </button>
                )}

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>
                    {patronProfile.district || 'Colombo'}, Sri Lanka
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Customer Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setProfileForm({
                  name: patronProfile.name,
                  phone: patronProfile.phone,
                  email: customerEmail || patronProfile.email,
                  city: patronProfile.city,
                  district: patronProfile.district,
                });
                setIsProfileModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FBF7F0] text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLinkOrderModal(true)}
              className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d8b56d] text-[#1F3D2B] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Guest Order</span>
            </button>

            {customerEmail ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Log out of customer account"
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold backdrop-blur-xs border border-rose-400/40 transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-300" />
                ) : (
                  <LogOut className="w-3.5 h-3.5 text-rose-300" />
                )}
                <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                  setIsAuthModalOpen(true);
                }}
                title="Customer Sign In"
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F4] text-[#1F3D2B] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#1F3D2B]" />
                <span>Customer Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Customer Metrics Ribbon */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-black/15 rounded-2xl p-3 sm:p-4 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C5A059] font-bold block">
              My Orders
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {orders.length}
              </span>
              <span className="text-xs text-[#EADFD0]/70">orders</span>
            </div>
          </div>

          <div className="bg-black/15 rounded-2xl p-3 sm:p-4 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C5A059] font-bold block">
              Saved Wishlist
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {wishlist.length}
              </span>
              <span className="text-xs text-[#EADFD0]/70">items</span>
            </div>
          </div>

          <div className="bg-black/15 rounded-2xl p-3 sm:p-4 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C5A059] font-bold block">
              Address Book
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {savedAddresses.length}
              </span>
              <span className="text-xs text-[#EADFD0]/70">saved</span>
            </div>
          </div>

          <div className="bg-black/15 rounded-2xl p-3 sm:p-4 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C5A059] font-bold block">
              Total Spent
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#FBF7F0]">
                {formatRs(totalSpent)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Mode Callout Banner */}
      {!customerEmail && (
        <div className="rounded-2xl bg-gradient-to-r from-[#FAF8F4] via-white to-[#FAF8F4] border border-[#EADFD0] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-[#8B5E3C]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F3D2B]">
                Access Cross-Device Order Sync &amp; Saved Addresses
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5 max-w-xl">
                Sign in or register for a free Ceylon Crunch customer account to track your orders in real time, save delivery addresses, and sync your cart &amp; wishlist across devices.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
                setIsAuthModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
                setIsAuthModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F4] text-[#1F3D2B] border border-[#EADFD0] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-[#EADFD0] flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-t-xl font-sans text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'orders'
              ? 'text-[#1F3D2B] bg-white border-t-2 border-[#1F3D2B] shadow-xs'
              : 'text-[#6B6B6B] hover:text-[#1F3D2B] hover:bg-white/40'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders</span>
          {orders.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'orders'
                  ? 'bg-[#1F3D2B] text-white'
                  : 'bg-[#EADFD0] text-[#424843]'
              }`}
            >
              {orders.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-t-xl font-sans text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'addresses'
              ? 'text-[#1F3D2B] bg-white border-t-2 border-[#1F3D2B] shadow-xs'
              : 'text-[#6B6B6B] hover:text-[#1F3D2B] hover:bg-white/40'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Addresses</span>
          {savedAddresses.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'addresses'
                  ? 'bg-[#1F3D2B] text-white'
                  : 'bg-[#EADFD0] text-[#424843]'
              }`}
            >
              {savedAddresses.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wishlist')}
          className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-t-xl font-sans text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'wishlist'
              ? 'text-[#1F3D2B] bg-white border-t-2 border-[#1F3D2B] shadow-xs'
              : 'text-[#6B6B6B] hover:text-[#1F3D2B] hover:bg-white/40'
          }`}
        >
          <Heart className="w-4 h-4 text-[#8B5E3C]" />
          <span>My Wishlist</span>
          {wishlist.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'wishlist'
                  ? 'bg-[#8B5E3C] text-white'
                  : 'bg-[#EADFD0] text-[#424843]'
              }`}
            >
              {wishlist.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('perks')}
          className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-t-xl font-sans text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'perks'
              ? 'text-[#1F3D2B] bg-white border-t-2 border-[#1F3D2B] shadow-xs'
              : 'text-[#6B6B6B] hover:text-[#1F3D2B] hover:bg-white/40'
          }`}
        >
          <Tag className="w-4 h-4 text-[#C5A059]" />
          <span>Coupons & Discounts</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#8B5E3C]">
            4 Active
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-t-xl font-sans text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'preferences'
              ? 'text-[#1F3D2B] bg-white border-t-2 border-[#1F3D2B] shadow-xs'
              : 'text-[#6B6B6B] hover:text-[#1F3D2B] hover:bg-white/40'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Dietary & Support</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: MY ORDERS & TRACKING */}
      {/* ============================================================ */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Orders Toolbar & Quick Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EADFD0] shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order ID (e.g. CC-000123), item name, or tracking code..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-xs sm:text-sm text-[#1F3D2B] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                aria-label="Filter orders by status"
                className="px-3 py-2 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-xs font-medium text-[#424843] focus:outline-none focus:border-[#1F3D2B]"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="packed">Packed</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
              </select>

              <button
                type="button"
                onClick={() => setShowLinkOrderModal(true)}
                className="px-3 py-2 rounded-xl bg-[#FAF8F4] hover:bg-[#EADFD0]/40 text-[#1F3D2B] text-xs font-semibold border border-[#EADFD0] transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span>Link Past Order</span>
              </button>
            </div>
          </div>

          {/* Orders Content */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#EADFD0] shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#8B5E3C] flex items-center justify-center mx-auto border border-[#EADFD0]">
                <Package className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                  {orders.length === 0
                    ? 'No Orders Placed Yet'
                    : 'No orders match your filter'}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                  {orders.length === 0
                    ? 'Explore hand-roasted jumbo cashews, sweet Medjool dates, exotic nuts, and cinnamon quills packaged fresh in small batches.'
                    : 'Try clearing your search terms or filter to see all your past orders.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/shop"
                  className="px-6 py-2.5 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Start Shopping
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLinkOrderModal(true)}
                  className="px-6 py-2.5 rounded-full bg-[#FAF8F4] hover:bg-[#EADFD0]/50 text-[#1F3D2B] text-xs font-semibold border border-[#EADFD0] transition-colors"
                >
                  Find Guest Order
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusMeta = getStatusBadge(order.status);
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#EADFD0] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:border-[#C5A059]/40"
                  >
                    {/* Order Card Header */}
                    <div className="p-4 sm:p-5 bg-[#FAF8F4] border-b border-[#EADFD0] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#1F3D2B]">
                          #{order.id}
                        </span>
                        <span className="text-xs text-[#6B6B6B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8B5E3C]" />
                          <span>{order.createdAt}</span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold border ${statusMeta.bg}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusMeta.label}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.waybill && (
                          <button
                            type="button"
                            onClick={() => handleCopyWaybill(order.waybill)}
                            title="Click to copy tracking code"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8B5E3C] hover:text-[#1F3D2B] bg-white px-2 py-1 rounded-lg border border-[#EADFD0] transition-colors"
                          >
                            <span>{order.waybill}</span>
                            {copiedWaybill === order.waybill ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="p-4 sm:p-5 space-y-4">
                      <div className="divide-y divide-[#EADFD0]/60">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-12 h-12 rounded-xl object-cover bg-[#FAF8F4] border border-[#EADFD0]"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-[#FAF8F4] border border-[#EADFD0] flex items-center justify-center text-[#8B5E3C]">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-sans text-xs sm:text-sm font-bold text-[#1F3D2B]">
                                  {item.productName}
                                </h4>
                                <span className="text-[11px] text-[#6B6B6B]">
                                  {item.variantWeight} · Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-sans text-xs sm:text-sm font-semibold text-[#1F3D2B]">
                                {formatRs(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary & Destination Bar */}
                      <div className="pt-3 border-t border-[#EADFD0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B6B6B]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#8B5E3C]" />
                          <span>
                            Delivery to: {order.shippingAddress.city},{' '}
                            {order.shippingAddress.district}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="capitalize">
                            Payment:{' '}
                            <strong className="text-[#1F3D2B]">
                              {order.paymentMethod === 'cod'
                                ? 'Cash on Delivery'
                                : order.paymentMethod === 'bank'
                                ? 'Bank Transfer'
                                : 'Card Payment'}
                            </strong>
                          </span>
                          <span className="font-sans text-sm font-bold text-[#1F3D2B]">
                            Total: {formatRs(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-[#EADFD0] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setReceiptOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#FAF8F4] hover:bg-[#EADFD0]/40 text-[#424843] text-xs font-semibold border border-[#EADFD0] transition-colors flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>View Receipt</span>
                          </button>

                          <a
                            href={`https://wa.me/94779443867?text=${encodeURIComponent(
                              `Hello Ceylon Crunch, I need help regarding my Customer Order #${order.id}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#FAF8F4] hover:bg-[#EADFD0]/40 text-[#424843] text-xs font-semibold border border-[#EADFD0] transition-colors flex items-center gap-1.5"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>WhatsApp Support</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#FAF8F4] hover:bg-[#EADFD0]/50 text-[#1F3D2B] text-xs font-bold border border-[#EADFD0] transition-colors flex items-center gap-1.5 active:scale-98"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#8B5E3C]" />
                            <span>Reorder Items</span>
                          </button>

                          <Link
                            to={`/track?order=${encodeURIComponent(
                              order.id
                            )}&phone=${encodeURIComponent(
                              order.customer.phone || patronProfile.phone || ''
                            )}`}
                            className="px-4 py-1.5 rounded-lg bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Package</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: DELIVERY ADDRESSES */}
      {/* ============================================================ */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1F3D2B]">
                Saved Delivery Addresses
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Save your home or office addresses for faster 1-click checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={openNewAddress}
              className="px-4 py-2 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {savedAddresses.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#EADFD0] shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#8B5E3C] flex items-center justify-center mx-auto border border-[#EADFD0]">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  No Saved Delivery Addresses
                </h3>
                <p className="text-xs text-[#6B6B6B]">
                  Save your address once, and checkout will automatically prefill it for you every time.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewAddress}
                className="px-6 py-2.5 rounded-full bg-[#1F3D2B] text-white text-xs font-bold shadow-sm hover:bg-[#162C1F] transition-colors"
              >
                Add Your Delivery Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-2xl p-5 border relative transition-all ${
                    addr.isDefault
                      ? 'border-[#1F3D2B] shadow-md ring-1 ring-[#1F3D2B]/10'
                      : 'border-[#EADFD0] hover:border-[#C5A059]/40'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#EADFD0]/60">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#1F3D2B] bg-[#FAF8F4] px-2.5 py-1 rounded-md border border-[#EADFD0]">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-[#c8ebd1] text-[#022111]">
                          Primary Address
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditAddress(addr)}
                        title="Edit address"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:text-[#1F3D2B] hover:bg-[#FAF8F4] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedAddress(addr.id)}
                        title="Delete address"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="py-3 space-y-1.5 text-xs text-[#424843]">
                    <div className="font-bold text-sm text-[#1F3D2B]">
                      {addr.recipientName}
                    </div>
                    <div className="text-[#6B6B6B] flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#8B5E3C]" />
                      <span>{addr.phone}</span>
                    </div>
                    <div className="text-xs text-[#2B2B2B] leading-relaxed">
                      {addr.street}
                      {addr.landmark && (
                        <span className="block text-[#6B6B6B] italic">
                          Near {addr.landmark}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-[#1F3D2B]">
                      {addr.city}, {addr.district}
                      {addr.postalCode && ` · ${addr.postalCode}`}
                    </div>
                  </div>

                  {!addr.isDefault && (
                    <div className="pt-2 border-t border-[#EADFD0]/40">
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-semibold text-[#8B5E3C] hover:text-[#1F3D2B] transition-colors"
                      >
                        Set as Default Address
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SAVED WISHLIST */}
      {/* ============================================================ */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1F3D2B]">
                My Saved Wishlist
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Items you’ve bookmarked to order later.
              </p>
            </div>
            {wishlist.length > 0 && (
              <span className="text-xs font-semibold text-[#8B5E3C]">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </span>
            )}
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#EADFD0] shadow-xs space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#8B5E3C] flex items-center justify-center mx-auto border border-[#EADFD0]">
                <Heart className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-[#6B6B6B]">
                  Click the heart icon on any product in the shop to save it here for fast ordering.
                </p>
              </div>

              {/* Recommended Showcase */}
              <div className="pt-6 border-t border-[#EADFD0] text-left">
                <h4 className="font-serif text-sm font-bold text-[#1F3D2B] uppercase tracking-wider mb-4 text-center">
                  Recommended For You
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {recommendedProducts.map((p) => {
                    const firstVariant = p.variants[0];
                    return (
                      <div
                        key={p.id}
                        className="bg-[#FAF8F4] rounded-2xl p-3 border border-[#EADFD0] flex flex-col justify-between group hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2 relative">
                            {p.images[0] && (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => toggleWishlist(p.id)}
                              aria-label="Add to wishlist"
                              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 text-[#8B5E3C] flex items-center justify-center shadow-xs hover:bg-white"
                            >
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h5 className="font-sans text-xs font-bold text-[#1F3D2B] line-clamp-1">
                            {p.name}
                          </h5>
                          <span className="text-[11px] font-semibold text-[#8B5E3C]">
                            {firstVariant ? formatRs(firstVariant.price) : ''}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (firstVariant) {
                              addToCart(p, firstVariant, 1);
                              showToast(`Added ${p.name} to cart!`);
                            }
                          }}
                          className="mt-2 w-full py-1.5 rounded-lg bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistedProducts.map((prod) => {
                const firstVariant =
                  prod.variants.find((v) => v.stock > 0) || prod.variants[0];

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-[#EADFD0] p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#FAF8F4] mb-3">
                        {prod.images[0] ? (
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(prod.id)}
                          title="Remove from wishlist"
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-xs hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {prod.badge && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1F3D2B] text-white">
                            {prod.badge}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Link
                          to={`/product/${prod.slug}`}
                          className="font-serif text-base font-bold text-[#1F3D2B] hover:text-[#8B5E3C] transition-colors block line-clamp-1"
                        >
                          {prod.name}
                        </Link>
                        <p className="text-xs text-[#6B6B6B] line-clamp-2">
                          {prod.subtitle || prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EADFD0] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] block">
                          {firstVariant?.weight || 'Provisions'}
                        </span>
                        <span className="font-sans text-sm font-bold text-[#1F3D2B]">
                          {firstVariant ? formatRs(firstVariant.price) : 'Custom'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (firstVariant && firstVariant.stock > 0) {
                            addToCart(prod, firstVariant, 1);
                            showToast(`Added ${prod.name} to cart!`);
                          } else {
                            showToast('Awaiting fresh small batch harvest.');
                          }
                        }}
                        disabled={!firstVariant || firstVariant.stock <= 0}
                        className="px-4 py-2 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] disabled:bg-gray-300 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: COUPONS & DISCOUNTS */}
      {/* ============================================================ */}
      {activeTab === 'perks' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1F3D2B]">
              Active Discount Coupons & Offers
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Copy any code below and paste it during checkout to claim your savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACTIVE_VOUCHERS.map((v) => (
              <div
                key={v.code}
                className="bg-white rounded-2xl border-2 border-dashed border-[#C5A059]/60 p-5 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#8B5E3C] mb-1.5">
                      {v.badge}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                      {v.title}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-serif text-sm font-bold text-[#8B5E3C]">
                      {v.discount}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EADFD0] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#6B6B6B]">
                    Min order: <strong>{formatRs(v.minSpend)}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopyVoucher(v.code)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F4] hover:bg-[#1F3D2B] hover:text-white text-[#1F3D2B] border border-[#1F3D2B]/30 font-mono text-xs font-bold transition-all flex items-center gap-1.5 active:scale-98"
                  >
                    <span>{v.code}</span>
                    {copiedCode === v.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: DIETARY PREFERENCES & SUPPORT */}
      {/* ============================================================ */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1F3D2B]">
              Dietary Preferences & Customer Concierge
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Personalize your provisions and reach out for customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#EADFD0] space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                Dietary & Nutritional Preferences
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Select your preferences so we can highlight matching provisions:
              </p>

              <div className="space-y-2.5">
                {[
                  '100% Plant-Based / Vegan',
                  'Gluten-Free Certified',
                  'Low Sugar / Natural Sweeteners Only',
                  'Keto & High Protein Nut Mixes',
                  'Raw & Unsalted Options',
                  'Organic Whole Island Spices',
                ].map((pref) => {
                  const isChecked =
                    patronProfile.dietaryPreferences?.includes(pref) || false;

                  return (
                    <label
                      key={pref}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F4] border border-[#EADFD0] cursor-pointer hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const current = patronProfile.dietaryPreferences || [];
                          const updated = isChecked
                            ? current.filter((p) => p !== pref)
                            : [...current, pref];
                          updatePatronProfile({ dietaryPreferences: updated });
                          showToast('Preferences updated');
                        }}
                        className="w-4 h-4 rounded text-[#1F3D2B] focus:ring-[#1F3D2B]"
                      />
                      <span className="text-xs font-medium text-[#2B2B2B]">
                        {pref}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#FAF8F4] rounded-2xl p-6 border border-[#EADFD0] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                      Customer Support on WhatsApp
                    </h3>
                    <p className="text-xs text-[#6B6B6B]">
                      Fast help with current orders, custom hampers, or delivery status.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/94779443867?text=Hello%20Ceylon%20Crunch%20Support,%20I%20have%20a%20question%20about%20my%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Message WhatsApp: +94 77 944 3867</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#EADFD0] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                    Account &amp; Authentication
                  </h3>
                  {customerEmail ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2E7D4F]/15 text-[#1F3D2B] border border-[#2E7D4F]/30">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D4F]" />
                      Signed In
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#C5A059]/20 text-[#8B5E3C] border border-[#C5A059]/40">
                      Guest Session
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  {customerEmail
                    ? `You are signed in as ${customerEmail}. Your orders, saved addresses, and profile details are synchronized.`
                    : 'You are currently browsing as a guest. Sign in or create an account to sync your orders across devices.'}
                </p>

                <div className="pt-1 flex flex-wrap gap-2.5">
                  {customerEmail ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LogOut className="w-3.5 h-3.5" />
                      )}
                      <span>{isLoggingOut ? 'Logging out...' : 'Log Out of Account'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setAuthError(null);
                        setIsAuthModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In / Create Account</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#EADFD0] space-y-3">
                <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                  Privacy &amp; Stored Device Data
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Your delivery address and customer profile are remembered securely in this browser for seamless checkout.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to clear your saved customer profile and address book from this browser?'
                      )
                    ) {
                      localStorage.removeItem('ceylon_crunch_patron_profile');
                      localStorage.removeItem('ceylon_crunch_saved_addresses');
                      window.location.reload();
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Clear saved customer data on this device
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: FIND GUEST ORDER */}
      {/* ============================================================ */}
      {showLinkOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#EADFD0] shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowLinkOrderModal(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#6B6B6B] hover:text-[#1F3D2B]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                Find Past Guest Order
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Placed an order from another phone or as a guest? Enter your Order ID and phone number to link it here.
              </p>
            </div>

            <form onSubmit={handleLinkOrderSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CC-000123"
                  value={linkOrderId}
                  onChange={(e) => setLinkOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm font-mono text-[#1F3D2B] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Mobile Number (used at checkout)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 77 123 4567 or 0771234567"
                  value={linkOrderPhone}
                  onChange={(e) => setLinkOrderPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              {linkOrderError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{linkOrderError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkOrderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6B6B] hover:text-[#1F3D2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLinkingOrder}
                  className="px-5 py-2.5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isLinkingOrder ? (
                    <span>Searching Database...</span>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Link to My Orders</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT CUSTOMER DETAILS */}
      {/* ============================================================ */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#EADFD0] shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#6B6B6B] hover:text-[#1F3D2B]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                Edit Customer Details
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Your information is used to prefill orders and send tracking updates.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dilhan Perera"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Mobile Number (+94)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 077 123 4567"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@example.com"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                    Town / City
                  </label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                    District
                  </label>
                  <select
                    value={profileForm.district}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, district: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  >
                    {SRI_LANKAN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6B6B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT ADDRESS */}
      {/* ============================================================ */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EADFD0] shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#6B6B6B] hover:text-[#1F3D2B]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                {editingAddressId ? 'Edit Delivery Address' : 'New Delivery Address'}
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Enter shipping details for island-wide courier delivery across Sri Lanka.
              </p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Address Label
                </label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Family', 'Other'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, label: l })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        addressForm.label === l
                          ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                          : 'bg-[#FAF8F4] text-[#424843] border-[#EADFD0] hover:bg-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        recipientName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Street Address & House / Flat No *
                </label>
                <input
                  type="text"
                  required
                  placeholder="No. 45/2, Flower Road"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Opposite Viharamahadevi Park"
                  value={addressForm.landmark}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, landmark: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Colombo 07"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                    District *
                  </label>
                  <select
                    value={addressForm.district}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        district: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  >
                    {SRI_LANKAN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    placeholder="00700"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        isDefault: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#1F3D2B] rounded focus:ring-[#1F3D2B]"
                  />
                  <span className="text-xs text-[#424843] font-medium">
                    Make this my default delivery address
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6B6B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CUSTOMER ORDER RECEIPT */}
      {/* ============================================================ */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EADFD0] shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setReceiptOrder(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#6B6B6B] hover:text-[#1F3D2B]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-4 border-b border-[#EADFD0] space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#8B5E3C] uppercase">
                Customer Order Receipt
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                Ceylon Crunch
              </h3>
              <p className="text-[11px] text-[#6B6B6B]">
                Colombo, Sri Lanka · Small-Batch Freshness Guaranteed
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-[#424843] bg-[#FAF8F4] p-3 rounded-xl border border-[#EADFD0]">
              <div>
                <span className="text-[10px] text-[#8B5E3C] font-bold uppercase block">
                  Order Number
                </span>
                <span className="font-mono font-bold text-[#1F3D2B]">
                  #{receiptOrder.id}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B5E3C] font-bold uppercase block">
                  Date
                </span>
                <span>{receiptOrder.createdAt}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B5E3C] font-bold uppercase block">
                  Customer
                </span>
                <span>{receiptOrder.customer.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B5E3C] font-bold uppercase block">
                  Delivery City
                </span>
                <span>
                  {receiptOrder.shippingAddress.city},{' '}
                  {receiptOrder.shippingAddress.district}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] block">
                Items Purchased
              </span>
              <div className="divide-y divide-[#EADFD0]/60">
                {receiptOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#1F3D2B] block">
                        {it.productName}
                      </span>
                      <span className="text-[11px] text-[#6B6B6B]">
                        {it.variantWeight} × {it.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-[#1F3D2B]">
                      {formatRs(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#EADFD0] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Items Subtotal</span>
                <span className="font-mono">{formatRs(receiptOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Delivery Fee</span>
                <span className="font-mono">
                  {receiptOrder.deliveryFee === 0 ? 'FREE' : formatRs(receiptOrder.deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#EADFD0] flex justify-between text-sm font-bold text-[#1F3D2B]">
                <span>Total Paid</span>
                <span className="font-mono text-base text-[#8B5E3C]">
                  {formatRs(receiptOrder.total)}
                </span>
              </div>
            </div>

            {receiptOrder.waybill && (
              <div className="p-3 bg-[#FAF8F4] rounded-xl text-center text-xs text-[#6B6B6B] border border-[#EADFD0]">
                <span>Tracked Courier Waybill: </span>
                <strong className="font-mono text-[#1F3D2B]">
                  {receiptOrder.waybill}
                </strong>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#FAF8F4] hover:bg-[#EADFD0]/50 text-[#1F3D2B] text-xs font-semibold border border-[#EADFD0] flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#1F3D2B] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CUSTOMER AUTH MODAL */}
      {/* ============================================================ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#EADFD0] shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                if (['/login', '/signin', '/register', '/signup'].includes(location.pathname.toLowerCase())) {
                  navigate('/profile', { replace: true });
                }
              }}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#6B6B6B] hover:text-[#1F3D2B] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex items-center p-1 bg-[#FAF8F4] border border-[#EADFD0] rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#1F3D2B] text-white shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#1F3D2B]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Customer Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-[#1F3D2B] text-white shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#1F3D2B]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                {authMode === 'signin' ? 'Welcome Back Patron' : 'Join Ceylon Crunch'}
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                {authMode === 'signin'
                  ? 'Sign in to access your orders, track shipments, and manage saved addresses.'
                  : 'Register a customer account for instant order tracking and saved preferences.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 pt-1">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyantha Perera"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 077 123 4567"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="customer@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#6B6B6B] hover:text-[#1F3D2B]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authMode === 'signup' && (
                  <p className="text-[11px] text-[#6B6B6B] mt-1">Must be at least 6 characters</p>
                )}
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{authMode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
                    </>
                  ) : authMode === 'signin' ? (
                    'Sign In to My Account'
                  ) : (
                    'Create Customer Account'
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    setAuthError(null);
                  }}
                  className="text-xs text-[#8B5E3C] hover:underline cursor-pointer"
                >
                  {authMode === 'signin'
                    ? "New customer? Create an account"
                    : 'Already registered? Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

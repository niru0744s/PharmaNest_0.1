import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerLogin from './pages/SellerLogin';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import VerifyEmail from './pages/VerifyEmail';
import HostInventory from './pages/host/HostInventory';
import BulkOperations from './pages/host/BulkOperations';
import SellerDashboard from './pages/host/SellerDashboard';
import AddProduct from './pages/host/AddProduct.tsx';
import EditProduct from './pages/host/EditProduct.tsx';
import SellerOrders from './pages/host/SellerOrders.tsx';
import BatchPriceEditor from './pages/host/BatchPriceEditor.tsx';
import HostLayout from './components/layout/HostLayout';
import AIAdvisor from './components/shared/AIAdvisor';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import Wishlist from './pages/user/Wishlist';
import OrderHistory from './pages/user/OrderHistory';
import OrderDetails from './pages/user/OrderDetails';
import DoctorConsultation from './pages/user/DoctorConsultation';
import MyConsultations from './pages/user/MyConsultations';
import DoctorOnboarding from './pages/user/DoctorOnboarding';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirect if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'host') {
      return <Navigate to="/host/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Host-only Route component
const HostRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'host') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};


function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public routes (Authenticating) */}
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><Register /></PublicRoute>
          } />
          <Route path="/host-login" element={
            <PublicRoute><SellerLogin /></PublicRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Public browsing routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/user/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/user/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/user/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/consultations" element={<ProtectedRoute><DoctorConsultation /></ProtectedRoute>} />
          <Route path="/my-consultations" element={<ProtectedRoute><MyConsultations /></ProtectedRoute>} />
          <Route path="/register-doctor" element={<ProtectedRoute><DoctorOnboarding /></ProtectedRoute>} />

          {/* Seller routes */}
          <Route path="/host/*" element={
            <HostRoute>
              <HostLayout>
                <Routes>
                  <Route path="dashboard" element={<SellerDashboard />} />
                  <Route path="inventory" element={<HostInventory />} />
                  <Route path="bulk-operations" element={<BulkOperations />} />
                  <Route path="orders" element={<SellerOrders />} />
                  <Route path="batch-price-edit" element={<BatchPriceEditor />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit-product/:id" element={<EditProduct />} />
                </Routes>
              </HostLayout>
            </HostRoute>
          } />

          {/* Checkout route */}
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />

          {/* Protected routes */}
          {/* We'll add cart/profile as protected later when we build them */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AIAdvisor />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="App">
            <AppRoutes />
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import UserAccount from './components/UserAccount';
import AdminPanel from './components/AdminPanel';
import SearchOverlay from './components/SearchOverlay';
import Confirmation from './components/Confirmation';
import { Product, CartItem, User, Order, Address, OrderStatus } from './types';
import { Check, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'homepage' | 'shop' | 'detail' | 'checkout' | 'account' | 'admin' | 'confirmation'>('homepage');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'Dress' | 'Dive' | 'Chronograph' | 'All'>('All');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  
  // App States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [guestEmail, setGuestEmail] = useState('');

  // UI overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Custom premium Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Trigger Toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch initial catalog from API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products from API.', err);
    }
  };

  // Fetch user orders
  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${userId}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to retrieve order logs.', err);
    }
  };

  // Auto restore sessions on mount
  useEffect(() => {
    fetchProducts();

    const storedUser = localStorage.getItem('horologue_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        fetchOrders(parsedUser.id);
        
        // Load persisted cart specific to this user
        const userCart = localStorage.getItem(`horologue_cart_${parsedUser.id}`);
        if (userCart) {
          setCartItems(JSON.parse(userCart));
        }
      } catch (e) {
        localStorage.removeItem('horologue_user');
      }
    } else {
      // Load guest cart
      const guestCart = localStorage.getItem('horologue_cart_guest');
      if (guestCart) {
        setCartItems(JSON.parse(guestCart));
      }
    }
  }, []);

  // Update localStorage when cartItems changes
  useEffect(() => {
    const key = currentUser ? `horologue_cart_${currentUser.id}` : 'horologue_cart_guest';
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, currentUser]);

  // Handle Logins
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const user: User = await res.json();
        setCurrentUser(user);
        localStorage.setItem('horologue_user', JSON.stringify(user));
        showToast(`Authenticated successfully. Welcome back, ${user.fullName}.`, 'success');
        
        // Sync cart: If guest had items, merge or ask. Let's merge guest cart into user cart!
        const guestCartStr = localStorage.getItem('horologue_cart_guest');
        const userCartStr = localStorage.getItem(`horologue_cart_${user.id}`);
        
        let mergedCart: CartItem[] = userCartStr ? JSON.parse(userCartStr) : [];
        if (guestCartStr) {
          const guestCart: CartItem[] = JSON.parse(guestCartStr);
          guestCart.forEach((gItem) => {
            const existingIdx = mergedCart.findIndex((mItem) => mItem.productId === gItem.productId);
            if (existingIdx !== -1) {
              mergedCart[existingIdx].quantity = Math.min(
                gItem.product.stockCount,
                mergedCart[existingIdx].quantity + gItem.quantity
              );
            } else {
              mergedCart.push(gItem);
            }
          });
          // Clear guest cart
          localStorage.removeItem('horologue_cart_guest');
        }

        setCartItems(mergedCart);
        fetchOrders(user.id);
        return true;
      }
      return false;
    } catch (err) {
      showToast('Connection to server failed.', 'error');
      return false;
    }
  };

  // Handle Signup
  const handleSignup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      if (res.ok) {
        showToast('Registration successful.', 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast('Could not register account.', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      showToast(`Logged out of profile ${currentUser.fullName}.`, 'info');
    }
    setCurrentUser(null);
    localStorage.removeItem('horologue_user');
    // Reload guest cart or reset to empty
    const guestCart = localStorage.getItem('horologue_cart_guest');
    setCartItems(guestCart ? JSON.parse(guestCart) : []);
    setCurrentView('homepage');
  };

  // Save Address
  const handleSaveAddress = async (address: Address) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/users/addresses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify(address),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        localStorage.setItem('horologue_user', JSON.stringify(updatedUser));
        showToast('Delivery location stored.', 'success');
      }
    } catch (err) {
      showToast('Failed to write address.', 'error');
    }
  };

  // Add to cart
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.productId === product.id);
      if (existingIdx !== -1) {
        const newQty = Math.min(product.stockCount, prevItems[existingIdx].quantity + quantity);
        const copy = [...prevItems];
        copy[existingIdx].quantity = newQty;
        showToast(`Updated ${product.name} quantity to ${newQty} inside basket.`, 'success');
        return copy;
      } else {
        showToast(`Added ${product.name} to basket.`, 'success');
        return [...prevItems, { productId: product.id, product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  // Update quantity in cart
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity: Math.max(1, Math.min(item.product.stockCount, quantity)) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove from cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => {
      const removed = prev.find((item) => item.productId === productId);
      if (removed) {
        showToast(`Removed ${removed.product.name} from basket.`, 'info');
      }
      return prev.filter((item) => item.productId !== productId);
    });
  };

  // Place Order
  const handlePlaceOrder = async (shippingAddress: Address, guestEmailAddr?: string): Promise<Order> => {
    const itemsPayload = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentUser ? { 'Authorization': `Bearer ${currentUser.id}` } : {}),
        },
        body: JSON.stringify({
          items: itemsPayload,
          shippingAddress,
          guestEmail: guestEmailAddr,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to initialize order.');
      }

      const createdOrder: Order = await res.json();
      if (guestEmailAddr) {
        setGuestEmail(guestEmailAddr);
      }
      return createdOrder;
    } catch (err: any) {
      showToast(err.message || 'Error placing order.', 'error');
      throw err;
    }
  };

  // Record payment success
  const handlePaymentSuccess = async (orderId: string, paymentId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ razorpayPaymentId: paymentId }),
      });

      if (!res.ok) {
        throw new Error('Server could not capture simulated receipt.');
      }

      showToast(`Transaction captured. Order ID ${orderId} marked as PAID.`, 'success');
      setCartItems([]); // Clear cart upon success
      fetchProducts(); // Refresh stocks
      if (currentUser) {
        fetchOrders(currentUser.id);
      }
    } catch (err) {
      showToast('Payment captures failed to process.', 'error');
      throw err;
    }
  };

  const handleOrderCompleted = (completedOrder: Order) => {
    setLastPlacedOrder(completedOrder);
    setCurrentView('confirmation');
  };

  // Admin Actions
  const handleAddProductAdmin = async (productData: Partial<Product>) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        showToast('Blueprint recorded to catalogue.', 'success');
        fetchProducts();
      } else {
        const err = await res.json();
        throw new Error(err.error);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to append watch.', 'error');
      throw err;
    }
  };

  const handleUpdateProductAdmin = async (productId: string, updatedData: Partial<Product>) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        showToast('Catalog updated successfully.', 'success');
        fetchProducts();
      }
    } catch (err) {
      showToast('Catalog update failed.', 'error');
    }
  };

  const handleDeleteProductAdmin = async (productId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.id}`,
        },
      });

      if (res.ok) {
        showToast('Watch blueprint expunged from database.', 'info');
        fetchProducts();
      }
    } catch (err) {
      showToast('Deletion failed.', 'error');
    }
  };

  const handleUpdateOrderStatusAdmin = async (orderId: string, status: OrderStatus) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        showToast(`Order Status changed to: ${status}`, 'success');
        if (currentUser) {
          fetchOrders(currentUser.id);
        }
      }
    } catch (err) {
      showToast('Order transition failed.', 'error');
    }
  };

  // Render core views
  const renderView = () => {
    switch (currentView) {
      case 'homepage':
        return (
          <Homepage
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              setCurrentView('shop');
            }}
            onNavigateToFeatured={(pId) => {
              setSelectedProductId(pId);
              setCurrentView('detail');
            }}
            onViewChange={setCurrentView}
          />
        );

      case 'shop':
        return (
          <Shop
            products={products}
            onSelectProduct={(pId) => {
              setSelectedProductId(pId);
              setCurrentView('detail');
            }}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        );

      case 'detail':
        const selectedProd = products.find((p) => p.id === selectedProductId);
        if (!selectedProd) {
          return (
            <div className="pt-28 pb-16 text-center text-xs uppercase text-zinc-500 tracking-widest min-h-screen">
              Loading timepiece files...
            </div>
          );
        }
        const addedQty = cartItems.find((item) => item.productId === selectedProd.id)?.quantity || 0;
        return (
          <ProductDetail
            product={selectedProd}
            onBackToShop={() => setCurrentView('shop')}
            onAddToCart={handleAddToCart}
            cartItemQuantity={addedQty}
          />
        );

      case 'checkout':
        return (
          <Checkout
            cartItems={cartItems}
            currentUser={currentUser}
            onPlaceOrder={handlePlaceOrder}
            onPaymentSuccess={handlePaymentSuccess}
            onOrderCompleted={handleOrderCompleted}
          />
        );

      case 'account':
        return (
          <UserAccount
            currentUser={currentUser}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onSaveAddress={handleSaveAddress}
            orders={orders}
          />
        );

      case 'admin':
        return (
          <AdminPanel
            products={products}
            orders={orders}
            onAddProduct={handleAddProductAdmin}
            onUpdateProduct={handleUpdateProductAdmin}
            onDeleteProduct={handleDeleteProductAdmin}
            onUpdateOrderStatus={handleUpdateOrderStatusAdmin}
          />
        );

      case 'confirmation':
        if (!lastPlacedOrder) {
          return <Homepage onCategorySelect={setSelectedCategory} onNavigateToFeatured={setSelectedProductId} onViewChange={setCurrentView} />;
        }
        return (
          <Confirmation
            order={lastPlacedOrder}
            onExploreMore={() => {
              setSelectedCategory('All');
              setCurrentView('shop');
            }}
            onGoToAccount={() => {
              setCurrentView('account');
            }}
          />
        );

      default:
        return <Homepage onCategorySelect={setSelectedCategory} onNavigateToFeatured={setSelectedProductId} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast Notification */}
      {toast && (
        <div id="app-toast" className="fixed top-24 right-6 z-[120] max-w-sm bg-zinc-900 border border-zinc-800 p-4 shadow-2xl flex items-start gap-3 animate-fadeIn">
          {toast.type === 'success' && <Check size={18} className="text-gold shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />}
          
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold font-sans">Notification</p>
            <p className="text-xs text-zinc-200 mt-1 font-sans font-light leading-relaxed">{toast.message}</p>
          </div>

          <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation header */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSearchOpen={() => setIsSearchOpen(true)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Main Container */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Shared Footer */}
      <Footer onViewChange={(view) => {
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Slideout Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
        }}
      />

      {/* Full screen search overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(pId) => {
          setSelectedProductId(pId);
          setCurrentView('detail');
        }}
      />
    </div>
  );
}

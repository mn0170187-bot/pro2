import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Product, User, Order, Address, OrderStatus } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chrono Noir Limitée',
    brand: 'HOROLOGUE',
    category: 'Chronograph',
    price: 12500,
    description: 'The epitome of engineering excellence. A masterfully finished automatic chronograph featuring a deep charcoal sunray dial, an intricate 18K rose gold casing, and a genuine alligator strap. Built for those who demand ultimate precision.',
    movementType: 'Automatic',
    caseMaterial: '18K Rose Gold & Carbon Composite',
    strapMaterial: 'Matte Alligator Leather',
    waterResistance: '50m (5 ATM)',
    warrantyPeriod: '5 Years',
    stockCount: 8,
    featured: true,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPzHVpXEviMqRfAc3Q_1hQgNHMgaF9iVn8xE3igci8O3wSltI3LcFGNGhvf_JmIvw6jFvEqcHAJ7CUQQ6p4JnqdsVpp4TOx-fQei2wcYTY3x4KHC4X_XfMpHxS1VHtjvjno6OH3BqoYNd15OpE6vHX14ZoH8bPR8yrLts8RcQptPtcijv_pgVdjnQnQJ_-EiUjDXRJnxoEqLZVbfR4HzeLFLXiP_QiU0Mc4en_4AljKVOC2Jq2f6p_',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '2',
    name: 'Atelier Classic Dress',
    brand: 'HOROLOGUE',
    category: 'Dress',
    price: 7800,
    description: 'An elegant time-only mechanical dress watch. Ultra-slim profile in hand-finished 18K yellow gold, showcasing a pristine porcelain white dial with minimal gold indices. Absolute purity of form and function.',
    movementType: 'Manual',
    caseMaterial: '18K Yellow Gold',
    strapMaterial: 'Hand-Stitched Shell Cordovan Leather',
    waterResistance: '30m (3 ATM)',
    warrantyPeriod: '3 Years',
    stockCount: 15,
    featured: false,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCd4IDD7r8CAlB_ceKvFhX61w7zYoVbzf-PPudAki0bJh3FNqugviutji190PbAACq8OyXz8w_Lg-YF6KFzLTCw22mCTrAFndaDN5hpbD_WfIwg7ERHDk35-XbSqW9Dbxour9kxDNfJ89CQaS9t6zvNJi69PIMdD3QynhOSjN80qQnSj5qSu9fIQjJ9vkb6UUg8BYhpdyJ5iHmGRWsc9HyUJZ1-PpounhdafSzDJFKuYfaYCJ8N-8Wz',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '3',
    name: 'Oceanic Submerger',
    brand: 'HOROLOGUE',
    category: 'Dive',
    price: 9200,
    description: 'A professional-grade deep diving timepiece engineered to withstand extreme pressures. Features a sandblasted 904L grade stainless steel casing, a robust ceramic rotating bezel, and a super-luminova hands set for complete legibility.',
    movementType: 'Automatic',
    caseMaterial: '904L Stainless Steel',
    strapMaterial: 'Premium Vulcanized Rubber & Oyster Steel Bracelet',
    waterResistance: '300m (30 ATM)',
    warrantyPeriod: '5 Years',
    stockCount: 5,
    featured: false,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD54vsdACqhcqqYMxeMUFZA6I9nBGwbmDttb8pwjj4Q54xojzB4UpRdJizIjDV1dLT8UePiATG4EDosWfCHc14HK06OjBUNAd3IbxvVvlyLrRrWeBpoTG8DLxq-O8_byZpR1waPCM0jjOpTcaZk11Uyz0LFxLAFwW0uma8_e9Hz_f-Wy0WtAy3XGWQtjPDPf8D3AvGM_fHKg2Kn2tYbWP4W64uQEolx6AH_KpwyyxPrDSqHH-JuAtqc',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '4',
    name: 'Grand Chronograph S',
    brand: 'HOROLOGUE',
    category: 'Chronograph',
    price: 14200,
    description: 'Inspired by racing history, the Grand Chronograph features advanced dual-register sub-dials and an ultra-precise column wheel mechanism. The silver and slate high-contrast styling evokes mechanical mastery.',
    movementType: 'Automatic',
    caseMaterial: 'Grade 5 Titanium & Platinum Accent',
    strapMaterial: 'Perforated Racing Calfskin',
    waterResistance: '100m (10 ATM)',
    warrantyPeriod: '5 Years',
    stockCount: 4,
    featured: false,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDsygYzjuH4PglCCBHHAcUqmQjkABSrYpcCQJG0IVom-ig1BXlRKWucw2QPZNOCqIW-JtWXQ4cF7UHfkB-QbO75a9gJtPGYl-z5tFahNRPZbHgjefIGncaSEvVFLNMpH4dxMmLIfvwH0yMeH-VYF0ur4rNDzBXrOpU_vJ_O6QrStE_BUAtQpRtM62OYhbwtc30JRsYXOrA96-QwIoApjXrpTrwtdmq7QY4IQhiJSYoEZfty2SVkmjSq',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '5',
    name: 'Minimalist Platinum',
    brand: 'HOROLOGUE',
    category: 'Dress',
    price: 11000,
    description: 'An pure exercise in understatement. Solid 950 Platinum housing holding a mechanical caliber of unmatched slimness. Featuring clean linear hands and a silvered satin dial.',
    movementType: 'Manual',
    caseMaterial: '950 Platinum',
    strapMaterial: 'Nappa Calfskin',
    waterResistance: '30m (3 ATM)',
    warrantyPeriod: '3 Years',
    stockCount: 6,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '6',
    name: 'Abyss Professional',
    brand: 'HOROLOGUE',
    category: 'Dive',
    price: 8500,
    description: 'Our robust steel toolwatch with matte-black dial, date indicator, and deep-sea luminescence. Tailored for extreme exploration and flawless luxury presentation.',
    movementType: 'Automatic',
    caseMaterial: 'Brushed Oystersteel',
    strapMaterial: 'Oystersteel Bracelet',
    waterResistance: '200m (20 ATM)',
    warrantyPeriod: '4 Years',
    stockCount: 12,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

let dbProducts: Product[] = [...INITIAL_PRODUCTS];
let dbUsers: User[] = [
  {
    id: 'admin-id',
    email: 'admin@horologue.com',
    fullName: 'Horologue Custodian',
    savedAddresses: [
      {
        fullName: 'Horologue Custodian',
        addressLine1: '12 luxury Boulevard',
        addressLine2: 'Suite 24',
        city: 'Geneva',
        state: 'Geneva',
        postalCode: '1201',
        country: 'Switzerland',
        phone: '+41 22 730 21 11'
      }
    ],
    isAdmin: true
  },
  {
    id: 'user-id',
    email: 'collector@luxury.com',
    fullName: 'Julian Sterling',
    savedAddresses: [
      {
        fullName: 'Julian Sterling',
        addressLine1: '742 Park Avenue',
        addressLine2: 'Penthouse B',
        city: 'New York',
        state: 'NY',
        postalCode: '10021',
        country: 'United States',
        phone: '+1 212 555 0199'
      }
    ],
    isAdmin: false
  }
];

let dbOrders: Order[] = [
  {
    id: 'ORD-9843',
    userId: 'user-id',
    items: [
      {
        productId: '2',
        productName: 'Atelier Classic Dress',
        productBrand: 'HOROLOGUE',
        price: 7800,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd4IDD7r8CAlB_ceKvFhX61w7zYoVbzf-PPudAki0bJh3FNqugviutji190PbAACq8OyXz8w_Lg-YF6KFzLTCw22mCTrAFndaDN5hpbD_WfIwg7ERHDk35-XbSqW9Dbxour9kxDNfJ89CQaS9t6zvNJi69PIMdD3QynhOSjN80qQnSj5qSu9fIQjJ9vkb6UUg8BYhpdyJ5iHmGRWsc9HyUJZ1-PpounhdafSzDJFKuYfaYCJ8N-8Wz'
      }
    ],
    shippingAddress: {
      fullName: 'Julian Sterling',
      addressLine1: '742 Park Avenue',
      addressLine2: 'Penthouse B',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States',
      phone: '+1 212 555 0199'
    },
    totalAmount: 7800,
    status: 'delivered',
    paymentId: 'pay_sim_1abc123xyz',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  }
];

// Simple Auth helper middleware
function getUserIdFromHeaders(req: express.Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
}

// REST endpoints
// 1. Get products
app.get('/api/products', (req, res) => {
  res.json(dbProducts);
});

// 2. Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = dbProducts.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// 3. Admin: Create product
app.post('/api/products', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  const user = dbUsers.find(u => u.id === userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorised. Admin privileges required.' });
  }

  const { name, brand, category, price, description, movementType, caseMaterial, strapMaterial, waterResistance, warrantyPeriod, stockCount, images } = req.body;
  if (!name || !brand || !category || !price || !description || !movementType || !caseMaterial || !strapMaterial || !waterResistance || !warrantyPeriod || stockCount === undefined || !images || !images.length) {
    return res.status(400).json({ error: 'Missing required watch specifications.' });
  }

  const newProduct: Product = {
    id: (dbProducts.length + 1).toString(),
    name,
    brand,
    category,
    price: Number(price),
    description,
    movementType,
    caseMaterial,
    strapMaterial,
    waterResistance,
    warrantyPeriod,
    stockCount: Number(stockCount),
    images
  };

  dbProducts.push(newProduct);
  res.status(201).json(newProduct);
});

// 4. Admin: Update product
app.put('/api/products/:id', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  const user = dbUsers.find(u => u.id === userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorised. Admin privileges required.' });
  }

  const prodIndex = dbProducts.findIndex(p => p.id === req.params.id);
  if (prodIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = dbProducts[prodIndex];
  dbProducts[prodIndex] = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    stockCount: req.body.stockCount !== undefined ? Number(req.body.stockCount) : existing.stockCount
  };

  res.json(dbProducts[prodIndex]);
});

// 5. Admin: Delete product
app.delete('/api/products/:id', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  const user = dbUsers.find(u => u.id === userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorised. Admin privileges required.' });
  }

  const prodIndex = dbProducts.findIndex(p => p.id === req.params.id);
  if (prodIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = dbProducts.splice(prodIndex, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// 6. Sign up
app.post('/api/auth/signup', (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Missing registration details.' });
  }

  const exists = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const newUser: User = {
    id: 'user-' + Date.now(),
    email,
    fullName,
    savedAddresses: [],
    isAdmin: false
  };

  dbUsers.push(newUser);
  res.status(201).json(newUser);
});

// 7. Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password.' });
  }

  // Simple demo logic: check email, accept any password that matches standard length >= 4
  const user = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    res.json(user);
  } else if (email.toLowerCase() === 'admin@horologue.com') {
    // Autocreate admin if somehow missing
    const adminUser = dbUsers.find(u => u.isAdmin);
    res.json(adminUser);
  } else {
    res.status(401).json({ error: 'Invalid credentials. Try guest or register.' });
  }
});

// 8. Get current user profile
app.get('/api/auth/me', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  const user = dbUsers.find(u => u.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Not authenticated.' });
  }
});

// 9. Save Address
app.put('/api/users/addresses', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  const user = dbUsers.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const { fullName, addressLine1, addressLine2, city, state, postalCode, country, phone } = req.body;
  if (!fullName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
    return res.status(400).json({ error: 'Missing required address fields.' });
  }

  const newAddress: Address = {
    fullName,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    phone
  };

  user.savedAddresses = [newAddress, ...user.savedAddresses];
  res.json(user);
});

// 10. Get Orders
app.get('/api/orders', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const user = dbUsers.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Invalid session.' });
  }

  if (user.isAdmin) {
    // Admin sees all orders
    res.json(dbOrders);
  } else {
    // Regular user sees their own orders
    const orders = dbOrders.filter(o => o.userId === userId);
    res.json(orders);
  }
});

// Get order by guest email (for order tracking)
app.get('/api/orders/guest/:email', (req, res) => {
  const email = req.params.email;
  const orders = dbOrders.filter(o => o.guestEmail && o.guestEmail.toLowerCase() === email.toLowerCase());
  res.json(orders);
});

// 11. Create order
app.post('/api/orders', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  const { items, shippingAddress, guestEmail } = req.body;

  if (!items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: 'Missing order items or shipping details.' });
  }

  // Calculate order total & double check stock count
  let calculatedTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = dbProducts.find(p => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
    }
    if (product.stockCount < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}.` });
    }

    calculatedTotal += product.price * item.quantity;
    orderItems.push({
      productId: product.id,
      productName: product.name,
      productBrand: product.brand,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0]
    });
  }

  const newOrder: Order = {
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    userId,
    guestEmail: userId ? undefined : guestEmail,
    items: orderItems,
    shippingAddress,
    totalAmount: calculatedTotal,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  dbOrders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// 12. Complete payment (Razorpay Simulated Webhook/Callback Capture)
app.post('/api/orders/:id/pay', (req, res) => {
  const order = dbOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { razorpayPaymentId } = req.body;
  if (!razorpayPaymentId) {
    return res.status(400).json({ error: 'Missing Razorpay confirmation transaction ID.' });
  }

  // Decrease product stock levels upon payment confirmation
  for (const item of order.items) {
    const product = dbProducts.find(p => p.id === item.productId);
    if (product) {
      product.stockCount = Math.max(0, product.stockCount - item.quantity);
    }
  }

  order.status = 'paid';
  order.paymentStatus = 'completed';
  order.paymentId = razorpayPaymentId;

  res.json(order);
});

// 13. Admin: Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const userId = getUserIdFromHeaders(req);
  const user = dbUsers.find(u => u.id === userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorised. Admin privileges required.' });
  }

  const order = dbOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { status } = req.body;
  const validStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status transition requested.' });
  }

  order.status = status;
  if (status === 'paid' && order.paymentStatus !== 'completed') {
    order.paymentStatus = 'completed';
    order.paymentId = order.paymentId || 'pay_manual_' + Math.random().toString(36).substr(2, 9);
  }

  res.json(order);
});

// Vite server middleware configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HOROLOGUE Store Server listening on port ${PORT}`);
  });
}

startServer();

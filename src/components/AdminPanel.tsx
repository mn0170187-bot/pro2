import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { Settings, PlusCircle, Trash2, Edit, Sliders, Layers, RefreshCw, ChevronDown } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function AdminPanel({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Product Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('HOROLOGUE');
  const [category, setCategory] = useState<'Dress' | 'Dive' | 'Chronograph'>('Dress');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [movementType, setMovementType] = useState<'Automatic' | 'Quartz' | 'Manual'>('Automatic');
  const [caseMaterial, setCaseMaterial] = useState('');
  const [strapMaterial, setStrapMaterial] = useState('');
  const [waterResistance, setWaterResistance] = useState('50m (5 ATM)');
  const [warrantyPeriod, setWarrantyPeriod] = useState('5 Years');
  const [stockCount, setStockCount] = useState('');
  const [imageUrls, setImageUrls] = useState('');

  // Quick stock edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<string>('');

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !price || !description || !caseMaterial || !strapMaterial || !stockCount || !imageUrls) {
      setError('Please fill in all watch specifications.');
      return;
    }

    const imagesArray = imageUrls.split(',').map((url) => url.trim()).filter((url) => url.length > 0);
    if (!imagesArray.length) {
      setError('Please provide at least one valid image URL.');
      return;
    }

    const productData: Partial<Product> = {
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
      images: imagesArray,
    };

    try {
      await onAddProduct(productData);
      setSuccess('Timepiece registered in the boutique catalog!');
      setShowAddForm(false);
      // Reset state
      setName('');
      setPrice('');
      setDescription('');
      setCaseMaterial('');
      setStrapMaterial('');
      setStockCount('');
      setImageUrls('');
    } catch (err: any) {
      setError(err.message || 'Failed to register product.');
    }
  };

  const handleStockUpdate = async (productId: string) => {
    if (newStockVal === '' || isNaN(Number(newStockVal))) return;
    try {
      await onUpdateProduct(productId, { stockCount: Number(newStockVal) });
      setEditingStockId(null);
      setNewStockVal('');
    } catch (err) {
      setError('Failed to update stock count.');
    }
  };

  return (
    <div id="admin-panel-wrapper" className="min-h-screen pt-24 pb-16 px-6 md:px-20 bg-zinc-950 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gold tracking-[0.25em] uppercase font-semibold">CUSTODIAN CONTROL</p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-wide">Atelier Administrative Panel</h1>
            <p className="text-zinc-500 text-xs">Manage watch catalogs, verify real-time stock levels, and coordinate acquisitions.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('products');
                setShowAddForm(false);
              }}
              className={`px-5 py-2 text-xs uppercase tracking-widest border transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-white'
              }`}
            >
              Timepiece Catalog
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setShowAddForm(false);
              }}
              className={`px-5 py-2 text-xs uppercase tracking-widest border transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-white'
              }`}
            >
              Order Flow ({orders.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/20 border border-red-900 text-red-400 text-xs text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-950/20 border border-emerald-900 text-emerald-400 text-xs text-center">
            {success}
          </div>
        )}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-zinc-900/10 p-4 border border-zinc-900">
              <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-400">Timepiece Inventories</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-black px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all"
              >
                <PlusCircle size={14} />
                <span>Register Timepiece</span>
              </button>
            </div>

            {/* Expandable Form to Add Product */}
            {showAddForm && (
              <form onSubmit={handleCreateProduct} className="bg-zinc-900 p-6 border border-zinc-900 space-y-6 animate-fadeIn text-xs uppercase tracking-wider max-w-3xl mx-auto">
                <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                  <p className="text-sm font-serif tracking-wider text-gold lowercase">Register New Watch Blueprint</p>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500">Watch Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g. GMT Sovereign Noir"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Brand *</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="HOROLOGUE"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Category Selection *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none uppercase tracking-wider"
                    >
                      <option value="Dress">Dress</option>
                      <option value="Dive">Dive</option>
                      <option value="Chronograph">Chronograph</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Price in USD ($) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="E.g. 11500"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Movement Caliber Type *</label>
                    <select
                      value={movementType}
                      onChange={(e) => setMovementType(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none uppercase tracking-wider"
                    >
                      <option value="Automatic">Automatic Self-Winding</option>
                      <option value="Manual">Manual Hand-Wound</option>
                      <option value="Quartz">Quartz Precision</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Stock Count *</label>
                    <input
                      type="number"
                      value={stockCount}
                      onChange={(e) => setStockCount(e.target.value)}
                      placeholder="E.g. 5"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Case Material *</label>
                    <input
                      type="text"
                      value={caseMaterial}
                      onChange={(e) => setCaseMaterial(e.target.value)}
                      placeholder="E.g. 18K Yellow Gold or Oystersteel"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Strap details *</label>
                    <input
                      type="text"
                      value={strapMaterial}
                      onChange={(e) => setStrapMaterial(e.target.value)}
                      placeholder="E.g. Matte Alligator Leather"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Atmospheric resistance (Water) *</label>
                    <input
                      type="text"
                      value={waterResistance}
                      onChange={(e) => setWaterResistance(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-500">Warranty Term *</label>
                    <input
                      type="text"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Image URL hotlinks (Separate multiple with commas) *</label>
                  <textarea
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    rows={2}
                    placeholder="E.g. https://images.unsplash.com/... , https://images.unsplash.com/..."
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none lowercase"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Editorial Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Brief history, target audience and detailed design elements..."
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none normal-case"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black hover:bg-gold font-semibold tracking-widest uppercase transition-colors"
                >
                  Write Watch to Database
                </button>
              </form>
            )}

            {/* Products grid */}
            <div className="overflow-x-auto border border-zinc-900 bg-zinc-950/40">
              <table className="w-full text-left text-xs text-zinc-400">
                <thead className="bg-zinc-900 uppercase tracking-wider text-[10px] text-zinc-500">
                  <tr>
                    <th className="p-4">Watch Profile</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Movement</th>
                    <th className="p-4 text-center">In Stock</th>
                    <th className="p-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 uppercase">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-900/10">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-10 object-cover bg-zinc-950 border border-zinc-850 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-white tracking-wide">{product.name}</p>
                          <p className="text-[9px] text-zinc-500 tracking-widest">{product.brand}</p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-zinc-300">{product.category}</td>
                      <td className="p-4 font-mono font-medium text-zinc-300">${product.price.toLocaleString()}</td>
                      <td className="p-4 text-center text-zinc-400">{product.movementType}</td>
                      <td className="p-4 text-center">
                        {editingStockId === product.id ? (
                          <div className="flex items-center justify-center gap-1.5 max-w-[120px] mx-auto">
                            <input
                              type="number"
                              value={newStockVal}
                              onChange={(e) => setNewStockVal(e.target.value)}
                              className="w-12 bg-zinc-900 border border-zinc-800 text-white text-center py-0.5 rounded-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleStockUpdate(product.id)}
                              className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 text-[9px]"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="bg-zinc-900 text-zinc-500 px-1 py-0.5 text-[9px]"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStockId(product.id);
                              setNewStockVal(product.stockCount.toString());
                            }}
                            className={`px-3 py-1 text-xs border cursor-pointer hover:border-gold ${
                              product.stockCount === 0
                                ? 'bg-red-950/20 text-red-400 border-red-900'
                                : product.stockCount <= 3
                                ? 'bg-amber-950/20 text-amber-400 border-amber-900'
                                : 'bg-zinc-900 text-zinc-300 border-zinc-850'
                            }`}
                            title="Click to edit stock level"
                          >
                            {product.stockCount} Left
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Are you certain you want to remove ${product.name} from the catalog?`)) {
                              onDeleteProduct(product.id);
                            }
                          }}
                          className="text-zinc-650 hover:text-red-400 transition-colors inline-flex p-1"
                          title="Delete Watch"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-900 pb-3">Acquisition Pipeline</h2>

            {orders.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-900 text-zinc-500 uppercase tracking-widest">
                No store orders recorded on database.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-zinc-900 bg-zinc-900/20 p-6 space-y-6">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-900 pb-4 text-xs uppercase tracking-wider text-zinc-400">
                      <div>
                        Order Ref: <strong className="text-gold font-mono">{order.id}</strong>
                        <span className="text-zinc-700 mx-2">|</span>
                        Placed: <span className="text-white">{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-500">Change Status Flow:</span>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-zinc-950 border border-zinc-800 text-white px-3 py-1 text-[10px] focus:outline-none focus:border-gold uppercase tracking-wider rounded-none pr-8 appearance-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Customer & Shipping info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs uppercase tracking-wider text-zinc-500">
                      <div className="space-y-1.5 border-r border-zinc-900/50 pr-4">
                        <p className="font-semibold text-zinc-400">Customer Details</p>
                        <p className="text-zinc-300">Mail: <strong className="font-mono text-white normal-case">{order.guestEmail || 'Registered User'}</strong></p>
                        <p className="text-zinc-300">Buyer ID: <strong className="font-mono text-white">{order.userId || 'Guest'}</strong></p>
                        <p className="text-zinc-300">Transaction Ref: <strong className="font-mono text-zinc-400 normal-case">{order.paymentId || 'N/A'}</strong></p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-400">Shipping Destination</p>
                        <p className="text-zinc-300 font-bold text-white">{order.shippingAddress.fullName}</p>
                        <p className="text-zinc-300">{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p className="text-zinc-300">{order.shippingAddress.addressLine2}</p>}
                        <p className="text-zinc-300">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                        <p className="text-zinc-400">{order.shippingAddress.country} ({order.shippingAddress.phone})</p>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="border-t border-zinc-900 pt-4 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center text-xs">
                          <img
                            src={item.image}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-8 h-10 object-cover bg-zinc-950 border border-zinc-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-200 uppercase tracking-wide truncate">{item.productName}</p>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{item.productBrand} • Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-zinc-300 font-mono font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer / Summary bar */}
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-zinc-900 text-zinc-500">
                      <div>
                        Status Flow Step: <strong className="text-gold uppercase tracking-widest">{order.status}</strong>
                      </div>
                      <div>
                        Total captured: <strong className="text-sm font-semibold font-mono text-gold font-bold">${order.totalAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

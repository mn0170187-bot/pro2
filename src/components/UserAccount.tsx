import React, { useState } from 'react';
import { User, Address, Order, OrderStatus } from '../types';
import { Mail, Lock, User as UserIcon, MapPin, ClipboardList, CheckCircle, Clock, Truck, ShieldCheck, Plus, Trash2 } from 'lucide-react';

interface UserAccountProps {
  currentUser: User | null;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (email: string, password: string, fullName: string) => Promise<boolean>;
  onSaveAddress: (address: Address) => Promise<void>;
  orders: Order[];
}

export default function UserAccount({
  currentUser,
  onLogin,
  onSignup,
  onSaveAddress,
  orders,
}: UserAccountProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Address form fields
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [adrFullName, setAdrFullName] = useState('');
  const [adrLine1, setAdrLine1] = useState('');
  const [adrLine2, setAdrLine2] = useState('');
  const [adrCity, setAdrCity] = useState('');
  const [adrState, setAdrState] = useState('');
  const [adrPostalCode, setAdrPostalCode] = useState('');
  const [adrCountry, setAdrCountry] = useState('Switzerland');
  const [adrPhone, setAdrPhone] = useState('');

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (!isLoginView && !fullName)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isLoginView) {
        const ok = await onLogin(email, password);
        if (!ok) {
          setError('Invalid login details. Try developer collector account: collector@luxury.com with any password.');
        }
      } else {
        const ok = await onSignup(email, password, fullName);
        if (ok) {
          setSuccess('Account created! Logging you in...');
          setTimeout(() => {
            onLogin(email, password);
          }, 1000);
        } else {
          setError('Email is already registered.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adrFullName || !adrLine1 || !adrCity || !adrState || !adrPostalCode || !adrPhone) {
      setError('Please fill in all required address fields.');
      return;
    }

    const newAddress: Address = {
      fullName: adrFullName,
      addressLine1: adrLine1,
      addressLine2: adrLine2 || undefined,
      city: adrCity,
      state: adrState,
      postalCode: adrPostalCode,
      country: adrCountry,
      phone: adrPhone,
    };

    try {
      await onSaveAddress(newAddress);
      setSuccess('Shipping address saved successfully!');
      setShowAddressForm(false);
      // Clear address fields
      setAdrFullName('');
      setAdrLine1('');
      setAdrLine2('');
      setAdrCity('');
      setAdrState('');
      setAdrPostalCode('');
      setAdrPhone('');
    } catch (err) {
      setError('Failed to save address.');
    }
  };

  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 0;
      case 'paid': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const renderStatusFlow = (status: OrderStatus) => {
    const currentIndex = getStatusStepIndex(status);
    const stages = [
      { key: 'pending', label: 'Pending', icon: Clock },
      { key: 'paid', label: 'Paid', icon: CheckCircle },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: ShieldCheck },
    ];

    return (
      <div className="w-full py-4 px-2">
        <div className="relative flex items-center justify-between">
          {/* Connector bar */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-zinc-800 z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gold transition-all duration-700 z-0"
            style={{ width: `${(currentIndex / 3) * 100}%` }}
          />

          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const isFuture = idx > currentIndex;

            return (
              <div key={stage.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted
                      ? 'bg-zinc-950 border-gold text-gold'
                      : isActive
                      ? 'bg-gold border-gold text-black font-semibold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                  title={stage.label}
                >
                  <Icon size={12} />
                </div>
                <span
                  className={`text-[8px] uppercase tracking-widest mt-1.5 ${
                    isActive ? 'text-gold font-bold' : isCompleted ? 'text-zinc-300' : 'text-zinc-650'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 1. Not Authenticated View
  if (!currentUser) {
    return (
      <div id="auth-container" className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center bg-zinc-950 text-white font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-900/80 p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-white">
              {isLoginView ? 'Atelier Access' : 'Register Profile'}
            </h2>
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
              {isLoginView ? 'Enter your credentials to manage orders' : 'Join the HOROLOGUE collectors circle'}
            </p>
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

          <form onSubmit={handleSubmitAuth} className="space-y-4">
            {!isLoginView && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-650" size={14} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Julian Sterling"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-650" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="concierge@horologue.com"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-650" size={14} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-gold rounded-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-350"
            >
              {isLoginView ? 'Sign In' : 'Create Profile'}
            </button>
          </form>

          {/* Preset details for testing convenience */}
          {isLoginView && (
            <div className="bg-zinc-950/40 border border-zinc-900 p-4 text-center text-[10px] text-zinc-500 space-y-1.5 font-sans">
              <p className="font-semibold text-zinc-400">DEMO COLLECTOR ACCOUNT</p>
              <p>Email: <strong className="text-zinc-300">collector@luxury.com</strong></p>
              <p>Password: <strong className="text-zinc-300">any password</strong> (min 4 chars)</p>
              <p className="text-[9px] text-zinc-600">Admin Account: admin@horologue.com</p>
            </div>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLoginView(!isLoginView)}
              className="text-xs text-zinc-500 hover:text-gold transition-colors"
            >
              {isLoginView ? "Don't have an account? Register Profile" : 'Already registered? Log in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated View
  return (
    <div id="account-dashboard-wrapper" className="min-h-screen pt-24 pb-16 px-6 md:px-20 bg-zinc-950 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner */}
        <div className="border-b border-zinc-900 pb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gold tracking-[0.25em] uppercase font-semibold">WELCOME BACK</p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-wide">{currentUser.fullName}</h1>
            <p className="text-zinc-500 text-xs font-mono">{currentUser.email} • Circle Member</p>
          </div>
          {currentUser.isAdmin && (
            <div className="bg-gold/10 border border-gold text-gold text-[10px] px-3 py-1 uppercase tracking-widest font-semibold self-start sm:self-auto">
              Staff / Custodian Access
            </div>
          )}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Account Addresses (Takes 5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900/30 border border-zinc-900 p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300 flex items-center gap-2">
                  <MapPin size={14} className="text-gold" />
                  <span>Saved Delivery Locations</span>
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs text-gold hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
                >
                  <Plus size={14} />
                  <span>Add New</span>
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="space-y-3 bg-zinc-950 p-4 border border-zinc-850 animate-fadeIn">
                  <p className="text-[10px] tracking-widest text-gold uppercase pb-1 border-b border-zinc-900">NEW SHIPPING ADDRESS</p>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500">Consignee Name *</label>
                    <input
                      type="text"
                      value={adrFullName}
                      onChange={(e) => setAdrFullName(e.target.value)}
                      placeholder="E.g. Julian Sterling"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500">Address Line 1 *</label>
                    <input
                      type="text"
                      value={adrLine1}
                      onChange={(e) => setAdrLine1(e.target.value)}
                      placeholder="Street, suite, flat number"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={adrLine2}
                      onChange={(e) => setAdrLine2(e.target.value)}
                      placeholder="Building details"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">City *</label>
                      <input
                        type="text"
                        value={adrCity}
                        onChange={(e) => setAdrCity(e.target.value)}
                        placeholder="Zurich"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">State / Province *</label>
                      <input
                        type="text"
                        value={adrState}
                        onChange={(e) => setAdrState(e.target.value)}
                        placeholder="ZH"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Postal Code *</label>
                      <input
                        type="text"
                        value={adrPostalCode}
                        onChange={(e) => setAdrPostalCode(e.target.value)}
                        placeholder="8001"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Country *</label>
                      <input
                        type="text"
                        value={adrCountry}
                        onChange={(e) => setAdrCountry(e.target.value)}
                        placeholder="Switzerland"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500">Contact Number *</label>
                    <input
                      type="tel"
                      value={adrPhone}
                      onChange={(e) => setAdrPhone(e.target.value)}
                      placeholder="+41 44 123 4567"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-white text-black font-semibold text-[10px] tracking-wider uppercase hover:bg-gold transition-colors"
                    >
                      Save Location
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 py-2 border border-zinc-800 text-zinc-400 text-[10px] tracking-wider uppercase hover:bg-zinc-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {currentUser.savedAddresses.length === 0 ? (
                <p className="text-xs text-zinc-500 italic text-center py-4">No saved addresses found. Add one above to facilitate checkout.</p>
              ) : (
                <div className="space-y-4">
                  {currentUser.savedAddresses.map((addr, idx) => (
                    <div key={idx} className="p-4 border border-zinc-850 bg-zinc-950/60 relative space-y-1">
                      <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wide">
                        {addr.fullName} {idx === 0 && <span className="text-[8px] text-gold border border-gold/35 px-1 py-0.2 ml-1">Primary</span>}
                      </div>
                      <p className="text-xs text-zinc-400">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-xs text-zinc-400">{addr.addressLine2}</p>}
                      <p className="text-xs text-zinc-400">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">{addr.country}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-1 pt-1 border-t border-zinc-900">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order History & Tracking (Takes 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300 flex items-center gap-2 border-b border-zinc-900 pb-3">
              <ClipboardList size={14} className="text-gold" />
              <span>Acquisition History</span>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-900 text-zinc-500 space-y-2">
                <p className="text-xs uppercase tracking-widest">No past orders discovered.</p>
                <p className="text-[10px]">Your luxury acquisitions will populate here.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="border border-zinc-900 bg-zinc-900/20 p-6 space-y-6 shadow-md">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-900 pb-4 text-xs">
                      <div>
                        <span className="font-mono text-zinc-400 font-bold text-sm text-gold">{order.id}</span>
                        <span className="text-zinc-600 mx-2">•</span>
                        <span className="text-zinc-400">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Payment:</span>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
                          order.paymentStatus === 'completed'
                            ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400'
                            : 'bg-red-950/20 border-red-900 text-red-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Items lines */}
                    <div className="space-y-4">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex gap-4 items-center">
                          <img
                            src={item.image}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-12 h-16 object-cover bg-zinc-950 border border-zinc-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wide truncate">{item.productName}</h4>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">{item.productBrand} • Qty {item.quantity}</p>
                          </div>
                          <span className="text-xs font-mono text-zinc-300 font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress tracker */}
                    <div className="bg-zinc-950/60 p-4 border border-zinc-900/60">
                      <p className="text-[8px] uppercase tracking-widest text-zinc-500 mb-4 text-center">Acquisition Status Flow</p>
                      {renderStatusFlow(order.status)}
                    </div>

                    {/* Total info */}
                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="text-zinc-500 uppercase tracking-widest">Grand Total:</span>
                      <span className="text-sm font-semibold font-mono text-gold font-bold">${order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Address, CartItem, User, Order } from '../types';
import { ShieldCheck, Truck, Lock, CreditCard } from 'lucide-react';
import RazorpayModal from './RazorpayModal';

interface CheckoutProps {
  cartItems: CartItem[];
  currentUser: User | null;
  onPlaceOrder: (shippingAddress: Address, guestEmail?: string) => Promise<Order>;
  onPaymentSuccess: (orderId: string, paymentId: string) => Promise<void>;
  onOrderCompleted: (order: Order) => void;
}

export default function Checkout({
  cartItems,
  currentUser,
  onPlaceOrder,
  onPaymentSuccess,
  onOrderCompleted,
}: CheckoutProps) {
  const [fullName, setFullName] = useState(currentUser?.savedAddresses[0]?.fullName || '');
  const [addressLine1, setAddressLine1] = useState(currentUser?.savedAddresses[0]?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(currentUser?.savedAddresses[0]?.addressLine2 || '');
  const [city, setCity] = useState(currentUser?.savedAddresses[0]?.city || '');
  const [state, setState] = useState(currentUser?.savedAddresses[0]?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.savedAddresses[0]?.postalCode || '');
  const [country, setCountry] = useState(currentUser?.savedAddresses[0]?.country || 'Switzerland');
  const [phone, setPhone] = useState(currentUser?.savedAddresses[0]?.phone || '');
  const [guestEmail, setGuestEmail] = useState('');

  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState('');

  // Razorpay triggers
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleAutofillSaved = (address: Address) => {
    setFullName(address.fullName);
    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2 || '');
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setPhone(address.phone);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !addressLine1 || !city || !state || !postalCode || !phone) {
      setError('Please fill in all required delivery fields.');
      return;
    }

    if (!currentUser && !guestEmail) {
      setError('Please enter your email address for order confirmation.');
      return;
    }

    setIsPlacing(true);

    const shippingAddress: Address = {
      fullName,
      addressLine1,
      addressLine2: addressLine2 || undefined,
      city,
      state,
      postalCode,
      country,
      phone,
    };

    try {
      const order = await onPlaceOrder(shippingAddress, currentUser ? undefined : guestEmail);
      setActiveOrder(order);
      setIsRazorpayOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setIsPlacing(false);
    }
  };

  const handleRazorpaySuccess = async (paymentId: string) => {
    if (!activeOrder) return;
    try {
      await onPaymentSuccess(activeOrder.id, paymentId);
      setIsRazorpayOpen(false);

      // Construct completed order details to pass up
      const completedOrder = {
        ...activeOrder,
        status: 'paid' as const,
        paymentStatus: 'completed' as const,
        paymentId,
      };

      onOrderCompleted(completedOrder);
    } catch (err) {
      setError('Failed to record payment transaction details. Contact concierge.');
    }
  };

  const handleRazorpayFailure = (reason: string) => {
    setIsRazorpayOpen(false);
    setError(`Payment simulation failed: ${reason}. You can retry clicking the Place Order button.`);
  };

  return (
    <div id="checkout-page-wrapper" className="min-h-screen pt-24 pb-20 px-6 md:px-20 bg-zinc-950 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Banner */}
        <div className="border-b border-zinc-900 pb-6 space-y-2">
          <p className="text-xs text-gold tracking-[0.25em] uppercase font-semibold">SECURE CHECKOUT</p>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-wide">Acquisition Checkout</h1>
        </div>

        {error && (
          <div className="p-3 bg-red-950/20 border border-red-900 text-red-400 text-xs text-center uppercase tracking-wide">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Shipping Address Form (Takes 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCheckoutSubmit} className="space-y-6 text-xs uppercase tracking-wider text-zinc-400">
              {/* Logged in Autofill shortcut */}
              {currentUser && currentUser.savedAddresses.length > 0 && (
                <div className="bg-zinc-900/35 border border-zinc-900 p-4 space-y-3">
                  <p className="text-[10px] tracking-widest text-gold font-semibold">AUTOFILL SAVED LOCATION</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.savedAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAutofillSaved(addr)}
                        className="px-3 py-1.5 border border-zinc-850 hover:border-gold hover:text-white transition-colors bg-zinc-950"
                      >
                        {addr.fullName} ({addr.city})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Guest email verification */}
              {!currentUser && (
                <div className="space-y-3 bg-zinc-900/35 border border-zinc-900 p-5">
                  <p className="text-[10px] tracking-widest text-gold font-semibold">GUEST CONTACT DETAILS</p>
                  <div className="space-y-1">
                    <label className="text-zinc-500">Email Address *</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="concierge@horologue.com"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold rounded-none lowercase normal-case"
                      required
                    />
                    <p className="text-[9px] text-zinc-500 lowercase normal-case">Required for guest order history tracking and receipts.</p>
                  </div>
                </div>
              )}

              <div className="bg-zinc-900/20 border border-zinc-900 p-6 space-y-5">
                <p className="text-[10px] tracking-widest text-gold font-semibold border-b border-zinc-900 pb-2">CONSIGNEE SHIPPING ADDRESS</p>

                <div className="space-y-1">
                  <label className="text-zinc-500">Full Legal Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Julian Sterling"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Street Address *</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Street name, suite, flat number"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Apartment, unit, villa details"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Zurich"
                      className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500">State / Province *</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="ZH"
                      className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="8001"
                      className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500">Country *</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Switzerland"
                      className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Contact Telephone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 44 123 4567"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold rounded-none"
                    required
                  />
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isPlacing || cartItems.length === 0}
                className="w-full py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-gold disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors flex items-center justify-center gap-2"
              >
                {isPlacing ? (
                  <span>TRANSMITTING BLUEPRINTS...</span>
                ) : (
                  <>
                    <CreditCard size={14} />
                    <span>Proceed to Razorpay Payment</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Summary (Takes 5 cols) */}
          <div className="lg:col-span-5 bg-zinc-900/35 border border-zinc-900 p-6 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] border-b border-zinc-900 pb-3 text-zinc-300">
              Acquisition Summary
            </h3>

            {/* List items */}
            <div className="divide-y divide-zinc-900 max-h-72 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.productId} className="py-4 flex gap-4 first:pt-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-14 object-cover bg-zinc-950 border border-zinc-850 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide truncate text-zinc-200">
                        {item.product.name}
                      </h4>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">
                        {item.product.brand} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      ${item.product.price.toLocaleString()} each
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-300 self-center">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-zinc-900 pt-4 space-y-2.5 text-xs uppercase tracking-wider text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span>Premium courier shipping</span>
                <span className="text-gold text-[9px] font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Customs &amp; Duties</span>
                <span className="text-zinc-500 text-[10px]">Duty-Paid</span>
              </div>
              <div className="w-full h-px bg-zinc-900 my-2" />
              <div className="flex justify-between text-white text-sm font-semibold">
                <span>Total Amount Due</span>
                <span className="font-mono text-gold text-base font-bold">${subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="space-y-3 bg-zinc-950/60 p-4 border border-zinc-900/60 text-[10px] text-zinc-500 normal-case">
              <div className="flex items-start gap-2">
                <Truck size={14} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px]">Secured Express Shipping</p>
                  <p className="mt-0.5 leading-relaxed">Fully insured delivery with premium dispatch carriers. Requires direct signature.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Lock size={14} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px]">256-Bit SSL Encryption</p>
                  <p className="mt-0.5 leading-relaxed">All operations are private and secure. Your personal credentials remain protected.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Interactive Overlay */}
      {activeOrder && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          amount={activeOrder.totalAmount}
          orderId={activeOrder.id}
          onSuccess={handleRazorpaySuccess}
          onFailure={handleRazorpayFailure}
        />
      )}
    </div>
  );
}

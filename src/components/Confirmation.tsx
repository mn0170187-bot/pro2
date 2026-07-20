import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Calendar, ArrowRight, ClipboardList, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface ConfirmationProps {
  order: Order;
  onExploreMore: () => void;
  onGoToAccount: () => void;
}

export default function Confirmation({ order, onExploreMore, onGoToAccount }: ConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4); // 4 days estimated delivery

  return (
    <div id="order-confirmation-container" className="min-h-screen pt-24 pb-20 px-4 md:px-20 bg-zinc-950 text-white font-sans animate-fadeIn">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Success Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-gold/30 text-gold mb-2">
            <CheckCircle2 size={32} className="text-gold" />
          </div>
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase font-semibold">TRANSACTION COMPLETED</p>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-wide">Acquisition Confirmed</h1>
          <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Thank you for your trust. Your order has been registered in our Swiss atelier. A dispatch specialist will contact you shortly.
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase font-semibold">Order Reference ID</p>
            <p className="font-mono text-base font-bold text-gold tracking-wide">{order.id}</p>
            {order.guestEmail && (
              <p className="text-[9px] text-zinc-400">
                Tracking as guest via <strong className="text-zinc-300">{order.guestEmail}</strong>. Please preserve this code.
              </p>
            )}
          </div>
          
          <button
            onClick={handleCopyId}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-gold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors shrink-0 font-medium"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-zinc-400" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Delivery & Shipping */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 space-y-6">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Delivery Details
              </h3>
            </div>
            
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-semibold">Consignee</p>
                <p className="text-zinc-200 font-semibold mt-1 uppercase tracking-wide">{order.shippingAddress.fullName}</p>
              </div>

              <div>
                <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-semibold">Shipping Destination</p>
                <div className="text-zinc-300 space-y-0.5 mt-1">
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p className="uppercase tracking-wider text-zinc-400 font-semibold mt-1">{order.shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-semibold">Contact Telephone</p>
                <p className="text-zinc-300 font-mono mt-1">{order.shippingAddress.phone}</p>
              </div>

              <div className="pt-2 border-t border-zinc-900/60 flex items-start gap-2.5 text-zinc-400">
                <Calendar size={16} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-300 uppercase tracking-wider text-[8px]">Estimated Air Dispatch</p>
                  <p className="text-[11px] leading-relaxed mt-0.5">
                    {deliveryDate.toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timepiece Summary */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 space-y-6">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Purchased Timepieces
              </h3>
            </div>

            {/* List items */}
            <div className="divide-y divide-zinc-900 max-h-56 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex gap-3 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-10 h-14 object-cover bg-zinc-950 border border-zinc-850 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide truncate text-zinc-200">
                        {item.productName}
                      </h4>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">
                        Qty {item.quantity} • {item.productBrand}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">
                      ${item.price.toLocaleString()} each
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-300 self-center">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-zinc-900 pt-4 flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-zinc-400">Total Acquired</span>
              <span className="font-mono text-gold text-lg font-bold">${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="bg-zinc-950 p-5 border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-500">
          <div className="flex gap-3">
            <ShieldCheck size={18} className="text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-400 uppercase tracking-wider text-[9px]">Insured Safe Transit</p>
              <p className="mt-1 leading-relaxed text-[11px]">All our watch packages are dispatched in a specialized sealed container with full luxury value insurance coverage.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-400 uppercase tracking-wider text-[9px]">Atelier Warranty Card</p>
              <p className="mt-1 leading-relaxed text-[11px]">Your serial numbers are engraved and registered in our database. A physical warranty card is included inside the box.</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onExploreMore}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-gold transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue to Boutique</span>
            <ArrowRight size={14} />
          </button>
          
          <button
            onClick={onGoToAccount}
            className="w-full sm:w-auto px-8 py-3.5 border border-zinc-800 text-zinc-400 hover:text-white hover:border-gold font-semibold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
          >
            <ClipboardList size={14} />
            <span>View All Acquisitions</span>
          </button>
        </div>

      </div>
    </div>
  );
}

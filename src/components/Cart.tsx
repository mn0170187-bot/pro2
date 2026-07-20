import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
}: CartProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer container */}
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-900 text-white flex flex-col h-full shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/10">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-gold" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Shopping Basket</h2>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 font-mono">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Basket Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-850">
                  <ShoppingBag size={20} />
                </div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Your basket is currently empty.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-gold text-xs uppercase tracking-widest transition-colors"
                >
                  Return to Boutique
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-900">
                {cartItems.map((item) => (
                  <div key={item.productId} className="py-5 flex gap-4 first:pt-0">
                    {/* Watch thumbnail */}
                    <div className="w-20 aspect-[3/4] bg-zinc-900 border border-zinc-900 overflow-hidden shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details block */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs tracking-wider uppercase font-semibold text-zinc-200 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromCart(item.productId)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gold tracking-widest uppercase">
                          {item.product.brand}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        {/* Quantity picker */}
                        <div className="flex items-center border border-zinc-900 bg-zinc-900/30 text-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 text-zinc-500 hover:text-white disabled:text-zinc-800 transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-6 text-center font-mono text-zinc-300">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stockCount}
                            className="p-1.5 text-zinc-500 hover:text-white disabled:text-zinc-850 transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Line total */}
                        <span className="text-xs font-mono text-zinc-300">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer actions */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-zinc-900 bg-zinc-900/10 space-y-6">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Premium shipping</span>
                  <span className="text-gold uppercase tracking-widest font-semibold text-[10px]">Complimentary</span>
                </div>
                <div className="w-full h-px bg-zinc-900 my-2" />
                <div className="flex justify-between text-white text-sm font-semibold">
                  <span>Grand Total</span>
                  <span className="font-mono text-gold">${subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onCheckout}
                  className="w-full py-4 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-gold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-transparent text-zinc-400 hover:text-white text-xs tracking-widest uppercase transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

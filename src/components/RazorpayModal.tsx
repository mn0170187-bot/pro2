import React, { useState } from 'react';
import { X, CreditCard, Landmark, QrCode, Wallet, ShieldCheck } from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (reason: string) => void;
}

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  orderId,
  onSuccess,
  onFailure,
}: RazorpayModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'net' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = (status: 'success' | 'fail') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (status === 'success') {
        const fakePaymentId = 'pay_rzp_' + Math.random().toString(36).substring(2, 11);
        onSuccess(fakePaymentId);
      } else {
        onFailure('Simulated payment declined by user or bank.');
      }
    }, 1500);
  };

  return (
    <div id="razorpay-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div id="razorpay-container" className="w-full max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-none shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold flex items-center justify-center text-black font-serif font-bold text-lg">
              H
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wider text-gold font-medium">HOROLOGUE</h3>
              <p className="text-xs text-zinc-400">Order Ref: {orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex justify-between items-center text-sm">
          <span className="text-zinc-400">Amount to Pay</span>
          <span className="font-mono text-gold text-lg font-bold">${amount.toLocaleString()}</span>
        </div>

        {/* Content */}
        {isProcessing ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm tracking-widest text-gold animate-pulse">SECURING CONNECTION...</p>
            <p className="text-xs text-zinc-500">Please do not refresh or close this window.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="text-xs text-zinc-400 tracking-wider uppercase mb-2">Select Payment Method</div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-4 border flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === 'card'
                    ? 'border-gold bg-zinc-800 text-gold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard size={18} />
                <span className="text-xs font-semibold">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`p-4 border flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === 'upi'
                    ? 'border-gold bg-zinc-800 text-gold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <QrCode size={18} />
                <span className="text-xs font-semibold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('net')}
                className={`p-4 border flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === 'net'
                    ? 'border-gold bg-zinc-800 text-gold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Landmark size={18} />
                <span className="text-xs font-semibold">Netbanking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('wallet')}
                className={`p-4 border flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === 'wallet'
                    ? 'border-gold bg-zinc-800 text-gold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Wallet size={18} />
                <span className="text-xs font-semibold">Wallet</span>
              </button>
            </div>

            {/* Simulated options for specific method */}
            <div className="bg-zinc-950 p-4 border border-zinc-800 text-xs text-zinc-400 space-y-2">
              {selectedMethod === 'card' && (
                <div>
                  <p className="font-semibold text-zinc-300 mb-1">Simulated Card Payment</p>
                  <p>Secured via 256-bit encryption. Supports Visa, Mastercard, and RuPay.</p>
                </div>
              )}
              {selectedMethod === 'upi' && (
                <div>
                  <p className="font-semibold text-zinc-300 mb-1">Simulated Instant UPI Transfer</p>
                  <p>Supports Google Pay, PhonePe, Paytm, and BHIM applet routing.</p>
                </div>
              )}
              {selectedMethod === 'net' && (
                <div>
                  <p className="font-semibold text-zinc-300 mb-1">Simulated Corporate Netbanking</p>
                  <p>Direct premium routing for SBI, HDFC, ICICI, Axis and major banks.</p>
                </div>
              )}
              {selectedMethod === 'wallet' && (
                <div>
                  <p className="font-semibold text-zinc-300 mb-1">Simulated Mobile Wallet</p>
                  <p>Instant capture from credit balance and premium rewards wallets.</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => handlePay('success')}
                className="flex-1 py-3 bg-white text-black font-semibold text-sm hover:bg-gold transition-all tracking-wider uppercase"
              >
                Simulate Success
              </button>
              <button
                type="button"
                onClick={() => handlePay('fail')}
                className="flex-1 py-3 border border-zinc-700 text-zinc-300 hover:bg-red-950 hover:border-red-800 text-sm hover:text-white transition-all tracking-wider uppercase"
              >
                Simulate Failure
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Razorpay Secure | PCI-DSS Compliant</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

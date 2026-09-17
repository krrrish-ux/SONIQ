import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Check, ShieldCheck, Truck, Package, ArrowRight, Sparkles } from 'lucide-react';
import { HeadphoneColor } from '../types';
import { PRODUCT_COLORS } from '../data/productData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: HeadphoneColor;
  onSelectColor: (color: HeadphoneColor) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedColor,
  onSelectColor,
}) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(true);

      // Trigger high-end confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#38bdf8', '#818cf8', '#ffffff'],
        });
      } catch {}
    }, 900);
  };

  const handleReset = () => {
    setOrderPlaced(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-md h-full bg-[#090a0f] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto p-6 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono-tech tracking-[0.25em] text-cyan-400 uppercase">
                  ORDER SUMMARY
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-0.5">
                  SONIQ GENESIS 01
                </h3>
              </div>
              <button
                id="close-checkout-modal"
                onClick={onClose}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderPlaced ? (
              /* Success Confirmation View */
              <div className="my-auto py-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <Check className="w-8 h-8" />
                </div>

                <span className="text-xs font-mono-tech tracking-[0.2em] text-cyan-400 uppercase">
                  ORDER CONFIRMED
                </span>
                <h4 className="text-2xl font-bold font-display text-white mt-1 mb-3">
                  Welcome to SONIQ Audio
                </h4>
                <p className="text-sm text-zinc-300 font-light leading-relaxed max-w-xs mb-6">
                  Your custom pair in <strong className="text-white">{selectedColor.name}</strong> is being calibrated. Tracking credentials have been dispatched.
                </p>

                <div className="w-full p-4 rounded-xl bg-zinc-900/80 border border-white/10 font-mono-tech text-xs text-left space-y-2 mb-8">
                  <div className="flex justify-between text-zinc-400">
                    <span>Order No:</span>
                    <span className="text-white font-bold">#SNQ-94812</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Dispatch Carrier:</span>
                    <span className="text-cyan-300">DHL Express Next-Day</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Est. Delivery:</span>
                    <span className="text-white">Tomorrow by 4:00 PM</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono-tech text-xs font-bold tracking-[0.2em] transition-all"
                >
                  RETURN TO SHOWCASE
                </button>
              </div>
            ) : (
              /* Order Details View */
              <div className="flex-1 py-6 space-y-6">
                {/* Product Preview Card */}
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/5 flex items-center gap-4">
                  <div
                    style={{ backgroundColor: selectedColor.metalColor }}
                    className="w-16 h-16 rounded-xl border border-white/20 flex items-center justify-center text-white/50 text-xs font-mono-tech"
                  >
                    3D
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white font-display">
                      Genesis 01 Spatial Headphone
                    </div>
                    <div className="text-xs text-cyan-400 font-mono-tech mt-0.5">
                      {selectedColor.name}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">$299.00 USD</div>
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="text-xs font-mono-tech tracking-wider text-zinc-400 uppercase block mb-2.5">
                    Select Finish
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {Object.values(PRODUCT_COLORS).map((c) => {
                      const active = selectedColor.id === c.id;
                      return (
                        <button
                          key={c.id}
                          id={`drawer-color-${c.id}`}
                          onClick={() => onSelectColor(c)}
                          className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                            active
                              ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                              : 'bg-zinc-950/50 border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200'
                          }`}
                        >
                          <span
                            style={{ backgroundColor: c.metalColor }}
                            className="w-4 h-4 rounded-full border border-white/30"
                          />
                          <span className="text-[11px] font-mono-tech tracking-wide leading-tight truncate">
                            {c.name.replace('Phantom ', '').replace('Titanium ', '').replace('Cyber ', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Included in Box */}
                <div>
                  <div className="text-xs font-mono-tech tracking-wider text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Included In Box</span>
                  </div>
                  <ul className="text-xs font-light text-zinc-300 space-y-1.5 pl-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      SONIQ Genesis 01 Headphone
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      Anodized Hard-Shell Aviation Carrying Case
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      Braided 24-bit USB-C Audio / PD Fast Cable
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      3.5mm Gold-Plated Audio Adapter
                    </li>
                  </ul>
                </div>

                {/* Pricing Line Items */}
                <div className="pt-4 border-t border-white/10 space-y-2 font-mono-tech text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">$299.00</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Express Worldwide Shipping</span>
                    <span className="text-cyan-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Tax</span>
                    <span className="text-white">$0.00</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                    <span>Total</span>
                    <span className="text-cyan-400">$299.00 USD</span>
                  </div>
                </div>

                {/* Guarantees */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center gap-3 text-[11px] font-mono-tech text-zinc-400">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>30-Day Money-Back Guarantee &bull; 2-Year Full Hardware Coverage</span>
                </div>
              </div>
            )}

            {/* Complete Purchase Button */}
            {!orderPlaced && (
              <div className="pt-4 border-t border-white/10">
                <button
                  id="submit-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-cyan-400 hover:bg-white text-black font-mono-tech font-bold text-xs tracking-[0.2em] transition-all duration-300 shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">AUTHENTICATING PAYMENT...</span>
                  ) : (
                    <>
                      <span>COMPLETE ORDER — $299</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { Mail, Globe } from 'lucide-react';

interface FooterProps {
  onViewChange: (view: 'homepage' | 'shop' | 'checkout' | 'account' | 'admin') => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 px-6 md:px-20 py-16 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-400">
      <div className="flex flex-col items-center md:items-start gap-3">
        <button
          onClick={() => onViewChange('homepage')}
          className="font-serif text-xl tracking-[0.25em] text-white hover:text-gold transition-colors font-semibold"
        >
          HOROLOGUE
        </button>
        <p className="font-sans text-[10px] tracking-widest text-zinc-500 uppercase">
          © 2026 HOROLOGUE. ALL RIGHTS RESERVED.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs tracking-widest uppercase">
        <button
          onClick={() => onViewChange('shop')}
          className="hover:text-gold transition-colors duration-300"
        >
          Shop Entire Catalog
        </button>
        <a href="#privacy" className="hover:text-gold transition-colors duration-300" onClick={(e) => e.preventDefault()}>
          Privacy Policy
        </a>
        <a href="#terms" className="hover:text-gold transition-colors duration-300" onClick={(e) => e.preventDefault()}>
          Terms of Service
        </a>
        <a href="#shipping" className="hover:text-gold transition-colors duration-300" onClick={(e) => e.preventDefault()}>
          Shipping & Returns
        </a>
        <a href="#contact" className="hover:text-gold transition-colors duration-300" onClick={(e) => e.preventDefault()}>
          Contact
        </a>
      </div>

      <div className="flex gap-6">
        <a
          href="https://google.com"
          target="_blank"
          referrerPolicy="no-referrer"
          className="text-zinc-500 hover:text-gold transition-colors duration-300 p-1"
          title="Global Presence"
        >
          <Globe size={18} />
        </a>
        <a
          href="mailto:concierge@horologue.com"
          className="text-zinc-500 hover:text-gold transition-colors duration-300 p-1"
          title="Concierge Email"
        >
          <Mail size={18} />
        </a>
      </div>
    </footer>
  );
}

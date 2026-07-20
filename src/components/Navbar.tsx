import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, ShieldAlert, LogOut, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: 'homepage' | 'shop' | 'checkout' | 'account' | 'admin') => void;
  cartCount: number;
  currentUser: UserType | null;
  onLogout: () => void;
  onSearchOpen: () => void;
  onCartToggle: () => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  cartCount,
  currentUser,
  onLogout,
  onSearchOpen,
  onCartToggle,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: 'homepage' | 'shop' | 'checkout' | 'account' | 'admin') => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-nav"
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-20 border-b transition-all duration-500 ${
        isScrolled
          ? 'py-4 bg-zinc-950/95 shadow-lg border-zinc-900/50 backdrop-blur-md'
          : 'py-6 bg-transparent border-transparent'
      }`}
    >
      {/* Brand logo */}
      <div className="flex items-center gap-6 md:gap-12">
        <button
          onClick={() => handleNavClick('homepage')}
          className="font-serif text-lg sm:text-2xl md:text-3xl tracking-[0.15em] sm:tracking-[0.25em] text-white hover:text-gold transition-colors text-left"
        >
          HOROLOGUE
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10">
          <button
            onClick={() => handleNavClick('shop')}
            className={`font-sans text-xs tracking-widest uppercase transition-colors pb-1 border-b-2 ${
              currentView === 'shop'
                ? 'text-gold border-gold'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => {
              handleNavClick('homepage');
              setTimeout(() => {
                document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="font-sans text-xs tracking-widest uppercase text-zinc-400 hover:text-white border-b-2 border-transparent pb-1 transition-colors"
          >
            Collections
          </button>
          <button
            onClick={() => {
              handleNavClick('homepage');
              setTimeout(() => {
                document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="font-sans text-xs tracking-widest uppercase text-zinc-400 hover:text-white border-b-2 border-transparent pb-1 transition-colors"
          >
            Our Story
          </button>
        </nav>
      </div>

      {/* Right side utility icons */}
      <div className="flex items-center gap-6 text-white">
        <button
          onClick={onSearchOpen}
          className="hover:text-gold transition-colors duration-300 relative p-1"
          title="Search watches"
        >
          <Search size={20} />
        </button>

        <button
          onClick={onCartToggle}
          className="hover:text-gold transition-colors duration-300 relative p-1"
          title="Open cart"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-sans">
              {cartCount}
            </span>
          )}
        </button>

        {currentUser?.isAdmin && (
          <button
            onClick={() => handleNavClick('admin')}
            className={`hover:text-gold transition-colors duration-300 flex items-center gap-1 p-1 border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-widest ${
              currentView === 'admin' ? 'bg-gold/10 text-gold border-gold' : 'text-zinc-400'
            }`}
            title="Admin Panel"
          >
            <ShieldAlert size={14} className="text-gold" />
            <span className="hidden lg:inline">Admin</span>
          </button>
        )}

        <button
          onClick={() => handleNavClick('account')}
          className={`hover:text-gold transition-colors duration-300 flex items-center gap-1.5 p-1 ${
            currentView === 'account' ? 'text-gold' : 'text-zinc-300'
          }`}
          title="User Account"
        >
          <User size={20} />
          {currentUser && (
            <span className="hidden lg:inline text-xs tracking-wider max-w-[80px] truncate">
              {currentUser.fullName.split(' ')[0]}
            </span>
          )}
        </button>

        {currentUser && (
          <button
            onClick={onLogout}
            className="text-zinc-500 hover:text-red-400 transition-colors duration-300 p-1"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden hover:text-gold transition-colors duration-300 p-1"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-900 flex flex-col p-6 space-y-6 md:hidden animate-fadeIn">
          <button
            onClick={() => handleNavClick('shop')}
            className="font-sans text-sm tracking-widest uppercase text-left text-zinc-300 hover:text-white"
          >
            Shop Watches
          </button>
          <button
            onClick={() => {
              handleNavClick('homepage');
              setTimeout(() => {
                document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="font-sans text-sm tracking-widest uppercase text-left text-zinc-300 hover:text-white"
          >
            Collections
          </button>
          <button
            onClick={() => {
              handleNavClick('homepage');
              setTimeout(() => {
                document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="font-sans text-sm tracking-widest uppercase text-left text-zinc-300 hover:text-white"
          >
            Our Story
          </button>
          {currentUser?.isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="font-sans text-sm tracking-widest uppercase text-left text-gold flex items-center gap-2"
            >
              <ShieldAlert size={16} />
              Administrative Dashboard
            </button>
          )}
          <button
            onClick={() => handleNavClick('account')}
            className="font-sans text-sm tracking-widest uppercase text-left text-zinc-300 hover:text-white"
          >
            {currentUser ? `Profile: ${currentUser.fullName}` : 'Login / Register'}
          </button>
        </div>
      )}
    </header>
  );
}

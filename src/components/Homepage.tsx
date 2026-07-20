import React from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';

interface HomepageProps {
  onCategorySelect: (category: 'Dress' | 'Dive' | 'Chronograph' | 'All') => void;
  onNavigateToFeatured: (productId: string) => void;
  onViewChange: (view: 'homepage' | 'shop' | 'checkout' | 'account' | 'admin') => void;
}

export default function Homepage({
  onCategorySelect,
  onNavigateToFeatured,
  onViewChange,
}: HomepageProps) {

  const handleCategoryClick = (category: 'Dress' | 'Dive' | 'Chronograph') => {
    onCategorySelect(category);
  };

  return (
    <div id="homepage-container" className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col md:grid md:grid-cols-2 bg-white pt-20">
        {/* Left Column: Sand Tone Editorial Content */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-20 lg:px-24 bg-zinc-900 relative z-10 space-y-8 border-r border-zinc-800">
          <div className="space-y-4">
            <p className="font-sans text-xs tracking-[0.4em] text-gold uppercase font-semibold animate-fadeIn">
              THE CHRONO NOIR
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-zinc-200 tracking-tight leading-[1.1] animate-fadeIn py-2 font-medium">
              Precision<br/>redefined.
            </h1>
            <p className="font-sans text-zinc-500 text-xs md:text-sm max-w-md tracking-widest uppercase leading-relaxed">
              A masterwork of 18K Rose Gold and carbon engineering. Hand-finished in our Swiss atelier.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigateToFeatured('1')}
              className="px-8 py-4 bg-zinc-200 text-white-keep hover:bg-gold transition-all duration-500 tracking-widest text-[11px] uppercase font-semibold text-center"
            >
              Discover Featured Watch
            </button>
            <button
              onClick={() => {
                onCategorySelect('All');
                onViewChange('shop');
              }}
              className="px-8 py-4 border border-zinc-200 text-zinc-200 hover:border-gold hover:text-gold transition-all duration-500 tracking-widest text-[11px] uppercase text-center font-semibold"
            >
              Browse Catalog
            </button>
          </div>

          {/* Heritage Teaser Label */}
          <div className="pt-12 border-t border-zinc-800/60 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Caliber</p>
              <p className="text-sm font-serif font-medium text-zinc-200 mt-1">H-24 Manufacture</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Power Reserve</p>
              <p className="text-sm font-serif font-medium text-zinc-200 mt-1">72 Hours</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Watch Large Photography */}
        <div className="relative flex items-center justify-center bg-white p-8 md:p-16 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-radial-gradient from-zinc-900/10 to-transparent" />
          
          <div className="relative z-10 w-full h-full max-w-md aspect-square md:aspect-auto md:h-[70vh] overflow-hidden bg-zinc-900 border border-zinc-800/40">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPzHVpXEviMqRfAc3Q_1hQgNHMgaF9iVn8xE3igci8O3wSltI3LcFGNGhvf_JmIvw6jFvEqcHAJ7CUQQ6p4JnqdsVpp4TOx-fQei2wcYTY3x4KHC4X_XfMpHxS1VHtjvjno6OH3BqoYNd15OpE6vHX14ZoH8bPR8yrLts8RcQptPtcijv_pgVdjnQnQJ_-EiUjDXRJnxoEqLZVbfR4HzeLFLXiP_QiU0Mc4en_4AljKVOC2Jq2f6p_"
              alt="The Chrono Noir"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-10000 scale-100 hover:scale-105"
            />
          </div>

          {/* Down Indicator */}
          <div className="absolute bottom-6 right-6 text-zinc-500 hidden md:flex items-center gap-2 animate-bounce">
            <span className="text-[9px] tracking-[0.25em] uppercase">Scroll</span>
            <ArrowDown size={14} className="text-gold" />
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section id="collections" className="py-24 md:py-32 bg-zinc-950 px-6 md:px-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs text-gold tracking-[0.3em] uppercase">COLLECTIONS</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-medium">Curated Families</h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dress Category */}
            <div
              onClick={() => handleCategoryClick('Dress')}
              className="group cursor-pointer relative overflow-hidden"
            >
              <div className="overflow-hidden aspect-[4/5] bg-zinc-900 border border-zinc-900 group-hover:border-gold/30 transition-all duration-500">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd4IDD7r8CAlB_ceKvFhX61w7zYoVbzf-PPudAki0bJh3FNqugviutji190PbAACq8OyXz8w_Lg-YF6KFzLTCw22mCTrAFndaDN5hpbD_WfIwg7ERHDk35-XbSqW9Dbxour9kxDNfJ89CQaS9t6zvNJi69PIMdD3QynhOSjN80qQnSj5qSu9fIQjJ9vkb6UUg8BYhpdyJ5iHmGRWsc9HyUJZ1-PpounhdafSzDJFKuYfaYCJ8N-8Wz"
                  alt="Dress Watches"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale hover:grayscale-0"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-serif text-xl text-white tracking-widest group-hover:text-gold transition-colors duration-300">
                  DRESS
                </h3>
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase mt-1">Slim & Classic</p>
                <div className="w-6 h-[1px] bg-gold mx-auto mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>

            {/* Dive Category */}
            <div
              onClick={() => handleCategoryClick('Dive')}
              className="group cursor-pointer relative overflow-hidden"
            >
              <div className="overflow-hidden aspect-[4/5] bg-zinc-900 border border-zinc-900 group-hover:border-gold/30 transition-all duration-500">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD54vsdACqhcqqYMxeMUFZA6I9nBGwbmDttb8pwjj4Q54xojzB4UpRdJizIjDV1dLT8UePiATG4EDosWfCHc14HK06OjBUNAd3IbxvVvlyLrRrWeBpoTG8DLxq-O8_byZpR1waPCM0jjOpTcaZk11Uyz0LFxLAFwW0uma8_e9Hz_f-Wy0WtAy3XGWQtjPDPf8D3AvGM_fHKg2Kn2tYbWP4W64uQEolx6AH_KpwyyxPrDSqHH-JuAtqc"
                  alt="Dive Watches"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale hover:grayscale-0"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-serif text-xl text-white tracking-widest group-hover:text-gold transition-colors duration-300">
                  DIVE
                </h3>
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase mt-1">Robust & Professional</p>
                <div className="w-6 h-[1px] bg-gold mx-auto mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>

            {/* Chronograph Category */}
            <div
              onClick={() => handleCategoryClick('Chronograph')}
              className="group cursor-pointer relative overflow-hidden"
            >
              <div className="overflow-hidden aspect-[4/5] bg-zinc-900 border border-zinc-900 group-hover:border-gold/30 transition-all duration-500">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsygYzjuH4PglCCBHHAcUqmQjkABSrYpcCQJG0IVom-ig1BXlRKWucw2QPZNOCqIW-JtWXQ4cF7UHfkB-QbO75a9gJtPGYl-z5tFahNRPZbHgjefIGncaSEvVFLNMpH4dxMmLIfvwH0yMeH-VYF0ur4rNDzBXrOpU_vJ_O6QrStE_BUAtQpRtM62OYhbwtc30JRsYXOrA96-QwIoApjXrpTrwtdmq7QY4IQhiJSYoEZfty2SVkmjSq"
                  alt="Chronograph Watches"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale hover:grayscale-0"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-serif text-xl text-white tracking-widest group-hover:text-gold transition-colors duration-300">
                  CHRONOGRAPH
                </h3>
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase mt-1">Precise & Active</p>
                <div className="w-6 h-[1px] bg-gold mx-auto mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="brand-story" className="py-24 md:py-32 bg-zinc-900 text-white border-t border-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-16 md:gap-24">
          <div className="space-y-8">
            <p className="font-sans text-xs text-gold tracking-[0.3em] uppercase">OUR LEGACY</p>
            <h2 className="font-serif text-4xl md:text-6xl tracking-wide leading-tight font-medium">
              TIMELINK HERITAGE.
            </h2>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base max-w-md">
              A legacy of horological excellence since 1924. Every component is meticulously hand-finished in our Swiss atelier, ensuring that every second is captured with uncompromising artistry.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  onCategorySelect('All');
                  onViewChange('shop');
                }}
                className="font-sans text-xs text-gold tracking-widest border-b border-gold pb-1.5 hover:text-white hover:border-white transition-colors uppercase font-medium flex items-center gap-1"
              >
                Discover Our Craft <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-square overflow-hidden bg-zinc-950">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWZqoCf-VOFVYCniNQJLRE3_APykE0GJg_fha7XfpaybF9Wz1nt8JQZniwYFbuyCg2iwL_Yi6tgd9zB_EbcMc_ndCPbW5IlgfTjlO9d1HX4sAeFhpNXhmryXvNT8pauC3QO-QeHIjf_deEkatffms4EHMDh2rBpu2YaMj7SI3CibieeAU5KofMGkjMKKvELt1E0uavtxjeml3kZnQjo4jm5R3VbU6wS9oN6X9wCE7jcRSzPEe61AUK"
                alt="Swiss Movement Detail"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-gold/20 hidden md:block group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Technical Detail Specs Teaser */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-900 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl text-white font-medium">The Noir Movement</h2>
            <p className="text-xs text-zinc-400 uppercase tracking-widest">
              The heart of our latest collection, engineered for a lifetime of precision.
            </p>
          </div>

          <div className="divide-y divide-zinc-800 border-t border-b border-zinc-800">
            <div className="flex justify-between py-5 items-baseline">
              <span className="font-sans text-xs tracking-wider text-zinc-400 uppercase">CALIBRE</span>
              <span className="text-sm text-zinc-200 font-mono font-medium">H-24 Manufacture</span>
            </div>
            <div className="flex justify-between py-5 items-baseline">
              <span className="font-sans text-xs tracking-wider text-zinc-400 uppercase">POWER RESERVE</span>
              <span className="text-sm text-zinc-200 font-mono font-medium">72 Hours</span>
            </div>
            <div className="flex justify-between py-5 items-baseline">
              <span className="font-sans text-xs tracking-wider text-zinc-400 uppercase">COMPONENTS</span>
              <span className="text-sm text-zinc-200 font-mono font-medium">284 Individually Finished</span>
            </div>
            <div className="flex justify-between py-5 items-baseline">
              <span className="font-sans text-xs tracking-wider text-zinc-400 uppercase">CASE MATERIAL</span>
              <span className="text-sm text-zinc-200 font-mono font-medium">18K Rose Gold & Carbon Composite</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

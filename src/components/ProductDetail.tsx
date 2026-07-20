import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, ShieldCheck, Truck, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBackToShop: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  cartItemQuantity: number;
}

export default function ProductDetail({
  product,
  onBackToShop,
  onAddToCart,
  cartItemQuantity,
}: ProductDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'desc' | 'specs' | 'shipping' | 'warranty' | null>('desc');

  const handleToggleAccordion = (section: 'desc' | 'specs' | 'shipping' | 'warranty') => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stockCount, prev + change)));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div id="product-detail-wrapper" className="min-h-screen pt-24 pb-20 px-6 md:px-20 bg-zinc-950 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back navigation */}
        <button
          onClick={onBackToShop}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors pt-2 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Boutique</span>
        </button>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery (Takes 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage */}
            <div className="aspect-[4/5] bg-zinc-900 border border-zinc-900 overflow-hidden relative">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.stockCount === 0 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-sm tracking-widest text-red-400 uppercase font-medium">
                  Temporarily Sold Out
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square overflow-hidden bg-zinc-900 border ${
                      activeImageIndex === idx ? 'border-gold' : 'border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} alternate view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info and specs (Takes 5 cols) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            {/* Title & Brand */}
            <div className="space-y-3">
              <p className="text-xs text-gold tracking-[0.25em] uppercase font-semibold">
                {product.brand} • {product.category}
              </p>
              <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl text-zinc-300 font-mono tracking-wider font-light">
                ${product.price.toLocaleString()}
              </p>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-zinc-900 py-4 text-center text-[10px] tracking-widest uppercase text-zinc-500">
              <div className="space-y-1">
                <span className="block text-[8px] text-zinc-600">MOVEMENT</span>
                <span className="block text-zinc-300 font-medium font-sans">{product.movementType}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-[8px] text-zinc-600">DIAL CASE</span>
                <span className="block text-zinc-300 font-medium font-sans truncate">{product.caseMaterial.split('&')[0]}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-[8px] text-zinc-600">WATER RESIST</span>
                <span className="block text-zinc-300 font-medium font-sans">{product.waterResistance}</span>
              </div>
            </div>

            {/* Add to Cart Controls */}
            {product.stockCount > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-widest text-zinc-500">Quantity</span>
                  <div className="flex items-center border border-zinc-800 bg-zinc-900/40">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 text-zinc-400 hover:text-white disabled:text-zinc-700 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-mono text-sm">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockCount}
                      className="p-3 text-zinc-400 hover:text-white disabled:text-zinc-700 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-zinc-500 lowercase tracking-wider">
                    {product.stockCount} available
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleAddToCartClick}
                    className="w-full py-4 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
                  >
                    Add To Cart
                  </button>
                  {cartItemQuantity > 0 && (
                    <p className="text-[10px] text-gold tracking-wider text-center">
                      ({cartItemQuantity} currently in your basket)
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-red-950/20 border border-red-900/60 p-4 text-center">
                <p className="text-red-400 text-xs uppercase tracking-widest font-semibold">Out of Stock</p>
                <p className="text-zinc-500 text-[10px] tracking-wider mt-1">
                  We are working with our atelier to assemble more calibers.
                </p>
              </div>
            )}

            {/* Accordion List */}
            <div className="border-t border-zinc-900 divide-y divide-zinc-900 text-xs">
              {/* Description Accordion */}
              <div className="py-4">
                <button
                  onClick={() => handleToggleAccordion('desc')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-semibold text-zinc-300 hover:text-white"
                >
                  <span>Description</span>
                  {openAccordion === 'desc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="pt-4 text-zinc-400 leading-relaxed tracking-wide font-light normal-case">
                    {product.description}
                  </div>
                )}
              </div>

              {/* Specs Accordion */}
              <div className="py-4">
                <button
                  onClick={() => handleToggleAccordion('specs')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-semibold text-zinc-300 hover:text-white"
                >
                  <span>Atelier Specifications</span>
                  {openAccordion === 'specs' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'specs' && (
                  <div className="pt-4 space-y-2 font-light">
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-500">Brand</span>
                      <span className="text-zinc-300">{product.brand}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-500">Caliber movement</span>
                      <span className="text-zinc-300">{product.movementType} Caliber</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-500">Case profile</span>
                      <span className="text-zinc-300">{product.caseMaterial}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-500">Strap details</span>
                      <span className="text-zinc-300">{product.strapMaterial}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-500">Atmosphere rating</span>
                      <span className="text-zinc-300">{product.waterResistance}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Accordion */}
              <div className="py-4">
                <button
                  onClick={() => handleToggleAccordion('shipping')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-semibold text-zinc-300 hover:text-white"
                >
                  <span>Complementary Shipping</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pt-4 text-zinc-400 space-y-3 font-light normal-case">
                    <p className="flex items-center gap-2 text-gold">
                      <Truck size={14} />
                      <span className="text-xs uppercase tracking-widest font-semibold">Free Express Courier Delivery</span>
                    </p>
                    <p>
                      All HOROLOGUE shipments are insured up to value and shipped via dedicated courier. Typical transit is 2-4 business days worldwide. Signature upon receipt is mandatory.
                    </p>
                  </div>
                )}
              </div>

              {/* Warranty Accordion */}
              <div className="py-4">
                <button
                  onClick={() => handleToggleAccordion('warranty')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-semibold text-zinc-300 hover:text-white"
                >
                  <span>Atelier Warranty</span>
                  {openAccordion === 'warranty' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'warranty' && (
                  <div className="pt-4 text-zinc-400 space-y-3 font-light normal-case">
                    <p className="flex items-center gap-2 text-gold">
                      <ShieldCheck size={14} />
                      <span className="text-xs uppercase tracking-widest font-semibold">{product.warrantyPeriod} Worldwide Coverage</span>
                    </p>
                    <p>
                      Each timepiece is accompanied by a registered Certificate of Authenticity. The global warranty covers defects in the caliber assembly and casing hardware.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

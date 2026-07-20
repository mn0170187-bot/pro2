import React, { useState, useMemo } from 'react';
import { Filter, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';

interface ShopProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  selectedCategory: 'Dress' | 'Dive' | 'Chronograph' | 'All';
  onCategorySelect: (category: 'Dress' | 'Dive' | 'Chronograph' | 'All') => void;
}

export default function Shop({
  products,
  onSelectProduct,
  selectedCategory,
  onCategorySelect,
}: ShopProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [movementFilter, setMovementFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on search, category, price, and movement type
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      if (priceRange !== 'all') {
        const price = product.price;
        if (priceRange === 'under-10k' && price >= 10000) return false;
        if (priceRange === '10k-13k' && (price < 10000 || price > 13000)) return false;
        if (priceRange === 'over-13k' && price <= 13000) return false;
      }

      // Movement filter
      if (movementFilter !== 'all' && product.movementType !== movementFilter) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchTerm, priceRange, movementFilter]);

  const handleResetFilters = () => {
    onCategorySelect('All');
    setSearchTerm('');
    setPriceRange('all');
    setMovementFilter('all');
  };

  return (
    <div id="shop-page-wrapper" className="min-h-screen pt-24 pb-16 px-6 md:px-20 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page title and descriptive banner */}
        <div className="border-b border-zinc-900 pb-8 space-y-3">
          <p className="text-xs text-gold tracking-[0.3em] uppercase">HOROLOGUE BOUTIQUE</p>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-wide">The Timepieces</h1>
          <p className="text-zinc-500 text-xs md:text-sm tracking-wide max-w-xl">
            Explore our meticulously engineered collections. Handcrafted in Switzerland, each watch represents a timeless convergence of mechanical performance and minimalist luxury.
          </p>
        </div>

        {/* Toolbar (Search, Filter toggles) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-zinc-900">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search watches (e.g. Chrono, Gold)..."
                className="w-full bg-zinc-900/60 border border-zinc-800 text-white pl-10 pr-4 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-gold placeholder:text-zinc-600 rounded-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-zinc-800 hover:border-gold px-4 py-2 text-xs uppercase tracking-wider transition-colors bg-zinc-900/40"
            >
              <SlidersHorizontal size={14} className="text-gold" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500 uppercase tracking-widest">
            <span>Showing {filteredProducts.length} watches</span>
            {(selectedCategory !== 'All' || priceRange !== 'all' || movementFilter !== 'all' || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-gold hover:text-white transition-colors ml-2"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Expandable Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-zinc-900/40 border border-zinc-900/80 animate-fadeIn text-xs uppercase tracking-wider">
            {/* Category selection */}
            <div className="space-y-3">
              <p className="text-zinc-400 font-semibold border-b border-zinc-800 pb-2">By Category</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(['All', 'Dress', 'Dive', 'Chronograph'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategorySelect(cat)}
                    className={`px-3 py-1.5 border transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price ranges */}
            <div className="space-y-3">
              <p className="text-zinc-400 font-semibold border-b border-zinc-800 pb-2">By Price</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: 'All Prices', value: 'all' },
                  { label: 'Under $10k', value: 'under-10k' },
                  { label: '$10k - $13k', value: '10k-13k' },
                  { label: 'Over $13k', value: 'over-13k' },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(range.value)}
                    className={`px-3 py-1.5 border transition-all ${
                      priceRange === range.value
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Movement Type */}
            <div className="space-y-3">
              <p className="text-zinc-400 font-semibold border-b border-zinc-800 pb-2">By Movement</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: 'All Movements', value: 'all' },
                  { label: 'Automatic', value: 'Automatic' },
                  { label: 'Manual Wound', value: 'Manual' },
                  { label: 'Quartz', value: 'Quartz' },
                ].map((movement) => (
                  <button
                    key={movement.value}
                    onClick={() => setMovementFilter(movement.value)}
                    className={`px-3 py-1.5 border transition-all ${
                      movementFilter === movement.value
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {movement.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-dashed border-zinc-900">
            <p className="text-zinc-500 uppercase tracking-widest text-sm">No timepieces match your criteria.</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black transition-colors uppercase tracking-widest text-xs"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className="group cursor-pointer flex flex-col space-y-4"
              >
                {/* Image display */}
                <div className="aspect-[4/5] bg-zinc-900 border border-zinc-900 overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale hover:grayscale-0"
                  />
                  {product.stockCount === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs tracking-[0.25em] text-red-400 uppercase">
                      Sold Out
                    </div>
                  )}
                  {product.stockCount > 0 && product.stockCount <= 3 && (
                    <div className="absolute top-3 left-3 bg-red-950 border border-red-800 text-[9px] px-2 py-0.5 tracking-widest text-red-400 uppercase">
                      Limited Run ({product.stockCount} Left)
                    </div>
                  )}
                </div>

                {/* Info block */}
                <div className="text-center space-y-2">
                  <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase">
                    {product.brand} • {product.category}
                  </p>
                  <h3 className="font-serif text-xl text-white tracking-wide group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-sans text-sm text-zinc-400 font-mono tracking-wide">
                    ${product.price.toLocaleString()}
                  </p>
                  <div className="pt-1 flex items-center justify-center gap-3 text-[10px] text-zinc-500 tracking-wider">
                    <span>{product.movementType} Caliber</span>
                    <span>•</span>
                    <span>{product.warrantyPeriod} Warranty</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { X, Search, Clock } from 'lucide-react';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (productId: string) => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    if (!query) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  if (!isOpen) return null;

  const handleProductClick = (productId: string) => {
    onSelectProduct(productId);
    setQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md p-6 flex flex-col font-sans text-white">
      {/* Header bar */}
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto pb-6 border-b border-zinc-900">
        <span className="font-serif text-lg tracking-[0.2em] text-gold">SEARCH HOROLOGUE</span>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors p-2"
        >
          <X size={24} />
        </button>
      </div>

      {/* Input container */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-start pt-16 space-y-12">
        <div className="relative border-b border-zinc-800 pb-3">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-650" size={28} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type watch models, movements or materials..."
            className="w-full bg-transparent text-white pl-12 pr-4 text-xl md:text-3xl font-light focus:outline-none placeholder:text-zinc-700 uppercase tracking-widest"
            autoFocus
          />
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {query === '' ? (
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase">SUGGESTED ENQUIRIES</p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider">
                {['Chrono Noir', 'Atelier', 'Dress', 'Manual', 'Rose Gold', 'Dive'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 border border-zinc-900 hover:border-gold hover:text-white transition-colors text-zinc-400 bg-zinc-900/10"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 uppercase tracking-widest text-sm">
              No matching watches discovered.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.25em] text-gold uppercase">SEARCH SUGGESTIONS ({suggestions.length})</p>
              <div className="divide-y divide-zinc-900">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleProductClick(p.id)}
                    className="py-4 flex gap-4 cursor-pointer hover:bg-zinc-900/20 px-3 transition-colors items-center"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 object-cover bg-zinc-950 border border-zinc-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 uppercase tracking-wide truncate">{p.name}</p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{p.brand} • {p.category}</p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">${p.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

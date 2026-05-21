import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, Product } from '../api/catalog';

export default function SearchPage() {
  const [all, setAll] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(setAll)
      .catch(() => setError('Could not reach catalog-service (localhost:3001)'));
    inputRef.current?.focus();
  }, []);

  const results = query
    ? all.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Search Products</h1>
        <p className="text-sm text-gray-500 mt-1">Filter across {all.length} products in real time</p>
      </div>

      {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}

      <input
        ref={inputRef}
        type="text"
        placeholder="Type a product name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-6"
      />

      {query && results.length === 0 && (
        <p className="text-gray-400 text-sm">No products match "{query}".</p>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 max-w-lg">
          {results.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3 gap-4">
              <div>
                <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-indigo-600 text-sm">${p.price.toFixed(2)}</span>
                <button
                  disabled={p.stock === 0}
                  onClick={() => navigate(`/orders?productId=${p.id}`)}
                  className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md
                             hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!query && (
        <p className="text-gray-400 text-sm">Start typing to search.</p>
      )}
    </div>
  );
}

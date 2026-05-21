import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, Product } from '../api/catalog';
import { searchProducts } from '../api/query';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayed, setDisplayed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((data) => { setProducts(data); setDisplayed(data); })
      .catch(() => setError('Could not reach catalog-service (localhost:3001)'))
      .finally(() => setLoading(false));
    searchRef.current?.focus();
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setDisplayed(products);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchProducts(value.trim());
        setDisplayed(results);
      } catch {
        setDisplayed(products.filter((p) => p.name.toLowerCase().includes(value.toLowerCase())));
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  if (loading) return <div className="p-8 text-gray-400 text-sm">Loading products…</div>;
  if (error) return <div className="p-8 text-red-500 text-sm">{error}</div>;

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">
            {query.trim()
              ? `${displayed.length} result${displayed.length !== 1 ? 's' : ''} for "${query}" · via query-service GraphQL`
              : `${products.length} products · via catalog-service REST`}
          </p>
        </div>
        <div className="relative sm:w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>

      {displayed.length === 0 && query.trim() && !searching && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No products match <span className="font-medium text-gray-600">"{query}"</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayed.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-400 font-mono">#{p.id}</p>
                <h2 className="font-semibold text-gray-900">{p.name}</h2>
              </div>
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.stock > 0
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <p className="text-2xl font-bold text-indigo-600">${p.price.toFixed(2)}</p>

            <button
              disabled={p.stock === 0}
              onClick={() => navigate(`/orders?productId=${p.id}`)}
              className="mt-auto w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium
                         hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors"
            >
              Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

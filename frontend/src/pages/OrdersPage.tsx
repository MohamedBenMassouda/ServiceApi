import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder, getOrders, Order } from '../api/orders';

const statusStyle: Record<string, string> = {
  CREATED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ productId: '', quantity: '1', customerEmail: '' });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pid = searchParams.get('productId');
    if (pid) setForm((f) => ({ ...f, productId: pid }));
  }, [searchParams]);

  const refresh = () =>
    getOrders()
      .then((data) => setOrders([...data].reverse()))
      .finally(() => setLoading(false));

  useEffect(() => { refresh(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOrder({
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        customerEmail: form.customerEmail,
      });
      toast.success('Order placed! Check Notifications for confirmation.');
      setForm((f) => ({ ...f, productId: '', quantity: '1' }));
      refresh();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to place order — check stock or service availability.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── Place order form ── */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Place an Order
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4"
          >
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-600">Product ID</span>
              <input
                type="number"
                required
                min={1}
                value={form.productId}
                onChange={set('productId')}
                placeholder="e.g. 1"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-600">Quantity</span>
              <input
                type="number"
                required
                min={1}
                value={form.quantity}
                onChange={set('quantity')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-600">Customer Email</span>
              <input
                type="email"
                required
                value={form.customerEmail}
                onChange={set('customerEmail')}
                placeholder="you@example.com"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium
                         hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Placing order…' : 'Place Order'}
            </button>
            <p className="text-xs text-gray-400 -mt-1">
              Stock is validated via gRPC → stock-service. A Kafka event triggers
              notification-service on success.
            </p>
          </form>
        </div>

        {/* ── Order history ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Order History
            </h2>
            <button
              onClick={refresh}
              className="text-xs text-indigo-600 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-[32rem] overflow-y-auto pr-1">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 text-sm"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-semibold text-gray-900">Order #{o.id}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        statusStyle[o.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Product #{o.productId} &times; {o.quantity}
                  </p>
                  <p className="text-gray-500">{o.customerEmail}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

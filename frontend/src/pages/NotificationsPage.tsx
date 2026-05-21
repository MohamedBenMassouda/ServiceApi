import { useEffect, useState } from 'react';
import { getNotifications, Notification } from '../api/notifications';

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    setError(null);
    getNotifications()
      .then(setItems)
      .catch(() => setError('Could not reach notification-service (localhost:3004)'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Persisted by notification-service after consuming Kafka order.created events
          </p>
        </div>
        <button
          onClick={refresh}
          className="text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg
                     hover:bg-indigo-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading…</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">No notifications yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Place an order to trigger a Kafka event and see it appear here.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 max-w-2xl">
        {items.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-indigo-400 p-4 text-sm"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-gray-900">
                Confirmation — Order #{n.orderId}
              </span>
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {new Date(n.sentAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600">
              Product #{n.productId} &times; {n.quantity}
            </p>
            <p className="text-gray-500 mt-0.5">{n.customerEmail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { NavLink } from 'react-router-dom';

const nav = [
  { to: '/catalog', label: 'Catalog' },
  { to: '/orders', label: 'Orders' },
  { to: '/notifications', label: 'Notifications' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-base font-bold text-indigo-700 leading-tight">TP Microservices</p>
          <p className="text-xs text-gray-400 mt-0.5">NestJS Demo</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-100 text-xs text-gray-400 space-y-0.5">
          <p>catalog :3001</p>
          <p>orders  :3002</p>
          <p>graphql :3003</p>
          <p>notify  :3004</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

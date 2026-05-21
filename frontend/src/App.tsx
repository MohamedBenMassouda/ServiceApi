import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import OrdersPage from './pages/OrdersPage';
import NotificationsPage from './pages/NotificationsPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/search" element={<Navigate to="/catalog" replace />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </Layout>
  );
}

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminRoute } from './components/AdminRoute';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ProductList } from './pages/ProductList';
import { CategoryList } from './pages/admin/CategoryList';
import { ProductManagement } from './pages/admin/ProductManagement';
import { CartPage } from './pages/CartPage';
import { StoreSettings } from './pages/admin/StoreSettings';
import { UserManagement } from './pages/admin/UserManagement';
import { useStore } from './store/useStore';
import { FloatingCart } from './components/FloatingCart';

function App() {
  const initializeStore = useStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout className="min-h-screen bg-background" />}>
          <Route index element={<ProductList />} />
          <Route path="cart" element={<CartPage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="admin/categories"
            element={
              <AdminRoute>
                <CategoryList />
              </AdminRoute>
            }
          />
          <Route
            path="admin/products"
            element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="admin/settings"
            element={
              <AdminRoute>
                <StoreSettings />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
      <FloatingCart />
    </Router>
  );
}

export default App;
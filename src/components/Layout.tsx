import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, Settings } from 'lucide-react';
import { CartBadge } from './CartBadge';
import { useStore } from '../store/useStore';
import { Footer } from './Footer';

interface LayoutProps {
  className?: string;
}

export function Layout({ className = '' }: LayoutProps) {
  const { settings } = useStore();
  
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                {settings.storeName}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-md"
              >
                <Settings className="h-6 w-6" />
              </Link>
              <Link
                to="/cart"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-md relative"
              >
                <ShoppingCart className="h-6 w-6" />
                <CartBadge />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
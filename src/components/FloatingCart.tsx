import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function FloatingCart() {
  const { cart } = useStore();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <Link
      to="/cart"
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2 sm:hidden z-50"
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="font-medium">{totalItems}</span>
    </Link>
  );
}

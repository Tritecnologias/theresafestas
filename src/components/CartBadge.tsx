import React from 'react';
import { useStore } from '../store/useStore';

export function CartBadge() {
  const cartItemsCount = useStore((state) => state.getCartItemsCount());

  if (cartItemsCount === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {cartItemsCount}
    </div>
  );
}
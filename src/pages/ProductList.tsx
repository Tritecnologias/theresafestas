import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { ProductImage } from '../components/ProductImage';

export function ProductList() {
  const { products, categories, selectedCategory, setSelectedCategory, addToCart } = useStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products;

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      setQuantities({ ...quantities, [productId]: quantity });
    }
  };

  const handleAddToCart = (productId: string) => {
    const quantity = quantities[productId] || 1;
    addToCart(productId, quantity);
    setQuantities({ ...quantities, [productId]: 0 });
  };

  const adjustQuantity = (productId: string, delta: number) => {
    const currentQuantity = quantities[productId] || 0;
    const newQuantity = Math.max(0, currentQuantity + delta);
    setQuantities({ ...quantities, [productId]: newQuantity });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Nossos Produtos</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Filtrar por categoria:</span>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const category = categories.find((c) => c.id === product.categoryId);
            const quantity = quantities[product.id] || 0;
            
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                <div className="relative aspect-square">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 space-y-2 flex-grow">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h2>
                    {category && (
                      <span className="text-sm text-gray-500">
                        {category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <div className="flex flex-col items-center space-y-3 pt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => adjustQuantity(product.id, -1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => adjustQuantity(product.id, 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <Button 
                      className="flex items-center space-x-1"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={quantity === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Adicionar ao Orçamento</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
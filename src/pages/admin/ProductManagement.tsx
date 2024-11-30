import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { generateSlug } from '../../lib/utils';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { storage } from '../../services/storage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ProductImage } from '../../components/ProductImage';

export function ProductManagement() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    categoryId: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const imagePath = await storage.uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: imagePath }));
    } catch (error) {
      setError((error as Error).message);
      console.error('Erro ao fazer upload da imagem:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setError('Por favor, faça upload de uma imagem para o produto.');
      return;
    }

    try {
      setError(null);
      const productData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        categoryId: formData.categoryId,
        slug: generateSlug(formData.name),
      };

      if (editingId) {
        const oldProduct = products.find(p => p.id === editingId);
        if (oldProduct && oldProduct.imageUrl !== formData.imageUrl) {
          await storage.deleteImage(oldProduct.imageUrl);
        }
        await updateProduct(editingId, productData);
        setEditingId(null);
      } else {
        await addProduct(productData);
      }

      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        categoryId: '',
      });
    } catch (error) {
      setError((error as Error).message);
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const product = products.find(p => p.id === id);
      if (product) {
        await storage.deleteImage(product.imageUrl);
        await deleteProduct(id);
      }
    } catch (error) {
      setError((error as Error).message);
      console.error('Erro ao deletar produto:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Produtos</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Produto
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imagem do Produto
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Enviando...' : 'Upload de Imagem'}</span>
            </Button>
            {formData.imageUrl && (
              <div className="w-24 h-24 relative">
                <ProductImage
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading}>
            {editingId ? 'Atualizar Produto' : 'Adicionar Produto'}
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const category = categories.find((c) => c.id === product.categoryId);
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                {category && (
                  <span className="text-sm text-gray-500">{category.name}</span>
                )}
                <p className="mt-1 text-gray-600">{product.description}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingId(product.id);
                      setFormData({
                        name: product.name,
                        description: product.description,
                        imageUrl: product.imageUrl,
                        categoryId: product.categoryId,
                      });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
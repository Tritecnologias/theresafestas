import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Trash2, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductImage } from '../components/ProductImage';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
}

export function CartPage() {
  const { cart, products, categories, removeFromCart } = useStore();
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
  });

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    const category = categories.find(c => c.id === product?.categoryId);
    return {
      ...item,
      product,
      category,
    };
  }).filter(item => item.product);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSendQuote = () => {
    const { name, email, phone } = contactForm;
    
    // Formata a mensagem para o WhatsApp
    let message = `*Novo Pedido de Orçamento*\n\n`;
    message += `*Dados do Cliente*\n`;
    message += `Nome: ${name}\n`;
    message += `Email: ${email}\n`;
    message += `Telefone: ${phone}\n\n`;
    message += `*Itens do Orçamento*\n\n`;
    
    cartItems.forEach(({ product, quantity }) => {
      message += `• ${product.name}\n`;
      message += `  Quantidade: ${quantity}\n\n`;
    });

    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5531989347941?text=${encodedMessage}`;
    
    // Abre o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');
    
    // Limpa o carrinho removendo todos os itens
    cartItems.forEach(({ product }) => {
      removeFromCart(product.id);
    });

    // Redireciona para a página inicial
    navigate('/', { 
      replace: true,
      state: { message: 'Orçamento enviado com sucesso!' }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu Orçamento</h1>
        <p className="text-gray-600 mb-6">Seu orçamento está vazio.</p>
        <Link to="/">
          <Button>Continuar Comprando</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Seu Orçamento</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cartItems.map(({ product, quantity, category }) => (
            <div key={product.id} className="p-6 flex items-center space-x-6">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-600">
                  Categoria: {category?.name || 'Sem categoria'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Quantidade: {quantity}
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => removeFromCart(product.id)}
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remover</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Seus Dados</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contactForm.name}
              onChange={handleContactChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactForm.email}
              onChange={handleContactChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={contactForm.phone}
              onChange={handleContactChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link to="/">
          <Button variant="secondary">Continuar Comprando</Button>
        </Link>
        <Button
          onClick={handleSendQuote}
          disabled={!contactForm.name || !contactForm.email || !contactForm.phone}
          className="flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Solicitar Orçamento</span>
        </Button>
      </div>
    </div>
  );
}
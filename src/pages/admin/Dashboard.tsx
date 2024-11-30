import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ListOrdered, Settings, LogOut, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export function AdminDashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <Button variant="secondary" onClick={handleLogout} className="flex items-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Produtos</h2>
              <p className="text-gray-600">Gerenciar seu inventário de produtos</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <ListOrdered className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Categorias</h2>
              <p className="text-gray-600">Organizar seus produtos</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Usuários</h2>
              <p className="text-gray-600">Gerenciar usuários do sistema</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
              <p className="text-gray-600">Personalizar sua loja</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
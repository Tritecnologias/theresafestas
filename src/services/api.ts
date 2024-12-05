import { supabase } from '../lib/supabase';
import { storage } from './storage';
import type { Category, Product, StoreSettings } from '../types';

export const api = {
  // Categorias
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createCategory(category: Omit<Category, 'id'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        description: category.description,
        slug: category.slug
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        description: category.description,
        slug: category.slug
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Produtos
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.image_url,
      categoryId: product.category_id,
      slug: product.slug,
    }));
  },

  async createProduct(product: Omit<Product, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          image_url: product.imageUrl,
          category_id: product.categoryId,
          slug: product.slug,
        }])
        .select()
        .single();
      
      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        imageUrl: data.image_url,
        categoryId: data.category_id,
        slug: data.slug,
      };
    } catch (error) {
      if (product.imageUrl) {
        await storage.deleteImage(product.imageUrl);
      }
      throw error;
    }
  },

  async updateProduct(id: string, product: Partial<Product>) {
    try {
      const { data: oldProduct } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          image_url: product.imageUrl,
          category_id: product.categoryId,
          slug: product.slug,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      if (oldProduct?.image_url && product.imageUrl && oldProduct.image_url !== product.imageUrl) {
        await storage.deleteImage(oldProduct.image_url);
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        imageUrl: data.image_url,
        categoryId: data.category_id,
        slug: data.slug,
      };
    } catch (error) {
      if (product.imageUrl && oldProduct?.image_url !== product.imageUrl) {
        await storage.deleteImage(product.imageUrl);
      }
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      if (product?.image_url) {
        await storage.deleteImage(product.image_url);
      }
    } catch (error) {
      throw error;
    }
  },

  // Configurações da Loja
  async getStoreSettings(): Promise<StoreSettings> {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (!data) {
      const { data: newSettings, error: createError } = await supabase
        .from('store_settings')
        .insert([{ store_name: 'Loja Virtual' }])
        .select()
        .single();
      
      if (createError) throw createError;
      return { 
        storeName: newSettings.store_name,
        whatsappNumber: newSettings.whatsapp_number || ''
      };
    }
    
    return { 
      storeName: data.store_name,
      whatsappNumber: data.whatsapp_number || ''
    };
  },

  async updateStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
    try {
      // Primeiro tenta buscar o registro existente
      const { data: existingSettings } = await supabase
        .from('store_settings')
        .select('*')
        .maybeSingle();

      if (existingSettings) {
        // Se existe um registro, atualiza
        const { data, error } = await supabase
          .from('store_settings')
          .update({ 
            store_name: settings.storeName,
            whatsapp_number: settings.whatsappNumber
          })
          .eq('id', existingSettings.id)
          .select()
          .single();
        
        if (error) throw error;
        return { 
          storeName: data.store_name,
          whatsappNumber: data.whatsapp_number || ''
        };
      } else {
        // Se não existe, cria um novo
        const { data, error } = await supabase
          .from('store_settings')
          .insert([{ 
            store_name: settings.storeName,
            whatsapp_number: settings.whatsappNumber
          }])
          .select()
          .single();
        
        if (error) throw error;
        return { 
          storeName: data.store_name,
          whatsappNumber: data.whatsapp_number || ''
        };
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw new Error('Não foi possível salvar as configurações da loja.');
    }
  },
};
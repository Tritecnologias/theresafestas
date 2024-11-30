import { supabase } from '../lib/supabase';

export const storage = {
  async uploadImage(file: File): Promise<string> {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem.');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('A imagem deve ter no máximo 5MB.');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`products/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      if (!data?.path) {
        throw new Error('Caminho da imagem não retornado pelo servidor');
      }

      return data.path;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Falha ao fazer upload da imagem. Por favor, tente novamente.');
    }
  },

  async deleteImage(path: string) {
    if (!path) return;
    
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
    }
  },

  getPublicUrl(path: string): string {
    if (!path) return '';

    try {
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao obter URL pública:', error);
      return '';
    }
  }
};
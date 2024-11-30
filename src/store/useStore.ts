import { create } from 'zustand';
import { Category, Product, CartItem, StoreSettings } from '../types';
import { api } from '../services/api';

interface Store {
  categories: Category[];
  products: Product[];
  selectedCategory: string | null;
  cart: CartItem[];
  settings: StoreSettings;
  isLoading: boolean;
  error: string | null;
  
  // Ações de inicialização
  initializeStore: () => Promise<void>;
  
  // Ações de categoria
  setSelectedCategory: (categoryId: string | null) => void;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Ações de produto
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Ações do carrinho
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getCartItemsCount: () => number;
  
  // Ações de configurações
  updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  categories: [],
  products: [],
  selectedCategory: null,
  cart: [],
  settings: {
    storeName: 'Loja Virtual',
  },
  isLoading: false,
  error: null,

  initializeStore: async () => {
    set({ isLoading: true, error: null });
    try {
      const [categories, products, settings] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getStoreSettings(),
      ]);

      set({
        categories,
        products,
        settings: settings || { storeName: 'Loja Virtual' },
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSelectedCategory: (categoryId) =>
    set({ selectedCategory: categoryId }),

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await api.createCategory(category);
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, updatedCategory) => {
    set({ isLoading: true, error: null });
    try {
      const category = await api.updateCategory(id, updatedCategory);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? category : c
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await api.createProduct(product);
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id, updatedProduct) => {
    set({ isLoading: true, error: null });
    try {
      const product = await api.updateProduct(id, updatedProduct);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? product : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  addToCart: (productId, quantity = 1) =>
    set((state) => {
      const existingItem = state.cart.find(item => item.productId === productId);
      if (existingItem) {
        return {
          cart: state.cart.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        cart: [...state.cart, { productId, quantity }],
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter(item => item.productId !== productId),
    })),

  getCartItemsCount: () => {
    const state = get();
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  },

  updateSettings: async (newSettings) => {
    set({ isLoading: true, error: null });
    try {
      const settings = await api.updateStoreSettings({
        ...get().settings,
        ...newSettings,
      });
      set((state) => ({
        settings: { ...state.settings, ...settings },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
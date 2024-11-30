export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          slug?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          category_id: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          category_id: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          category_id?: string;
          slug?: string;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: string;
          store_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_name?: string;
          created_at?: string;
        };
      };
    };
  };
}
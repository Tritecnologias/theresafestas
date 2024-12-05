-- Create tables
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text not null,
  category_id uuid references public.categories(id) on delete cascade,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.store_settings (
  id uuid default gen_random_uuid() primary key,
  store_name text not null default 'Loja Virtual',
  whatsapp_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.store_settings enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.categories
  for select using (true);

create policy "Enable read access for all users" on public.products
  for select using (true);

create policy "Enable read access for all users" on public.store_settings
  for select using (true);

-- Create authenticated user policies
create policy "Enable full access for authenticated users" on public.categories
  for all using (auth.role() = 'authenticated');

create policy "Enable full access for authenticated users" on public.products
  for all using (auth.role() = 'authenticated');

create policy "Enable full access for authenticated users" on public.store_settings
  for all using (auth.role() = 'authenticated');
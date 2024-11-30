-- Remover políticas existentes se houver
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Allow public viewing" on storage.objects;
drop policy if exists "Allow authenticated deletes" on storage.objects;
drop policy if exists "Allow authenticated updates" on storage.objects;

-- Configuração das políticas de storage para o bucket 'product-images'
begin;
  -- Criar bucket se não existir
  insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do update set public = true;

  -- Política para permitir upload de imagens para usuários autenticados
  create policy "Allow authenticated uploads"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.extension(name) = 'jpg'
    or storage.extension(name) = 'jpeg'
    or storage.extension(name) = 'png'
    or storage.extension(name) = 'gif'
    or storage.extension(name) = 'webp')
  );

  -- Política para permitir visualização pública das imagens
  create policy "Allow public viewing"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

  -- Política para permitir deleção de imagens por usuários autenticados
  create policy "Allow authenticated deletes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

  -- Política para permitir atualização de imagens por usuários autenticados
  create policy "Allow authenticated updates"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

  -- Garantir que o bucket está configurado como público
  update storage.buckets
  set public = true
  where id = 'product-images';
commit;
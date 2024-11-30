import { serve } from 'https://deno.fresh.dev/std@v9.6.2/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { target_user_id, new_password } = await req.json();
    
    // Verifica se o usuário é admin
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verifica se o usuário atual é admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    const { data: currentUser } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Apenas administradores podem alterar senhas');
    }

    // Altera a senha do usuário usando a API de Admin
    const adminAuthClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { error } = await adminAuthClient.auth.admin.updateUserById(
      target_user_id,
      { password: new_password }
    );

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Senha alterada com sucesso' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
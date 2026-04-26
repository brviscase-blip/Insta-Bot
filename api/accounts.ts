import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || '',
  { db: { schema: 'insta-bot' } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Listar todas as contas
  if (req.method === 'GET') {
    try {
      console.log('GET /api/accounts - Fetching accounts');

      const { data: accounts, error } = await supabase
        .from('instagram_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Accounts fetched:', accounts?.length || 0);
      return res.status(200).json({ accounts: accounts || [] });

    } catch (error: any) {
      console.error('GET error:', error);
      return res.status(500).json({ 
        error: error.message || 'Failed to fetch accounts',
        details: error.toString()
      });
    }
  }

  // POST: Adicionar nova conta
  if (req.method === 'POST') {
    try {
      console.log('POST /api/accounts - Adding account');
      
      const {
        username,
        account_name,
        access_token,
        facebook_page_id
      } = req.body;

      console.log('Request body:', { username, facebook_page_id, hasToken: !!access_token });

      // Validar campos obrigatórios
      if (!username || !access_token || !facebook_page_id) {
        return res.status(400).json({
          error: 'Username, Access Token e Facebook Page ID são obrigatórios',
          received: { 
            username: !!username, 
            access_token: !!access_token, 
            facebook_page_id: !!facebook_page_id 
          }
        });
      }

      // Buscar instagram_user_id via Graph API
      console.log('Fetching Instagram User ID from Graph API...');
      const instagramUserId = await getInstagramUserId(facebook_page_id, access_token);

      if (!instagramUserId) {
        return res.status(400).json({
          error: 'Não foi possível obter o Instagram User ID. Verifique o token e o Page ID.',
          hint: 'Certifique-se de que a conta Instagram está conectada à página do Facebook'
        });
      }

      console.log('Instagram User ID:', instagramUserId);

      // Buscar informações da conta
      console.log('Fetching account info from Instagram...');
      const accountInfo = await getInstagramAccountInfo(instagramUserId, access_token);
      console.log('Account info:', accountInfo);

      // Buscar user_id do admin
      console.log('Fetching admin user...');
      const { data: adminUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'admin@brviscase.com')
        .single();

      if (userError || !adminUser) {
        console.error('Admin user error:', userError);
        return res.status(400).json({ 
          error: 'Usuário admin não encontrado',
          hint: 'Verifique se existe um usuário com email admin@brviscase.com na tabela users'
        });
      }

      console.log('Admin user ID:', adminUser.id);

      // Inserir conta no banco
      console.log('Inserting account into database...');
      const { data: newAccount, error: insertError } = await supabase
        .from('instagram_accounts')
        .insert({
          user_id: adminUser.id,
          instagram_user_id: instagramUserId,
          username: accountInfo.username || username,
          account_name: account_name || accountInfo.name,
          profile_picture_url: accountInfo.profile_picture_url,
          bio: accountInfo.biography,
          website: accountInfo.website,
          followers_count: accountInfo.followers_count || 0,
          following_count: accountInfo.follows_count || 0,
          media_count: accountInfo.media_count || 0,
          access_token,
          facebook_page_id,
          is_active: true,
          connection_status: 'connected',
          last_sync_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Account added successfully:', newAccount.id);
      return res.status(200).json({ success: true, account: newAccount });

    } catch (error: any) {
      console.error('POST error:', error);
      return res.status(500).json({ 
        error: error.message || 'Erro ao adicionar conta',
        details: error.toString()
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper: Buscar Instagram User ID
async function getInstagramUserId(facebookPageId: string, accessToken: string): Promise<string | null> {
  try {
    const url = `https://graph.facebook.com/v24.0/${facebookPageId}?fields=instagram_business_account&access_token=${accessToken}`;
    console.log('Graph API URL:', url.replace(accessToken, 'TOKEN_HIDDEN'));
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('Graph API response:', data);

    if (data.error) {
      console.error('Graph API error:', data.error);
      return null;
    }

    return data.instagram_business_account?.id || null;

  } catch (error) {
    console.error('Get Instagram User ID error:', error);
    return null;
  }
}

// Helper: Buscar informações da conta
async function getInstagramAccountInfo(instagramUserId: string, accessToken: string) {
  try {
    const url = `https://graph.facebook.com/v24.0/${instagramUserId}?fields=username,name,biography,website,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`;
    console.log('Graph API URL:', url.replace(accessToken, 'TOKEN_HIDDEN'));
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('Account info response:', data);

    if (data.error) {
      console.error('Graph API error:', data.error);
      return {};
    }

    return data;

  } catch (error) {
    console.error('Get account info error:', error);
    return {};
  }
}
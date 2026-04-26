import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'insta-bot' } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET: Listar todas as contas
  if (req.method === 'GET') {
    try {
      const { data: accounts, error } = await supabase
        .from('instagram_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ accounts });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST: Adicionar nova conta
  if (req.method === 'POST') {
    try {
      const {
        username,
        account_name,
        access_token,
        facebook_page_id
      } = req.body;

      // Validar campos obrigatórios
      if (!username || !access_token || !facebook_page_id) {
        return res.status(400).json({
          error: 'Username, Access Token e Facebook Page ID são obrigatórios'
        });
      }

      // Buscar instagram_user_id via Graph API
      const instagramUserId = await getInstagramUserId(facebook_page_id, access_token);

      if (!instagramUserId) {
        return res.status(400).json({
          error: 'Não foi possível obter o Instagram User ID. Verifique o token e o Page ID.'
        });
      }

      // Buscar informações da conta
      const accountInfo = await getInstagramAccountInfo(instagramUserId, access_token);

      // Buscar user_id do admin
      const { data: adminUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'admin@brviscase.com')
        .single();

      if (!adminUser) {
        return res.status(400).json({ error: 'Usuário admin não encontrado' });
      }

      // Inserir conta no banco
      const { data: newAccount, error } = await supabase
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

      if (error) throw error;

      return res.status(200).json({ success: true, account: newAccount });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper: Buscar Instagram User ID
async function getInstagramUserId(facebookPageId: string, accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v24.0/${facebookPageId}?fields=instagram_business_account&access_token=${accessToken}`
    );

    const data = await response.json();
    return data.instagram_business_account?.id || null;
  } catch (error) {
    console.error('Get Instagram User ID error:', error);
    return null;
  }
}

// Helper: Buscar informações da conta
async function getInstagramAccountInfo(instagramUserId: string, accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v24.0/${instagramUserId}?fields=username,name,biography,website,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get account info error:', error);
    return {};
  }
}
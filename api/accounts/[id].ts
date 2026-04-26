import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'insta-bot' } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // PUT: Atualizar conta
  if (req.method === 'PUT') {
    try {
      const updates = req.body;

      const { data, error } = await supabase
        .from('instagram_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ success: true, account: data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE: Remover conta
  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('instagram_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
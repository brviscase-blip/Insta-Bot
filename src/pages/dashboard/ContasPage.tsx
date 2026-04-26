import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Plus, Instagram, Trash2, RefreshCw, CheckCircle, XCircle, Users, Image as ImageIcon, MessageSquare, MoreHorizontal, X } from "lucide-react";
import { supabase } from "../../lib/supabase/client.ts";

interface Account {
  id: string;
  username: string;
  account_name: string;
  profile_picture_url: string;
  followers_count: number;
  following_count: number;
  media_count: number;
  connection_status: 'connected' | 'disconnected' | 'token_expired';
  is_active: boolean;
}

export default function ContasPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const { data, error } = await supabase
        .from('instagram_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAccounts(data || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount(id: string) {
    if (!confirm('Tem certeza que deseja remover esta conta?')) return;

    try {
      const { error } = await supabase
        .from('instagram_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchAccounts();
    } catch (error) {
      alert('Erro ao remover conta');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando contas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Contas Instagram</h1>
          <p className="text-muted-foreground">
            Gerencie as contas conectadas na plataforma.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Conectar Conta
        </Button>
      </header>
      
      {accounts.length === 0 ? (
        <div className="text-center py-12 bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
          <Instagram className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhuma conta cadastrada ainda.</p>
          <Button onClick={() => setShowAddModal(true)} variant="outline" className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeira conta
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map(acc => (
            <AccountCard
              key={acc.id}
              account={acc}
              onDelete={handleDeleteAccount}
              onRefresh={fetchAccounts}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
}

// Componente: Card de Conta
function AccountCard({ account, onDelete, onRefresh }: any) {
  const statusConfig = {
    connected: { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: 'Conectada' },
    disconnected: { icon: XCircle, color: 'bg-red-50 text-red-600 border-red-200', label: 'Desconectada' },
    token_expired: { icon: XCircle, color: 'bg-orange-50 text-orange-600 border-orange-200', label: 'Token Expirado' },
  };

  const status = statusConfig[account.connection_status as keyof typeof statusConfig] || statusConfig.connected;
  const StatusIcon = status.icon;

  return (
    <div className="bg-card rounded-2xl flex flex-col p-6 border border-border shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0 overflow-hidden relative">
            <img 
              src={account.profile_picture_url || `https://ui-avatars.com/api/?name=${account.username}&background=4f46e5&color=fff`} 
              className="w-full h-full object-cover" 
              alt={account.username}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight">{account.account_name || account.username}</h3>
            <p className="text-sm text-muted-foreground">@{account.username}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onRefresh}
            title="Atualizar dados"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(account.id)}
            title="Remover conta"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center text-sm py-4 bg-secondary/50 rounded-xl mb-4">
        <div className="flex flex-col items-center p-1">
          <Users className="h-4 w-4 mb-2 text-muted-foreground" />
          <span className="font-bold text-foreground">{formatNumber(account.followers_count)}</span>
          <span className="text-xs text-muted-foreground">Seguidores</span>
        </div>
        <div className="flex flex-col items-center p-1">
          <ImageIcon className="h-4 w-4 mb-2 text-muted-foreground" />
          <span className="font-bold text-foreground">{account.media_count || 0}</span>
          <span className="text-xs text-muted-foreground">Posts</span>
        </div>
        <div className="flex flex-col items-center p-1">
          <MessageSquare className="h-4 w-4 mb-2 text-muted-foreground" />
          <span className="font-bold text-foreground">{formatNumber(account.following_count)}</span>
          <span className="text-xs text-muted-foreground">Seguindo</span>
        </div>
      </div>
      
      <div className="mt-auto pt-2 flex justify-between items-center text-xs">
        <Badge variant="outline" className={`${status.color} border`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </Badge>
        <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
          <Instagram className="h-3.5 w-3.5" /> Graph API v24.0
        </div>
      </div>
    </div>
  );
}

// Componente: Modal Adicionar Conta
function AddAccountModal({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    username: '',
    account_name: '',
    access_token: '',
    facebook_page_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao adicionar conta');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 border border-border shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Adicionar Conta Instagram</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Username (sem @)
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border border-border bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="rodrigues_r12"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nome da Conta (opcional)
            </label>
            <input
              type="text"
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
              className="w-full border border-border bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Rodrigo R12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Access Token (Long-lived)
            </label>
            <textarea
              value={formData.access_token}
              onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
              className="w-full border border-border bg-background rounded-xl px-4 py-2.5 h-24 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="EAAxxxxxx..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Facebook Page ID
            </label>
            <input
              type="text"
              value={formData.facebook_page_id}
              onChange={(e) => setFormData({ ...formData, facebook_page_id: e.target.value })}
              className="w-full border border-border bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123456789"
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-xl text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl"
              disabled={loading}
            >
              {loading ? 'Adicionando...' : 'Adicionar Conta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
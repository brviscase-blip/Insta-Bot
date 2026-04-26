import { useEffect, useState } from 'react';
import { Calendar, Users, Bot, TrendingUp, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { supabase } from "../../lib/supabase/client.ts";

interface Stats {
  scheduledPosts: number;
  totalFollowers: number;
  activeBots: number;
  engagement: number;
}

interface UpcomingPost {
  id: string;
  scheduled_date: string;
  post_type: string;
  caption: string;
  instagram_accounts: {
    username: string;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    scheduledPosts: 0,
    totalFollowers: 0,
    activeBots: 0,
    engagement: 0
  });
  const [upcomingPosts, setUpcomingPosts] = useState<UpcomingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // 1. Contar posts agendados
      const { count: scheduledCount } = await supabase
        .from('scheduled_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // 2. Buscar contas ativas e somar seguidores
      const { data: accounts } = await supabase
        .from('instagram_accounts')
        .select('followers_count')
        .eq('is_active', true);

      const totalFollowers = accounts?.reduce(
        (sum, acc) => sum + (acc.followers_count || 0),
        0
      ) || 0;

      // 3. Contar bots ativos
      const { count: botsCount } = await supabase
        .from('bot_campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // 4. Calcular engajamento médio (últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: analytics } = await supabase
        .from('analytics')
        .select('engagement_rate')
        .gte('metric_date', sevenDaysAgo.toISOString().split('T')[0])
        .not('engagement_rate', 'is', null);

      const avgEngagement = analytics && analytics.length > 0
        ? analytics.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / analytics.length
        : 0;

      // 5. Buscar próximas 3 publicações
      const { data: posts } = await supabase
        .from('scheduled_posts')
        .select('id, scheduled_date, post_type, caption, instagram_accounts(username)')
        .eq('status', 'pending')
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true })
        .limit(3);

      setStats({
        scheduledPosts: scheduledCount || 0,
        totalFollowers,
        activeBots: botsCount || 0,
        engagement: parseFloat(avgEngagement.toFixed(1))
      });

      setUpcomingPosts(posts || []);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando dashboard...</div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Posts Agendados",
      value: stats.scheduledPosts.toString(),
      change: stats.scheduledPosts > 0 ? `${stats.scheduledPosts} pendentes` : "Nenhum agendado",
      icon: Calendar,
      color: stats.scheduledPosts > 0 ? "text-emerald-600" : "text-muted-foreground"
    },
    {
      title: "Seguidores Total",
      value: formatNumber(stats.totalFollowers),
      change: stats.totalFollowers > 0 ? "Todas as contas" : "Adicione contas",
      icon: Users,
      color: "text-muted-foreground"
    },
    {
      title: "Bots Ativos",
      value: stats.activeBots.toString().padStart(2, '0'),
      change: stats.activeBots > 0 ? "Em execução" : "Nenhum ativo",
      icon: Bot,
      color: stats.activeBots > 0 ? "text-orange-500" : "text-muted-foreground"
    },
    {
      title: "Engajamento",
      value: stats.engagement > 0 ? `${stats.engagement}%` : "N/A",
      change: undefined,
      icon: TrendingUp,
      progress: stats.engagement
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho das suas contas Instagram hoje.
          </p>
        </div>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            {stat.change && (
              <div className={`flex items-center text-xs font-medium pt-1 ${stat.color || ""}`}>
                {stat.color === 'text-emerald-600' && (
                  <TrendingUp className="w-3 h-3 mr-1" />
                )}
                {stat.change}
              </div>
            )}
            {stat.progress !== undefined && stat.progress > 0 && (
              <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${stat.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Charts and Upcoming Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg text-foreground">Crescimento de Seguidores</h2>
              <p className="text-xs text-muted-foreground">Média de novos seguidores</p>
            </div>
            <select className="bg-secondary border-none text-xs font-semibold text-foreground rounded-lg px-2 py-1 focus:ring-0 cursor-pointer">
              <option>Últimos 7 Dias</option>
            </select>
          </div>
          <div className="flex-1 w-full flex flex-col items-center justify-center text-muted-foreground/60 border-2 border-dashed border-border/50 rounded-xl">
             <BarChart2 className="h-8 w-8 mb-2 opacity-50" />
             <p className="text-sm">Gráfico de Crescimento</p>
             <p className="text-xs mt-1">Em breve</p>
          </div>
        </div>
        
        {/* Upcoming Posts */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-foreground">Próximas Publicações</h2>
          
          {upcomingPosts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 border-2 border-dashed border-border/50 rounded-xl">
              <Calendar className="h-8 w-8 mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground mb-1">Nenhum post agendado</p>
              <p className="text-xs text-muted-foreground/60">Agende sua primeira publicação</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {upcomingPosts.map((post, i) => {
                const postDate = new Date(post.scheduled_date);
                const typeColors: Record<string, { color: string; bg: string }> = {
                  'feed': { color: 'text-primary', bg: 'bg-primary/10' },
                  'reel': { color: 'text-purple-600', bg: 'bg-purple-600/10' },
                  'story': { color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
                  'carousel': { color: 'text-orange-500', bg: 'bg-orange-500/10' }
                };
                const colors = typeColors[post.post_type] || typeColors.feed;

                return (
                  <div key={post.id} className="flex gap-4">
                    <div className={`w-12 h-12 ${colors.bg} ${colors.color} rounded-xl flex flex-col items-center justify-center flex-shrink-0`}>
                      <span className="text-[10px] font-bold uppercase">
                        {postDate.toLocaleString('pt-BR', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {postDate.getDate()}
                      </span>
                    </div>
                    <div className="overflow-hidden flex-1 flex flex-col justify-center">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {post.caption ? post.caption.substring(0, 30) + (post.caption.length > 30 ? '...' : '') : 'Sem legenda'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {postDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {translatePostType(post.post_type)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <button className="w-full mt-6 py-2 border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors rounded-xl text-xs text-muted-foreground font-medium">
            + Agendar Nova Publicação
          </button>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num === 0) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function translatePostType(type: string): string {
  const types: Record<string, string> = {
    'feed': 'Feed',
    'reel': 'Reel',
    'story': 'Story',
    'carousel': 'Carrossel'
  };
  return types[type] || type;
}
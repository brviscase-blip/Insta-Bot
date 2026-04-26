import { BarChart, Activity, Users, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase/client.ts";

export default function AnalyticsPage() {
  const [stats, setStats] = useState([
    { title: "Alcance Total", value: "0", change: "0%", icon: Activity, color: "text-indigo-600", trend: "up" },
    { title: "Visitas ao Perfil", value: "0", change: "0%", icon: Eye, color: "text-blue-500", trend: "up" },
    { title: "Novos Seguidores", value: "0", change: "0%", icon: Users, color: "text-emerald-500", trend: "up" },
    { title: "Taxa de Engajamento", value: "0%", change: "0%", icon: BarChart, color: "text-orange-500", trend: "up" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      // TODO: Fetch analytics implementation
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Métricas detalhadas e relatórios de desempenho.
          </p>
        </div>
        <select className="bg-card border border-border text-sm font-semibold text-foreground rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary cursor-pointer shadow-sm">
          <option>Últimos 30 Dias</option>
          <option>Últimos 7 Dias</option>
          <option>Este Mês</option>
        </select>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-6 text-foreground">Engajamento por Tipo de Post</h2>
          <div className="flex-1 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center text-muted-foreground/60">
            <p>Conecte uma conta para ver os dados.</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-6 text-foreground">Distribuição de Seguidores</h2>
          <div className="flex-1 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center text-muted-foreground/60">
            <p>Conecte uma conta para ver os dados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

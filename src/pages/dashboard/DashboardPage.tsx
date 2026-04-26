import { Calendar, Users, Bot, TrendingUp, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx";

export default function DashboardPage() {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Posts Agendados", value: "12", change: "+2 desde ontem", icon: Calendar, color: "text-emerald-600" },
          { title: "Seguidores Total", value: "24.5K", change: "Meta: 25K", icon: Users, color: "text-muted-foreground" },
          { title: "Bots Ativos", value: "03", change: "Prioridade: Alta", icon: Bot, color: "text-orange-500" },
          { title: "Engajamento", value: "94%", change: undefined, icon: TrendingUp, progress: 94 },
        ].map((stat, i) => (
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
            {stat.progress !== undefined && (
              <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${stat.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
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
             Gráfico de Crescimento
          </div>
        </div>
        
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-foreground">Próximas Publicações</h2>
          <div className="space-y-4 flex-1">
            {[
              { day: "12", month: "Jun", title: "Dicas de Marketing", time: "10:30 AM", type: "Reel", color: "text-primary", bg: "bg-primary/10" },
              { day: "14", month: "Jun", title: "Lançamento Nova Coleção", time: "02:00 PM", type: "Carrossel", color: "text-orange-500", bg: "bg-orange-500/10", faded: true },
              { day: "15", month: "Jun", title: "Bastidores da Agência", time: "09:00 AM", type: "Story", color: "text-emerald-600", bg: "bg-emerald-600/10" }
            ].map((event, i) => (
              <div key={i} className={`flex gap-4 ${event.faded ? 'opacity-70' : ''}`}>
                <div className={`w-12 h-12 ${event.bg} ${event.color} rounded-xl flex flex-col items-center justify-center flex-shrink-0`}>
                  <span className="text-[10px] font-bold uppercase">{event.month}</span>
                  <span className="text-lg font-bold leading-none">{event.day}</span>
                </div>
                <div className="overflow-hidden flex-1 flex flex-col justify-center">
                  <p className="text-sm font-semibold truncate text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time} • {event.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors rounded-xl text-xs text-muted-foreground font-medium">
            + Agendar Nova Publicação
          </button>
        </div>
      </div>
    </div>
  );
}

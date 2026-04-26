import { Plus, MessageSquareText, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button-ui";

export default function BotsPage() {
  const bots = [
    { title: "E-book Gratuito", keyword: "QUERO", replies: 124, status: "Ativo", type: "Comentário" },
    { title: "Boas-vindas", keyword: "N/A", replies: 890, status: "Ativo", type: "DM Novo" },
    { title: "Promoção Dia das Mães", keyword: "MÃE", replies: 45, status: "Inativo", type: "Comentário" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Automação</h1>
          <p className="text-muted-foreground">
            Configure respostas automáticas e fluxos de mensagens.
          </p>
        </div>
        <Button className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Novo Bot
        </Button>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot, i) => (
          <div key={i} className="bg-card rounded-2xl flex flex-col p-6 border border-border shadow-sm relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <MessageSquareText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base tracking-tight">{bot.title}</h3>
                  <p className="text-sm text-muted-foreground">{bot.type}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="-mt-1 -mr-2 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-4 mb-4 mt-auto">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Palavra-chave</p>
                <div className="inline-block px-3 py-1 bg-secondary rounded-lg text-sm font-medium text-foreground">
                  {bot.keyword}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Respostas Enviadas</p>
                <p className="text-2xl font-bold text-foreground">{bot.replies}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border flex justify-between items-center text-xs">
              <span className={`font-semibold ${bot.status === 'Ativo' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                ● {bot.status}
              </span>
              <Button variant="link" className="text-primary p-0 h-auto font-medium">Editar Fluxo</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

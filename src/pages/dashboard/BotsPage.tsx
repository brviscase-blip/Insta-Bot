import { Plus, MessageSquareText, MoreHorizontal } from "lucide-react";
import { Button } from "../../components/ui/button.tsx";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase/client.ts";

export default function BotsPage() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBots() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      // TODO: Fetch bots implementation
      setLoading(false);
    }
    fetchBots();
  }, []);

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
        {loading ? (
          <p>Carregando bots...</p>
        ) : bots.length === 0 ? (
          <p className="text-muted-foreground">Nenhum bot configurado ainda.</p>
        ) : bots.map((bot, i) => (
          <div key={i} className="bg-card rounded-2xl flex flex-col p-6 border border-border shadow-sm relative group overflow-hidden">
            {/* Bot card implementation */}
          </div>
        ))}
      </div>
    </div>
  );
}

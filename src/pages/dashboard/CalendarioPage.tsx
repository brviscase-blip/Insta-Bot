import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar-ui";
import { Button } from "@/components/ui/button-ui";
import { Plus } from "lucide-react";

export default function CalendarioPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendário</h1>
          <p className="text-muted-foreground">
            Gerencie o agendamento de todas as publicações.
          </p>
        </div>
        <Button className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Novo Post
        </Button>
      </header>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm h-fit flex justify-center">
             <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl border-0 w-full max-w-full flex justify-center"
            />
        </div>
        
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm min-h-[400px] flex flex-col">
          <div className="mb-6">
            <h2 className="font-bold text-lg text-foreground">
              Posts para {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Nenhuma data selecionada"}
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
            Nenhuma publicação agendada para este dia.
          </div>
        </div>
      </div>
    </div>
  );
}

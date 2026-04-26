import { Button } from "../../components/ui/button.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Plus, Instagram, Image as ImageIcon, MessageSquare, MoreHorizontal } from "lucide-react";

export default function ContasPage() {
  const accounts = [
    { id: 1, name: "BR|vis.case MKT", username: "@bearodrigues.mkt", followers: "12.4K", status: "Conectada", active: true },
    { id: 2, name: "Rafael Rodrigues", username: "@rodrigues_r12", followers: "5.2K", status: "Conectada", active: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Contas Instagram</h1>
          <p className="text-muted-foreground">
            Gerencie as contas conectadas na plataforma.
          </p>
        </div>
        <Button className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Conectar Conta
        </Button>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-card rounded-2xl flex flex-col p-6 border border-border shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0 overflow-hidden relative">
                  <img src={`https://ui-avatars.com/api/?name=${acc.username.replace('@','')}&background=4f46e5&color=fff`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base tracking-tight">{acc.name}</h3>
                  <p className="text-sm text-muted-foreground">{acc.username}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="-mt-1 -mr-2 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-sm py-4 bg-secondary/50 rounded-xl mb-4">
              <div className="flex flex-col items-center p-1">
                <UsersIcon className="h-4 w-4 mb-2 text-muted-foreground" />
                <span className="font-bold text-foreground">{acc.followers}</span>
              </div>
              <div className="flex flex-col items-center p-1">
                <ImageIcon className="h-4 w-4 mb-2 text-muted-foreground" />
                <span className="font-bold text-foreground">342</span>
              </div>
              <div className="flex flex-col items-center p-1">
                <MessageSquare className="h-4 w-4 mb-2 text-muted-foreground" />
                <span className="font-bold text-foreground">12K</span>
              </div>
            </div>
            
            <div className="mt-auto pt-2 flex justify-between items-center text-xs">
              <Badge variant={acc.active ? "default" : "secondary"} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200">
                {acc.status}
              </Badge>
              <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Instagram className="h-3.5 w-3.5" /> Graph API v24.0
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

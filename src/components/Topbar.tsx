import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar-component";
import { Button } from "@/components/ui/button-ui";

export function Topbar() {
  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-8 shrink-0 relative z-20 w-full mb-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative hidden sm:flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search account, post..."
            className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 shadow-sm text-foreground"
          />
        </div>

        <div className="w-10 h-10 rounded-full border-2 border-background shadow-sm overflow-hidden bg-accent flex items-center justify-center font-bold text-primary shrink-0">
          <Avatar className="w-full h-full">
            <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

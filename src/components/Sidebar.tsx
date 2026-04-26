import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Image as ImageIcon, 
  BarChart3, 
  Bot, 
  Users, 
  Settings,
  Instagram
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Calendar, label: "Calendário", path: "/calendario" },
  { icon: ImageIcon, label: "Biblioteca", path: "/biblioteca" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Bot, label: "Bots", path: "/bots" },
  { icon: Users, label: "Contas", path: "/contas" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col h-full z-20 py-8 px-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <Instagram size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">BR|vis.case</span>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3 hidden">
          Menu Principal
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-secondary"
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto bg-foreground rounded-2xl p-4 text-background">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Pro Account
        </p>
        <p className="text-sm leading-relaxed mb-3">
          Update your plan to get more features.
        </p>
        <button className="w-full py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors text-primary-foreground">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}

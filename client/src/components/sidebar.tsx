import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Folder, 
  Upload, 
  BarChart3, 
  Settings,
  FolderKanban
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "File Manager", href: "/files", icon: Upload },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-slate-200 fixed h-full z-10">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FolderKanban className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">ProjectFlow</h1>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

import { 
  Brain, 
  Vote, 
  Users, 
  FolderKanban, 
  Trophy, 
  Wallet, 
  Settings, 
  Home,
  Sparkles,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  LucideIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "AI Tools", href: "/ai-tools", icon: Brain, badge: "New" },
  { label: "Governance", href: "/governance", icon: Vote },
  { label: "Community", href: "/community", icon: Users },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Rewards", href: "/rewards", icon: Trophy },
];

const secondaryNavItems: NavItem[] = [
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">Creaverse</h1>
                <p className="text-xs text-muted-foreground">DAO</p>
              </div>
            </Link>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary mx-auto">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:flex text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Main
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={location.pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-sidebar-border space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Account
              </p>
            )}
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={location.pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent",
            isCollapsed && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-accent-foreground">JD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">Creator · Level 5</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavLink({ item, isActive, isCollapsed }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-accent/20 text-accent">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function MobileNav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-16">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">Creaverse</span>
        </Link>

        <div className="w-10" />
      </div>
    </header>
  );
}

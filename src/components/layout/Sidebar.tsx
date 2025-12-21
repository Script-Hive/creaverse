import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User,
  Compass,
  Film,
  Palette,
  Code,
  BookOpen,
  Leaf,
  Music,
  Wallet,
  Trophy,
  Menu,
  X,
  Sparkles,
  Bell,
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
}

const mainNavItems: NavItem[] = [
  { label: "Home", href: "/feed", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Create", href: "/create", icon: PlusSquare },
  { label: "Activity", href: "/activity", icon: Heart },
  { label: "Profile", href: "/profile", icon: User },
];

const categoryNavItems: NavItem[] = [
  { label: "Cinema", href: "/category/cinema", icon: Film },
  { label: "Art", href: "/category/art", icon: Palette },
  { label: "Tech", href: "/category/tech", icon: Code },
  { label: "Books", href: "/category/books", icon: BookOpen },
  { label: "Nature", href: "/category/nature", icon: Leaf },
  { label: "Music", href: "/category/music", icon: Music },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

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
          "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">Creaverse</h1>
              <p className="text-xs text-muted-foreground">Create & Earn</p>
            </div>
          </Link>

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
          {/* Main Nav */}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={location.pathname === item.href}
              />
            ))}
          </div>

          {/* Categories */}
          <div className="pt-4 mt-4 border-t border-sidebar-border space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
              Categories
            </p>
            {categoryNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={location.pathname === item.href}
              />
            ))}
          </div>

          {/* Wallet & Rewards */}
          <div className="pt-4 mt-4 border-t border-sidebar-border space-y-1">
            <NavLink
              item={{ label: "Wallet", href: "/wallet", icon: Wallet }}
              isActive={location.pathname === "/wallet"}
            />
            <NavLink
              item={{ label: "Rewards", href: "/rewards", icon: Trophy }}
              isActive={location.pathname === "/rewards"}
            />
          </div>
        </nav>

        {/* Token Balance */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 rounded-xl bg-gradient-card border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Token Balance</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-gradient-primary">2,340</p>
            <p className="text-xs text-success mt-1">+120 this week</p>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
      <span>{item.label}</span>
    </Link>
  );
}

export function MobileNav({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="icon-sm" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Creaverse</span>
          </Link>

          <Button variant="ghost" size="icon-sm">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-background/80 backdrop-blur-xl border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.href === "/create" ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center -mt-4 shadow-lg shadow-primary/30">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
              ) : (
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

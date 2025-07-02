
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  Plug,
  Wrench,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Reservas',
    href: '/reservas',
    icon: Calendar,
  },
  {
    name: 'Hóspedes',
    href: '/hospedes',
    icon: Users,
  },
  {
    name: 'Financeiro',
    href: '/financeiro',
    icon: DollarSign,
  },
  {
    name: 'Integrações',
    href: '/integracoes',
    icon: Plug,
  },
  {
    name: 'Manutenção',
    href: '/manutencao',
    icon: Wrench,
  },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-border px-6">
            <h1 className="text-xl font-bold text-primary">
              Gestão Aluguéis
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start space-x-3 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

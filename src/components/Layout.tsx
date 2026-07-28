import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, BarChart3, Info, Home as HomeIcon, ListChecks } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Surveys', path: '/surveys', icon: ListChecks },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden text-foreground">
      {/* Static Background Image with Dark Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/90"></div>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <ClipboardList className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Midnight Survey</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/surveys' && location.pathname.startsWith('/surveys'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-white/10 py-8 mt-auto bg-black/40 backdrop-blur-2xl shadow-[0_-8px_32px_0_rgba(0,0,0,0.3)]">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Powered by Midnight Network — Anonymous Surveys with Zero-Knowledge Proofs</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

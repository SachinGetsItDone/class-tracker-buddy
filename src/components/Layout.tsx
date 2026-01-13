import { Link, useLocation } from "react-router-dom";
import { Flame, Calculator, History, Info } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "tracker", icon: Calculator, emoji: "📊" },
    { path: "/history", label: "history", icon: History, emoji: "📜" },
    { path: "/about", label: "about", icon: Info, emoji: "💡" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating orbs for aesthetic */}
      <div className="floating-orb w-96 h-96 bg-primary/30 top-[-10%] left-[-10%]" />
      <div className="floating-orb w-64 h-64 bg-accent/30 top-[30%] right-[-5%]" style={{ animationDelay: '-3s' }} />
      <div className="floating-orb w-80 h-80 bg-[hsl(10,90%,60%)]/20 bottom-[-10%] left-[20%]" style={{ animationDelay: '-5s' }} />

      {/* Navigation */}
      <nav className="relative z-20 pt-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 text-background" />
              </div>
              <span className="font-bold text-lg hidden sm:block">
                <span className="neon-text">bunk</span>
                <span className="text-foreground">calc</span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center gap-2 ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                >
                  <span className="hidden sm:inline">{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 p-4 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-muted-foreground/50 text-sm pb-8 flex items-center justify-center gap-2">
        <span>🔥</span> target: 75% minimum • built different ✨
      </footer>
    </div>
  );
};

export default Layout;

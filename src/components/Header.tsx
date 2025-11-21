import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins, User, Wallet, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-casino-dark/95 backdrop-blur supports-[backdrop-filter]:bg-casino-dark/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-3xl font-bold">
            <span className="text-foreground">Jackpotito</span>
            <span className="text-gold-glow animate-glow"> 777</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-casino-gold transition-colors font-medium">
            Juegos
          </Link>
          <Link to="/wallet" className="text-foreground hover:text-casino-gold transition-colors font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Billetera
          </Link>
          {user?.is_admin && (
            <Link to="/admin" className="text-foreground hover:text-casino-gold transition-colors font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 mr-2">
                <span className="text-foreground font-medium">{user.username}</span>
                <div className="bg-casino-gold/20 px-3 py-1 rounded-full flex items-center gap-1">
                  <Coins className="h-4 w-4 text-casino-gold" />
                  <span className="text-casino-gold font-bold">${user.balance.toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
                title="Cerrar Sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="hidden md:block">
                <Button variant="outline" className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-casino-dark">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/auth" className="hidden md:block">
                <Button className="bg-secondary hover:bg-secondary/90">
                  Registrarse
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-casino-dark p-4 space-y-3">
          <Link to="/" className="block text-foreground hover:text-casino-gold transition-colors font-medium">
            Juegos
          </Link>
          <Link to="/wallet" className="block text-foreground hover:text-casino-gold transition-colors font-medium">
            Billetera
          </Link>
          {user ? (
            <>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-foreground">{user.username}</span>
                <span className="text-casino-gold font-bold">${user.balance.toFixed(2)}</span>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="block">
                <Button variant="outline" className="w-full border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-casino-dark">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/auth" className="block">
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

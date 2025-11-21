import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const Slots = () => {
  const { user, refreshUser } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [bet] = useState(10);
  const [reels, setReels] = useState(["🍒", "🍋", "🔔"]);

  const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣", "⭐"];

  const spin = async () => {
    if (!user) return;
    if (user.balance < bet) {
      toast.error("Saldo insuficiente");
      return;
    }

    setSpinning(true);

    // Visual effect only - backend determines result
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    try {
      const response = await api.post('/slots/spin', { bet });
      const { reels: finalReels, winAmount, winType } = response.data;

      setTimeout(async () => {
        clearInterval(spinInterval);
        setReels(finalReels);
        setSpinning(false);

        await refreshUser(); // Sync balance

        if (winAmount > 0) {
          if (winType === 'JACKPOT') {
            toast.success(`¡JACKPOT! Ganaste $${winAmount}!`);
          } else {
            toast.success(`¡Ganaste $${winAmount}!`);
          }
        }
      }, 2000);

    } catch (error: any) {
      clearInterval(spinInterval);
      setSpinning(false);
      toast.error(error.response?.data?.error || "Error al girar");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a juegos
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            <span className="text-foreground">Slots</span>
            <span className="text-casino-gold"> 777</span>
          </h1>

          <Card className="mb-6 bg-gradient-to-r from-primary to-casino-red border-0">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-foreground/80 text-sm">Tu Saldo</p>
                <p className="text-3xl font-bold text-foreground">${user?.balance.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-foreground/80 text-sm">Apuesta</p>
                <p className="text-3xl font-bold text-casino-gold">${bet}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 bg-casino-darker border-casino-gold/30">
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {reels.map((symbol, index) => (
                  <div
                    key={index}
                    className={`aspect-square bg-card rounded-lg flex items-center justify-center text-6xl border-2 border-casino-gold ${spinning ? "animate-pulse" : ""
                      }`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              <Button
                onClick={spin}
                disabled={spinning || !user}
                className="w-full py-6 text-xl font-bold bg-casino-gold text-casino-dark hover:bg-casino-gold/90 disabled:opacity-50"
              >
                {spinning ? "GIRANDO..." : "GIRAR"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-foreground">Tabla de Pagos</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>3 símbolos iguales: <span className="text-casino-gold font-bold">10x apuesta</span></p>
                <p>2 símbolos iguales: <span className="text-casino-gold font-bold">2x apuesta</span></p>
                <p>💎 💎 💎 o 7️⃣ 7️⃣ 7️⃣: <span className="text-casino-gold font-bold">JACKPOT!</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Slots;

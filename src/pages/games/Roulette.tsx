import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Roulette = () => {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36

  const getNumberColor = (num: number): string => {
    if (num === 0) return "green";
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? "red" : "black";
  };

  const spin = () => {
    if (selectedNumber === null) {
      toast.error("Selecciona un número primero");
      return;
    }

    if (balance < bet) {
      toast.error("Saldo insuficiente");
      return;
    }

    setSpinning(true);
    setBalance(balance - bet);

    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      setResult(winningNumber);
      setSpinning(false);

      if (winningNumber === selectedNumber) {
        const winAmount = bet * 35;
        setBalance(prev => prev + winAmount);
        toast.success(`¡GANASTE! El número ${winningNumber} salió. Ganaste $${winAmount}!`);
      } else {
        toast.error(`Perdiste. Salió el ${winningNumber}`);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a juegos
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            <span className="text-foreground">Ruleta</span>
            <span className="text-casino-gold"> Europea</span>
          </h1>

          <Card className="mb-6 bg-gradient-to-r from-primary to-casino-red border-0">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-foreground/80 text-sm">Tu Saldo</p>
                <p className="text-3xl font-bold text-foreground">${balance}</p>
              </div>
              <div>
                <p className="text-foreground/80 text-sm">Apuesta</p>
                <p className="text-3xl font-bold text-casino-gold">${bet}</p>
              </div>
              {selectedNumber !== null && (
                <div>
                  <p className="text-foreground/80 text-sm">Número Seleccionado</p>
                  <p className="text-3xl font-bold text-casino-gold">{selectedNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {result !== null && (
            <Card className="mb-6 bg-casino-gold/10 border-casino-gold">
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-foreground">
                  Resultado: <span className="text-casino-gold">{result}</span>
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6 bg-casino-darker border-casino-gold/30">
            <CardContent className="p-8">
              <div className="mb-6">
                <p className="text-center text-muted-foreground mb-4">Selecciona un número (0-36)</p>
                <div className="grid grid-cols-9 gap-2 mb-4">
                  {numbers.map((num) => (
                    <Button
                      key={num}
                      onClick={() => setSelectedNumber(num)}
                      disabled={spinning}
                      className={`aspect-square ${
                        selectedNumber === num
                          ? "bg-casino-gold text-casino-dark"
                          : getNumberColor(num) === "red"
                          ? "bg-primary hover:bg-primary/90"
                          : getNumberColor(num) === "black"
                          ? "bg-casino-darker hover:bg-casino-dark"
                          : "bg-casino-gold/20 hover:bg-casino-gold/30"
                      } font-bold disabled:opacity-50`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => setBet(10)}
                  className={bet === 10 ? "border-casino-gold" : ""}
                >
                  $10
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBet(25)}
                  className={bet === 25 ? "border-casino-gold" : ""}
                >
                  $25
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBet(50)}
                  className={bet === 50 ? "border-casino-gold" : ""}
                >
                  $50
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBet(100)}
                  className={bet === 100 ? "border-casino-gold" : ""}
                >
                  $100
                </Button>
              </div>

              <Button
                onClick={spin}
                disabled={spinning}
                className="w-full py-6 text-xl font-bold bg-casino-gold text-casino-dark hover:bg-casino-gold/90 disabled:opacity-50"
              >
                {spinning ? "GIRANDO..." : "GIRAR RULETA"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-foreground">Reglas</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Apuesta a un número específico: <span className="text-casino-gold font-bold">Paga 35:1</span></p>
                <p>Números rojos: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36</p>
                <p>Números negros: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35</p>
                <p>Verde: 0</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Roulette;

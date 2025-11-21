import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Poker = () => {
  const [balance, setBalance] = useState(1000);
  const [bet] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const cards = [
    "A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠",
    "A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "10♥", "J♥", "Q♥", "K♥",
    "A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "10♦", "J♦", "Q♦", "K♦",
    "A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "10♣", "J♣", "Q♣", "K♣",
  ];

  const getCardValue = (card: string): number => {
    const value = card.replace(/[♠♥♦♣]/g, "");
    if (value === "A") return 14;
    if (value === "K") return 13;
    if (value === "Q") return 12;
    if (value === "J") return 11;
    return parseInt(value);
  };

  const drawCard = (usedCards: string[]): string => {
    let card;
    do {
      card = cards[Math.floor(Math.random() * cards.length)];
    } while (usedCards.includes(card));
    return card;
  };

  const evaluateHand = (hand: string[]): number => {
    const values = hand.map(getCardValue).sort((a, b) => b - a);
    const sum = values.reduce((a, b) => a + b, 0);
    
    // Check for pairs
    const hasPair = values[0] === values[1] || values[1] === values[2] || values[2] === values[3] || values[3] === values[4];
    
    return hasPair ? sum + 100 : sum;
  };

  const startGame = () => {
    if (balance < bet) {
      toast.error("Saldo insuficiente");
      return;
    }

    setBalance(balance - bet);
    const usedCards: string[] = [];
    
    // Draw 5 cards for player
    const pHand: string[] = [];
    for (let i = 0; i < 5; i++) {
      const card = drawCard([...usedCards, ...pHand]);
      pHand.push(card);
    }
    
    // Draw 5 cards for dealer
    const dHand: string[] = [];
    for (let i = 0; i < 5; i++) {
      const card = drawCard([...usedCards, ...pHand, ...dHand]);
      dHand.push(card);
    }
    
    setPlayerHand(pHand);
    setDealerHand(dHand.map(() => "?"));
    setGameStarted(true);
    setGameOver(false);
    
    // Reveal and check winner after delay
    setTimeout(() => {
      setDealerHand(dHand);
      const playerScore = evaluateHand(pHand);
      const dealerScore = evaluateHand(dHand);
      
      setGameOver(true);
      
      if (playerScore > dealerScore) {
        const winAmount = bet * 2;
        setBalance(prev => prev + winAmount);
        toast.success(`¡Ganaste $${winAmount}!`);
      } else if (playerScore === dealerScore) {
        setBalance(prev => prev + bet);
        toast.info("Empate! Tu apuesta fue devuelta.");
      } else {
        toast.error("El dealer ganó. Perdiste!");
      }
    }, 2000);
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
            <span className="text-foreground">Poker</span>
            <span className="text-casino-gold"> Texas</span>
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
            </CardContent>
          </Card>

          <Card className="mb-6 bg-casino-darker border-casino-gold/30">
            <CardContent className="p-8">
              {!gameStarted ? (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground mb-8">Presiona "Repartir" para comenzar</p>
                  <Button
                    onClick={startGame}
                    className="px-12 py-6 text-xl font-bold bg-casino-gold text-casino-dark hover:bg-casino-gold/90"
                  >
                    Repartir Cartas
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Dealer's Hand */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-muted-foreground mb-4">Dealer</p>
                    <div className="flex justify-center gap-2">
                      {dealerHand.map((card, index) => (
                        <div
                          key={index}
                          className={`w-16 h-24 bg-card rounded-lg border-2 border-casino-gold flex items-center justify-center font-bold ${
                            card.includes("♥") || card.includes("♦")
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {card}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player's Hand */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground mb-4">Tu Mano</p>
                    <div className="flex justify-center gap-2">
                      {playerHand.map((card, index) => (
                        <div
                          key={index}
                          className={`w-16 h-24 bg-card rounded-lg border-2 border-casino-gold flex items-center justify-center font-bold ${
                            card.includes("♥") || card.includes("♦")
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {card}
                        </div>
                      ))}
                    </div>
                  </div>

                  {gameOver && (
                    <Button
                      onClick={startGame}
                      className="w-full py-6 text-xl font-bold bg-casino-gold text-casino-dark hover:bg-casino-gold/90"
                    >
                      Nueva Partida
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-foreground">Reglas Simplificadas</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Se reparten 5 cartas a cada jugador</p>
                <p>• Gana la mano más alta</p>
                <p>• Par o mejor: <span className="text-casino-gold font-bold">2x apuesta</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Poker;

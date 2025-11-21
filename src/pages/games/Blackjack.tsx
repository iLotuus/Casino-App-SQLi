import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Blackjack = () => {
  const [balance, setBalance] = useState(1000);
  const [bet] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  const getCardValue = (card: string): number => {
    if (card === "A") return 11;
    if (["J", "Q", "K"].includes(card)) return 10;
    return parseInt(card);
  };

  const calculateScore = (cards: string[]): number => {
    let score = cards.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = cards.filter(card => card === "A").length;
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const drawCard = (): string => {
    return cards[Math.floor(Math.random() * cards.length)];
  };

  const startGame = () => {
    if (balance < bet) {
      toast.error("Saldo insuficiente");
      return;
    }

    setBalance(balance - bet);
    const newPlayerCards = [drawCard(), drawCard()];
    const newDealerCards = [drawCard(), "?"]; // Dealer's second card is hidden
    
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setPlayerScore(calculateScore(newPlayerCards));
    setDealerScore(getCardValue(newDealerCards[0]));
    setGameStarted(true);
    setGameOver(false);
  };

  const hit = () => {
    const newCard = drawCard();
    const newPlayerCards = [...playerCards, newCard];
    const newScore = calculateScore(newPlayerCards);
    
    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);
    
    if (newScore > 21) {
      endGame(newPlayerCards, dealerCards);
    }
  };

  const stand = () => {
    let newDealerCards = [dealerCards[0], drawCard()];
    let newDealerScore = calculateScore(newDealerCards);
    
    while (newDealerScore < 17) {
      newDealerCards = [...newDealerCards, drawCard()];
      newDealerScore = calculateScore(newDealerCards);
    }
    
    setDealerCards(newDealerCards);
    setDealerScore(newDealerScore);
    endGame(playerCards, newDealerCards);
  };

  const endGame = (pCards: string[], dCards: string[]) => {
    const pScore = calculateScore(pCards);
    const dScore = calculateScore(dCards);
    
    setGameOver(true);
    
    if (pScore > 21) {
      toast.error("Te pasaste de 21. Perdiste!");
    } else if (dScore > 21) {
      const winAmount = bet * 2;
      setBalance(prev => prev + winAmount);
      toast.success(`¡El dealer se pasó! Ganaste $${winAmount}!`);
    } else if (pScore > dScore) {
      const winAmount = bet * 2;
      setBalance(prev => prev + winAmount);
      toast.success(`¡Ganaste $${winAmount}!`);
    } else if (pScore === dScore) {
      setBalance(prev => prev + bet);
      toast.info("Empate! Tu apuesta fue devuelta.");
    } else {
      toast.error("El dealer ganó. Perdiste!");
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
            <span className="text-foreground">Blackjack</span>
            <span className="text-casino-gold"> 21</span>
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
                    <p className="text-lg font-bold text-muted-foreground mb-4">
                      Dealer {gameOver && `(${dealerScore})`}
                    </p>
                    <div className="flex justify-center gap-3">
                      {dealerCards.map((card, index) => (
                        <div
                          key={index}
                          className="w-20 h-28 bg-card rounded-lg border-2 border-casino-gold flex items-center justify-center text-3xl font-bold"
                        >
                          {card}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player's Hand */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground mb-4">
                      Tú ({playerScore})
                    </p>
                    <div className="flex justify-center gap-3">
                      {playerCards.map((card, index) => (
                        <div
                          key={index}
                          className="w-20 h-28 bg-card rounded-lg border-2 border-casino-gold flex items-center justify-center text-3xl font-bold"
                        >
                          {card}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {!gameOver && (
                    <div className="flex gap-4">
                      <Button
                        onClick={hit}
                        className="flex-1 py-6 text-xl font-bold bg-secondary hover:bg-secondary/90"
                      >
                        Pedir Carta
                      </Button>
                      <Button
                        onClick={stand}
                        className="flex-1 py-6 text-xl font-bold bg-primary hover:bg-primary/90"
                      >
                        Plantarse
                      </Button>
                    </div>
                  )}

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
        </div>
      </div>
    </div>
  );
};

export default Blackjack;

import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, DollarSign, Users, Shield } from "lucide-react";
import casinoHero from "@/assets/casino-hero.jpg";
import slotsGame from "@/assets/slots-game.jpg";
import blackjackGame from "@/assets/blackjack-game.jpg";
import rouletteGame from "@/assets/roulette-game.jpg";
import pokerGame from "@/assets/poker-game.jpg";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const games = [
    {
      title: "Slots 777",
      description: "Gira y gana con nuestras máquinas tragamonedas más emocionantes",
      image: slotsGame,
      link: "/game/slots"
    },
    {
      title: "Blackjack",
      description: "Desafía al dealer y llega a 21 en el juego de cartas más popular",
      image: blackjackGame,
      link: "/game/blackjack"
    },
    {
      title: "Ruleta",
      description: "Apuesta a tu número de la suerte en la clásica ruleta del casino",
      image: rouletteGame,
      link: "/game/roulette"
    },
    {
      title: "Poker",
      description: "Demuestra tu habilidad en el juego de póker más emocionante",
      image: pokerGame,
      link: "/game/poker"
    }
  ];

  const features = [
    {
      icon: Trophy,
      title: "Grandes Premios",
      description: "Gana jackpots millonarios todos los días"
    },
    {
      icon: DollarSign,
      title: "Retiros Rápidos",
      description: "Cobra tus ganancias en minutos"
    },
    {
      icon: Users,
      title: "Soporte 24/7",
      description: "Estamos aquí para ayudarte siempre"
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Juega con total confianza y protección"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={casinoHero}
            alt="Casino Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-casino-darker via-casino-dark/90 to-casino-darker" />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              Bienvenido a <span className="text-gold-glow animate-glow">Jackpotito 777</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              El casino online más emocionante. Juega, gana y disfruta de los mejores juegos con premios increíbles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!isLoggedIn && (
                <Link to="/auth">
                  <Button size="lg" className="bg-casino-gold text-casino-dark hover:bg-casino-gold/90 text-lg px-8 py-6 font-bold">
                    Comenzar a Jugar
                  </Button>
                </Link>
              )}
              <Link to="/wallet">
                <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-foreground text-lg px-8 py-6">
                  Ver Billetera
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16 bg-casino-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nuestros Juegos <span className="text-casino-gold">Destacados</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Explora nuestra selección de juegos premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <div key={index} className="animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                <GameCard {...game} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-casino-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir <span className="text-primary">Jackpotito 777</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-card border border-border hover:border-casino-gold transition-all duration-300 hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-casino-gold/10">
                  <feature.icon className="h-8 w-8 text-casino-gold" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Only shown if NOT logged in */}
      {!isLoggedIn && (
        <section className="py-16 bg-gradient-to-r from-primary via-casino-red to-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              ¡Comienza tu aventura hoy!
            </h2>
            <p className="text-xl text-foreground/90 mb-8">
              Regístrate ahora y recibe un bono de bienvenida especial
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-casino-gold text-casino-dark hover:bg-casino-gold/90 text-lg px-12 py-6 font-bold">
                Registrarse Gratis
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-casino-darker py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Jackpotito 777. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">Juega responsablemente. +18</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const GameCard = ({ title, description, image, link }: GameCardProps) => {
  return (
    <Link to={link}>
      <Card className="group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-border bg-card">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-casino-darker via-casino-darker/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-casino-gold/90 rounded-full p-4">
              <Play className="h-8 w-8 text-casino-dark fill-current" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </Card>
    </Link>
  );
};

export default GameCard;

import React from "react";
import { User } from "lucide-react";
import { Character } from "../types";

interface TimelineCharacterProps {
  character: Character;
  onClick: () => void;
  
}

const TimelineCharacter: React.FC<TimelineCharacterProps> = ({
  character,
  onClick,
}) => {

  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 border border-gray-200">
        {character.imageUrl ? (
            
          <img
            src={`https://localhost:7023${character.imageUrl}`}
            alt={character.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement
                ?.querySelector(".fallback-icon")
                ?.classList.remove("hidden");
            }}
          />
        ) : (
          <User className="w-full h-full p-2 text-gray-400" />
        )}
        <div className="fallback-icon hidden">
          <User className="w-full h-full p-2 text-gray-400" />
        </div>
      </div>
      <span className="font-medium text-gray-900">{character.name}</span>
    </div>
  );
};

export default TimelineCharacter;

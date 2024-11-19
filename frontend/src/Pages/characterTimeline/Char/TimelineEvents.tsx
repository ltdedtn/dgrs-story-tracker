import React from "react";
import { Character } from "../types";

interface TimelineEventsProps {
  characters: any[]; // List of characters grouped by story dates
  year: number; // The year for this section
  onCharacterSelect: (character: Character) => void; // Select a character
  isHighlighted: boolean; // Whether the year is highlighted
}

const TimelineEvents: React.FC<TimelineEventsProps> = ({
  characters,
  onCharacterSelect,
  isHighlighted,
}) => {
  if (characters.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center h-full gap-2">
      {characters.map((char, index) => (
        <div
          key={index}
          onClick={() => onCharacterSelect(char)}
          className={`group relative flex items-center gap-2 border rounded-md px-3 py-1.5 shadow-sm cursor-pointer transition-all duration-200 ${
            isHighlighted
              ? "border-green-400 hover:border-green-500 hover:bg-green-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {char.imageUrl && (
            <img
              src={`https://localhost:7023${char.imageUrl}`}
              alt={char.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <span
            className={`text-sm ${
              isHighlighted ? "text-green-700" : "text-gray-600"
            }`}
          >
            {char.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TimelineEvents;

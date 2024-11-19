import React from "react";
import { Character } from "../types";
import { formatDate } from "../utils";
import { X } from "lucide-react";

interface CharacterDetailsProps {
  character: Character;
  onClose: () => void;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({
  character,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end">
      <div className="w-96 bg-white h-full overflow-y-auto p-6 animate-in slide-in-from-right">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mt-8">
          <div className="w-32 h-32 rounded-full mx-auto overflow-hidden">
            <img
              src={`https://localhost:7023${character.imageUrl}`}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-center mt-4">
            {character.name}
          </h2>
          <p className="mt-2 text-gray-600">{character.description}</p>

          <div className="my-6 border-t border-gray-200" />

          <h3 className="text-lg font-semibold mb-4">Stories</h3>
          {character.storyPartCharacters.map((spc) => (
            <div
              key={spc.storyPartId}
              className="mb-4 bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                // Implement navigation to story details
                console.log(`Navigate to Story: ${spc.storyPart.title}`);
              }}
            >
              <h4 className="font-medium">{spc.storyPart.title}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(spc.storyPart.aaDate)}
              </p>
              <p className="mt-2 text-gray-600">{spc.storyPart.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;

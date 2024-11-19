import React, { useMemo } from "react";
import { Character, StoryPart } from "./types";
import TimelineEvents from "./Char/TimelineEvents";

interface TimelineGridProps {
  characters: Character[];
  onCharacterSelect: (character: Character) => void;
  onStorySelect: (storyPart: StoryPart) => void;
  selectedCharacter: Character | null;
}

const TimelineGrid: React.FC<TimelineGridProps> = ({
  characters,
  onCharacterSelect,
  onStorySelect,
  selectedCharacter,
}) => {
  const { yearRange, yearToIndex } = useMemo(() => {
    const yearsWithEvents = new Set<number>();
    characters.forEach((char) => {
      char.storyPartCharacters.forEach((spc) => {
        yearsWithEvents.add(spc.storyPart.aaDate.ceYear);
      });
    });
    const sortedYears = Array.from(yearsWithEvents).sort((a, b) => a - b);
    const yearToIndex = Object.fromEntries(
      sortedYears.map((year, index) => [year, index])
    );
    return { yearRange: sortedYears, yearToIndex };
  }, [characters]);

  const totalColumns = yearRange.length;

  const getCharactersForYear = (year: number) => {
    return characters.filter((character) =>
      character.storyPartCharacters.some(
        (spc) => spc.storyPart.aaDate.ceYear === year
      )
    );
  };

  const isCharacterHighlighted = (character: Character) => {
    return selectedCharacter?.characterId === character.characterId;
  };

  return (
    <div className="rounded-xl shadow-lg p-6 overflow-x-auto">
      <div className="min-w-[800px]">
        <div
          className="grid gap-4 border-b pb-4 sticky top-0 z-10"
          style={{
            gridTemplateColumns: `200px repeat(${totalColumns}, minmax(80px, 1fr))`,
          }}
        >
          <div></div>
          {yearRange.map((year) => (
            <div
              key={year}
              className="text-center text-sm font-medium text-gray-600"
            >
              {year} CE
            </div>
          ))}
        </div>

        {characters.map((character) => (
          <div
            key={character.characterId}
            className={`grid gap-4 items-center mt-4 transition-colors duration-200 ${
              selectedCharacter && !isCharacterHighlighted(character)
                ? "opacity-40"
                : ""
            }`}
            style={{
              gridTemplateColumns: `200px repeat(${totalColumns}, minmax(80px, 1fr))`,
            }}
          >
            <div
              className={`flex items-center gap-2 sticky left-0 z-10 py-1 cursor-pointer rounded-lg transition-colors ${
                isCharacterHighlighted(character)
                  ? "bg-blue-50 shadow-sm"
                  : "hover:bg-gray-500"
              }`}
              onClick={() => onCharacterSelect(character)}
            >
              <img
                src={`https://localhost:7023${character.imageUrl}`}
                alt={character.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{character.name}</span>
            </div>

            {yearRange.map((year) => {
              const hasStoryThisYear = character.storyPartCharacters.some(
                (spc) => spc.storyPart.aaDate.ceYear === year
              );

              return (
                <div
                  key={year}
                  className={`relative h-16 border-l border-gray-200 first:border-l-0 ${
                    hasStoryThisYear ? "" : ""
                  }`}
                >
                  {hasStoryThisYear && (
                    <TimelineEvents
                      characters={[character]} // Pass the character for this year
                      year={year}
                      onCharacterSelect={onCharacterSelect}
                      isHighlighted={isCharacterHighlighted(character)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineGrid;

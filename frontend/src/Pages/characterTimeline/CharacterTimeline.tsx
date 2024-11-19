import React, { useState, useEffect } from "react";
import axios from "axios";
import { Character, StoryPart } from "./types";
import TimelineGrid from "./TimelineGrid";
import CharacterDetails from "./Char/CharacterDetails";
import StoryDetails from "./story/StoryDetails";

const CharacterTimeline: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [selectedStory, setSelectedStory] = useState<StoryPart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get<Character[]>(
          "https://localhost:7023/api/Characters/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.length > 0) {
          setCharacters(response.data);
        } else {
          setError("No characters found.");
        }
      } catch (error) {
        setError("Failed to fetch characters from the API.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <TimelineGrid
          characters={characters}
          onCharacterSelect={setSelectedCharacter}
          onStorySelect={setSelectedStory}
          selectedCharacter={selectedCharacter}
        />

        <div className="flex gap-4">
          {selectedCharacter && (
            <CharacterDetails
              character={selectedCharacter}
              onClose={() => setSelectedCharacter(null)}
            />
          )}
          {selectedStory && (
            <StoryDetails
              story={selectedStory}
              onClose={() => setSelectedStory(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterTimeline;

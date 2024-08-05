import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Character, StoryPart } from "../../models/Character";
import AddStoryPartModal from "./AddStoryPartModal";
import { useNavigate } from "react-router-dom";

const CharacterDash: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [selectedStoryParts, setSelectedStoryParts] = useState<StoryPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isCharacterExpanded, setIsCharacterExpanded] =
    useState<boolean>(false);
  const [expandedStoryPartId, setExpandedStoryPartId] = useState<number | null>(
    null
  );

  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<Character[]>(
          "https://localhost:7023/api/Characters"
        );
        setCharacters(response.data || []);
      } catch (error) {
        console.error("Error fetching characters", error);
        setError("Failed to fetch characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (selectedCharacter) {
      fetchStoryParts(selectedCharacter.characterId);
    }
  }, [selectedCharacter]);

  const fetchStoryParts = async (characterId: number) => {
    try {
      const response = await axios.get<StoryPart[]>(
        `https://localhost:7023/api/Characters/${characterId}/storyparts`
      );
      if (response.status === 200) {
        const storyParts = response.data || [];
        const updatedStoryParts = await Promise.all(
          storyParts.map(async (storyPart) => {
            const storyResponse = await axios.get(
              `https://localhost:7023/api/Story/${storyPart.storyId}`
            );
            const storyTitle = storyResponse.data.title;
            return { ...storyPart, storyTitle };
          })
        );
        setSelectedStoryParts(updatedStoryParts);
      } else {
        console.error("Unexpected status code:", response.status);
        setError("Failed to fetch story parts. Please try again later.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("No story parts found for character:", characterId);
        setSelectedStoryParts([]);
      } else {
        console.error("Error fetching story parts", error);
        setError("Failed to fetch story parts. Please try again later.");
      }
    }
  };

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    setIsCharacterExpanded(false); // Reset the expanded state when selecting a new character
  };

  const handleDelete = async (characterId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this character?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://localhost:7023/api/Characters/${characterId}`
        );
        setCharacters(
          characters.filter(
            (character) => character.characterId !== characterId
          )
        );
        setSelectedCharacter(null);
        setSelectedStoryParts([]);
      } catch (error) {
        console.error("Error deleting character", error);
        setError("Failed to delete character. Please try again later.");
      }
    }
  };

  const handleUnlink = async (storyPartId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to unlink this story part?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://localhost:7023/api/StoryParts/unlinkCharacterFromStoryPart?storyPartId=${storyPartId}&characterId=${selectedCharacter?.characterId}`
        );
        setSelectedStoryParts(
          selectedStoryParts.filter(
            (storyPart) => storyPart.partId !== storyPartId
          )
        );
      } catch (error) {
        console.error("Error unlinking story part", error);
        setError("Failed to unlink story part. Please try again later.");
      }
    }
  };

  const handleCreateCharacter = () => {
    navigate("/characters/new");
  };

  const handleAddStoryPartClick = () => {
    setIsModalOpen(true);
  };

  const handleStoryPartAdded = () => {
    if (selectedCharacter) {
      fetchStoryParts(selectedCharacter.characterId);
    }
  };

  const scrollCarousel = (direction: number) => {
    const container = carouselRef.current;
    if (container) {
      container.scrollBy({
        left: direction * container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const toggleCharacterDescription = () => {
    setIsCharacterExpanded(!isCharacterExpanded);
  };

  const toggleStoryPartContent = (storyPartId: number) => {
    setExpandedStoryPartId(
      expandedStoryPartId === storyPartId ? null : storyPartId
    );
  };

  const isDescriptionExpanded = selectedCharacter && isCharacterExpanded;
  const isStoryPartExpanded = (storyPartId: number) =>
    expandedStoryPartId === storyPartId;

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="relative flex items-center overflow-hidden">
        <button
          className="absolute left-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
          onClick={() => scrollCarousel(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div
          className="flex overflow-x-auto scroll-smooth gap-4 p-4 mx-2"
          ref={carouselRef}
        >
          {characters.length === 0 ? (
            <p>No characters available</p>
          ) : (
            characters.map((character) => (
              <div
                key={character.characterId}
                className="flex-shrink-0 w-64 h-48 relative bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleCharacterClick(character)}
              >
                <img
                  src={`https://localhost:7023${character.imageUrl}`}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white dark:bg-opacity-75 text-center py-2 text-sm">
                  {character.name}
                </div>
              </div>
            ))
          )}
          <button
            className="py-2 px-4 rounded ml-4"
            onClick={handleCreateCharacter}
          >
            Add New Character
          </button>
        </div>
        <button
          className="absolute right-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
          onClick={() => scrollCarousel(1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {selectedCharacter && (
        <div className="mt-8 max-w-[700px] mx-auto text-center">
          <img
            src={`https://localhost:7023${selectedCharacter.imageUrl}`}
            alt={selectedCharacter.name}
            className="w-48 h-48 object-cover mx-auto rounded-lg"
          />
          <p
            className={`mt-4 text-lg overflow-hidden ${
              isDescriptionExpanded ? "max-h-full" : "max-h-24"
            } transition-all duration-300`}
          >
            {selectedCharacter.description}
          </p>
          {selectedCharacter.description.length > 100 && (
            <button
              className="text-blue-500 hover:text-blue-700 mt-2"
              onClick={toggleCharacterDescription}
            >
              {isDescriptionExpanded ? "Read Less" : "Read More"}
            </button>
          )}
          {selectedStoryParts.length > 0 ? (
            <div className="mt-4">
              {selectedStoryParts.map((storyPart) => (
                <div
                  key={storyPart.partId}
                  className="mb-4 p-4 rounded-lg shadow-md"
                >
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-center">
                      {storyPart.storyTitle} -{" "}
                      <button
                        className="text-red-500 hover:text-red-700 mt-2 text-sm"
                        onClick={() => handleUnlink(storyPart.partId)}
                      >
                        Unlink
                      </button>
                    </h3>
                  </div>
                  <p
                    className={`mt-2 text-center overflow-hidden ${
                      isStoryPartExpanded(storyPart.partId)
                        ? "max-h-full"
                        : "max-h-24"
                    } transition-all duration-300`}
                  >
                    {storyPart.content}
                  </p>
                  {storyPart.content.length > 100 && (
                    <button
                      className="text-blue-500 hover:text-blue-700 mt-2"
                      onClick={() => toggleStoryPartContent(storyPart.partId)}
                    >
                      {isStoryPartExpanded(storyPart.partId)
                        ? "Read Less"
                        : "Read More"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No story parts available</p>
          )}
          <div className="mt-4">
            <button
              className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 mr-4"
              onClick={handleAddStoryPartClick}
            >
              Add Story Parts
            </button>
            <button
              className="font-bold py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600"
              onClick={() =>
                selectedCharacter?.characterId &&
                handleDelete(selectedCharacter.characterId)
              }
            >
              Delete Character
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedCharacter && (
        <AddStoryPartModal
          characterId={selectedCharacter.characterId}
          onClose={() => setIsModalOpen(false)}
          onStoryPartAdded={handleStoryPartAdded}
        />
      )}
    </div>
  );
};

export default CharacterDash;

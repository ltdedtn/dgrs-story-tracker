import React, { useState, useEffect } from "react";
import axios from "axios";
import { Character } from "../../models/Character";

interface Relationship {
  relationshipId: number;
  characterAId: number;
  characterBId: number;
  relationshipTag: string;
}

interface RelationshipModalProps {
  characterId: number;
  onClose: () => void;
  onUpdate: () => void;
  onRelationshipUpdated: () => void;
}

const RelationshipModal: React.FC<RelationshipModalProps> = ({
  characterId,
  onClose,
  onUpdate,
  onRelationshipUpdated,
}) => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (url: string) => {
    const token = localStorage.getItem("token");
    return axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // Fetch all characters
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetchData(
          "https://localhost:7023/api/Characters"
        );
        setCharacters(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching characters", error);
        setError("Failed to fetch characters. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // Fetch the current character being edited
  useEffect(() => {
    const fetchCurrentCharacter = async () => {
      try {
        const response = await fetchData(
          `https://localhost:7023/api/Characters/${characterId}`
        );
        setCurrentCharacter(response.data);
      } catch (error) {
        console.error("Error fetching current character", error);
        setError("Failed to fetch character. Please try again.");
      }
    };

    fetchCurrentCharacter();
  }, [characterId]);

  // Fetch relationships
  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        const response = await fetchData(
          `https://localhost:7023/api/Characters/${characterId}/relationships`
        );
        // Check if response data is an array before setting it
        if (Array.isArray(response.data)) {
          setRelationships(response.data);
        } else {
          console.error("Unexpected response format", response.data);
          setRelationships([]); // or set to default relationships if needed
        }
      } catch (error) {
        console.error("Error fetching relationships", error);
        setError("Failed to fetch relationships. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelationships();
  }, [characterId]);

  // Handle relationship update
  const handleUpdate = async (
    relationshipId: number,
    relationshipTag: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://localhost:7023/api/Characters/relationship/${relationshipId}`,
        { relationshipId, relationshipTag },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the relationship locally
      setRelationships((prevRelationships) =>
        prevRelationships.map((relationship) =>
          relationship.relationshipId === relationshipId
            ? { ...relationship, relationshipTag }
            : relationship
        )
      );

      onUpdate();
      onRelationshipUpdated();
    } catch (error) {
      console.error("Error updating relationship", error);
      setError("Failed to update relationship. Please try again.");
    }
  };

  // Get character by ID
  const getCharacterById = (characterId: number) => {
    return characters.find((char) => char.characterId === characterId) || null;
  };

  // Filter relationships to include only those involving the current character
  const filteredRelationships = relationships.filter(
    (relationship) =>
      relationship.characterAId === characterId ||
      relationship.characterBId === characterId
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-xl font-bold mb-4">
            Edit Relationships For{" "}
            {currentCharacter ? currentCharacter.name : "Loading..."}
          </h2>

          {isLoading ? (
            <p>Loading relationships...</p>
          ) : (
            filteredRelationships.map((relationship) => {
              // Determine which character is the "related" one (not the current character)
              const relatedCharacterId =
                relationship.characterAId === characterId
                  ? relationship.characterBId
                  : relationship.characterAId;

              const relatedCharacter = getCharacterById(relatedCharacterId);

              return relatedCharacter ? (
                <div key={relationship.relationshipId} className="mb-4">
                  <div className="flex items-center mb-2">
                    {relatedCharacter.imageUrl && (
                      <img
                        src={`https://localhost:7023${relatedCharacter.imageUrl}`}
                        alt={relatedCharacter.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    )}
                    <div>
                      <p className="text-lg font-semibold">
                        {relatedCharacter.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {relatedCharacter.description}
                      </p>
                    </div>
                  </div>

                  <select
                    value={relationship.relationshipTag}
                    onChange={(e) =>
                      handleUpdate(relationship.relationshipId, e.target.value)
                    }
                    className="mt-2 p-2 border rounded w-full"
                  >
                    <option value="Friendly">Friendly</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Enemy">Enemy</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              ) : (
                <p key={relationship.relationshipId}>Character not found</p>
              );
            })
          )}

          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-4 flex justify-end">
            <button
              className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipModal;

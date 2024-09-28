import React, { useState, useEffect } from "react";
import axios from "axios";

interface Relationship {
  relationshipId: number; // Adjusted based on the API response
  characterAId: number; // Assuming this is the current character's ID
  characterBId: number; // ID of the related character
  relationshipTag: string; // Change to match the API response
}

interface RelationshipModalProps {
  characterId: number;
  onClose: () => void;
  onUpdate: () => void; // Existing prop
  onRelationshipUpdated: () => void; // New prop
}

const RelationshipModal: React.FC<RelationshipModalProps> = ({
  characterId,
  onClose,
  onUpdate,
  onRelationshipUpdated,
}) => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        const token = localStorage.getItem("token");
        setIsLoading(true);
        const response = await axios.get<Relationship[]>(
          `https://localhost:7023/api/Characters/${characterId}/relationships`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRelationships(response.data);
      } catch (error) {
        console.error("Error fetching relationships", error);
        setError("Failed to fetch relationships. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelationships();
  }, [characterId]);

  const handleUpdate = async (
    relationshipId: number,
    relationshipTag: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      // Make the PUT request to update the relationship
      await axios.put(
        `https://localhost:7023/api/Characters/relationship/${relationshipId}`,
        { relationshipId, relationshipTag }, // Use correct casing
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the state to reflect the change immediately
      setRelationships((prevRelationships) =>
        prevRelationships.map((relationship) =>
          relationship.relationshipId === relationshipId
            ? { ...relationship, relationshipTag } // Update the tag
            : relationship
        )
      );

      onUpdate(); // Optionally refresh relationships on parent component
      onRelationshipUpdated(); // Notify parent about relationship update
    } catch (error) {
      console.error("Error updating relationship", error);
      setError("Failed to update relationship. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Relationships</h2>
        {isLoading ? (
          <p>Loading relationships...</p>
        ) : (
          relationships.map((relationship) => (
            <div key={relationship.relationshipId} className="mb-4">
              <p className="text-lg">
                Related Character ID: {relationship.characterBId}
              </p>
              <select
                value={relationship.relationshipTag} // Using relationshipTag from the API
                onChange={(e) =>
                  handleUpdate(relationship.relationshipId, e.target.value)
                }
                className="mt-2 p-2 border rounded"
              >
                <option value="Friendly">Friendly</option>
                <option value="Neutral">Neutral</option>
                <option value="Enemy">Enemy</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          ))
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
  );
};

export default RelationshipModal;

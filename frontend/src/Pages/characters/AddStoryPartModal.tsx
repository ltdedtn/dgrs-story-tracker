import React, { useState, useEffect } from "react";
import axios from "axios";
import { Story } from "../../models/Story";
import { StoryPart } from "../../models/StoryPart";

interface AddStoryPartModalProps {
  characterId: number;
  onClose: () => void;
  onStoryPartAdded: () => void;
}

const AddStoryPartModal: React.FC<AddStoryPartModalProps> = ({
  characterId,
  onClose,
  onStoryPartAdded,
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [storyParts, setStoryParts] = useState<StoryPart[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<number | "">("");
  const [selectedStoryPartId, setSelectedStoryPartId] = useState<number | "">(
    ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoadingStories, setIsLoadingStories] = useState<boolean>(true);
  const [isLoadingStoryParts, setIsLoadingStoryParts] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoadingStories(true);
      try {
        const response = await axios.get<Story[]>(
          "https://localhost:7023/api/Story"
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories", error);
        setError("Failed to fetch stories. Please try again.");
      } finally {
        setIsLoadingStories(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const fetchStoryParts = async () => {
      if (selectedStoryId) {
        setIsLoadingStoryParts(true);
        try {
          const response = await axios.get<StoryPart[]>(
            `https://localhost:7023/api/StoryParts?storyId=${selectedStoryId}`
          );
          setStoryParts(response.data);
        } catch (error) {
          console.error("Error fetching story parts", error);
          setError("Failed to fetch story parts. Please try again.");
        } finally {
          setIsLoadingStoryParts(false);
        }
      } else {
        setStoryParts([]); // Clear story parts if no story is selected
      }
    };

    fetchStoryParts();
  }, [selectedStoryId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedStoryId || !selectedStoryPartId) {
      setError("Please select a story and a story part.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7023/api/StoryParts/linkCharacterToStoryPart",
        {
          storyPartId: selectedStoryPartId,
          characterId: characterId,
        }
      );

      if (response.status === 200) {
        console.log("Character linked to story part successfully.");
        onStoryPartAdded(); // Notify parent component to refresh the story parts
        onClose(); // Close the modal
      } else {
        setError("Failed to link character to story part. Please try again.");
      }
    } catch (error) {
      console.error("Error linking character to story part", error);
      setError("Failed to link character to story part. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add Story Part to Character</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="storyId" className="label">
              <span className="label-text">Select Story</span>
            </label>
            <select
              id="storyId"
              value={selectedStoryId}
              onChange={(e) => setSelectedStoryId(Number(e.target.value))}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select a Story</option>
              {isLoadingStories ? (
                <option>Loading stories...</option>
              ) : (
                stories.map((story) => (
                  <option key={story.storyId} value={story.storyId}>
                    {story.title}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="storyPartId" className="label">
              <span className="label-text">Select Story Part</span>
            </label>
            <select
              id="storyPartId"
              value={selectedStoryPartId}
              onChange={(e) => setSelectedStoryPartId(Number(e.target.value))}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select a Story Part</option>
              {isLoadingStoryParts ? (
                <option>Loading story parts...</option>
              ) : (
                storyParts.map((part) => (
                  <option key={part.partId} value={part.partId}>
                    {part.content}
                  </option>
                ))
              )}
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end space-x-4 mt-4">
            <button type="submit" className="btn btn-primary">
              Add Story Part
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoryPartModal;

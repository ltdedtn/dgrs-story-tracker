import React, { useState, useEffect } from "react";
import axios from "axios";
import { Story } from "../../models/Story";
import { StoryPart } from "../../models/StoryPart";
import { StoryGroup } from "../../models/StoryGroup"; // Assuming you have a StoryGroup model

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
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<number | "">("");
  const [selectedStoryPartId, setSelectedStoryPartId] = useState<number | "">(
    ""
  );
  const [selectedStoryGroupId, setSelectedStoryGroupId] = useState<number | "">(
    ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoadingStories, setIsLoadingStories] = useState<boolean>(true);
  const [isLoadingStoryParts, setIsLoadingStoryParts] =
    useState<boolean>(false);
  const [isLoadingStoryGroups, setIsLoadingStoryGroups] =
    useState<boolean>(true);

  // Fetch Story Groups
  useEffect(() => {
    const fetchStoryGroups = async () => {
      const token = localStorage.getItem("token");
      setIsLoadingStoryGroups(true);
      try {
        const response = await axios.get<StoryGroup[]>(
          "https://localhost:7023/api/StoryGroups",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStoryGroups(response.data);
      } catch (error) {
        console.error("Error fetching story groups", error);
        setError("Failed to fetch story groups. Please try again.");
      } finally {
        setIsLoadingStoryGroups(false);
      }
    };

    fetchStoryGroups();
  }, []);

  // Fetch Stories based on selected Story Group
  useEffect(() => {
    const fetchStories = async () => {
      if (selectedStoryGroupId) {
        const token = localStorage.getItem("token");
        setIsLoadingStories(true);
        try {
          const response = await axios.get<Story[]>(
            `https://localhost:7023/api/Story/ByStoryGroup/${selectedStoryGroupId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStories(response.data);
        } catch (error) {
          console.error("Error fetching stories", error);
          setError("Failed to fetch stories. Please try again.");
        } finally {
          setIsLoadingStories(false);
        }
      } else {
        setStories([]); // Clear stories if no group is selected
      }
    };

    fetchStories();
  }, [selectedStoryGroupId]); // Fetch stories whenever selectedStoryGroupId changes

  // Fetch Story Parts based on selected Story
  useEffect(() => {
    const fetchStoryParts = async () => {
      if (selectedStoryId) {
        const token = localStorage.getItem("token");
        setIsLoadingStoryParts(true);
        try {
          const response = await axios.get<StoryPart[]>(
            `https://localhost:7023/api/StoryParts/ByStory/${selectedStoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStoryParts(response.data);
        } catch (error) {
          console.error("Error fetching story parts", error);
          setError("Failed to fetch story parts. Please try again.");
        } finally {
          setIsLoadingStoryParts(false);
        }
      } else {
        setStoryParts([]);
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

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7023/api/StoryParts/linkCharacterToStoryPart",
        {
          storyPartId: selectedStoryPartId,
          characterId: characterId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onStoryPartAdded();
        onClose();
      } else {
        console.error("Failed with status code:", response.status);
        setError("Failed to link character to story part. Please try again.");
      }
    } catch (error) {
      console.error("Error linking character to story part", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("Unauthorized access. Please log in again.");
      } else {
        setError("Failed to link character to story part. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-2xl font-bold mb-4 ">
            Add Story Part to Character
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Story Group Selection */}
            <div className="form-control">
              <label htmlFor="storyGroupId" className="label">
                <span className="label-text ">Select Story Group</span>
              </label>
              <select
                id="storyGroupId"
                value={selectedStoryGroupId}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStoryGroupId(value ? Number(value) : "");
                  setStories([]); // Clear stories when changing groups
                  setSelectedStoryId(""); // Reset selected story
                  setStoryParts([]); // Clear story parts when changing groups
                }}
                className="select select-bordered w-full "
                required
              >
                <option value="">Select a Story Group</option>
                {isLoadingStoryGroups ? (
                  <option>Loading story groups...</option>
                ) : (
                  storyGroups.map((group) => (
                    <option key={group.storyGroupId} value={group.storyGroupId}>
                      {group.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Story Selection */}
            <div className="form-control">
              <label htmlFor="storyId" className="label">
                <span className="label-text ">Select Story</span>
              </label>
              <select
                id="storyId"
                value={selectedStoryId}
                onChange={(e) => setSelectedStoryId(Number(e.target.value))}
                className="select select-bordered w-full "
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

            {/* Story Part Selection */}
            <div className="form-control">
              <label htmlFor="storyPartId" className="label">
                <span className="label-text ">Select Story Part</span>
              </label>
              <select
                id="storyPartId"
                value={selectedStoryPartId}
                onChange={(e) => setSelectedStoryPartId(Number(e.target.value))}
                className="select select-bordered w-full "
                required
              >
                <option value="">Select a Story Part</option>
                {isLoadingStoryParts ? (
                  <option>Loading story parts...</option>
                ) : (
                  storyParts.map((part) => (
                    <option key={part.storyPartId} value={part.storyPartId}>
                      {part.content}
                    </option>
                  ))
                )}
              </select>
            </div>

            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
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
    </div>
  );
};

export default AddStoryPartModal;

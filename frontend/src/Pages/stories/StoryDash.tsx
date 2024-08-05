import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Story } from "../../models/Story";
import { StoryPart } from "../../models/StoryPart";

const StoryDash = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyParts, setStoryParts] = useState<StoryPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPartId, setExpandedPartId] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const storiesCarouselRef = useRef<HTMLDivElement>(null);
  const storyPartsCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get<Story[]>(
          "https://localhost:7023/api/Story"
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories", error);
        setError("Failed to fetch stories. Please try again later.");
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (selectedStory) {
      const fetchStoryParts = async () => {
        try {
          const url = `https://localhost:7023/api/StoryParts/ByStory/${selectedStory.storyId}`;
          const response = await axios.get<StoryPart[]>(url);
          setStoryParts(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn("Story parts not found for the selected story.");
            setStoryParts([]);
          } else {
            console.error("Error fetching story parts", error);
            setError("Failed to fetch story parts. Please try again later.");
          }
        }
      };

      fetchStoryParts();
    } else {
      setStoryParts([]);
    }
  }, [selectedStory]);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setIsDescriptionExpanded(false);
  };

  const handleAddStoryPartClick = () => {
    navigate("/storyPart/new");
  };

  const handleCreateStoryClick = () => {
    navigate("/stories/new");
  };

  const scrollCarousel = (
    direction: number,
    carouselRef: React.RefObject<HTMLDivElement>
  ) => {
    const container = carouselRef.current;
    if (container) {
      container.scrollBy({
        left: direction * container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const toggleExpandPart = (partId: number) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="relative flex items-center overflow-hidden">
        <button
          className="absolute left-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
          onClick={() => scrollCarousel(-1, storiesCarouselRef)}
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
          ref={storiesCarouselRef}
        >
          {stories.length === 0 ? (
            <p>No stories available</p>
          ) : (
            stories.map((story) => (
              <div
                key={story.storyId}
                className="flex-shrink-0 w-64 h-48 relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleStoryClick(story)}
              >
                <img
                  src={`https://localhost:7023/${story.imageUrl}`}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm">
                  {story.title}
                </div>
              </div>
            ))
          )}
          <button
            className="py-2 px-4 rounded ml-4"
            onClick={handleCreateStoryClick}
          >
            Add New Story
          </button>
        </div>
        <button
          className="absolute right-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
          onClick={() => scrollCarousel(1, storiesCarouselRef)}
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

      {selectedStory && (
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{selectedStory.title}</h2>
          <div className="max-w-3xl mx-auto mb-4 text-left">
            <div
              className={`text-lg ${
                isDescriptionExpanded ? "" : "line-clamp-3"
              }`}
            >
              {selectedStory.description}
            </div>
            <button className="mt-2 rounded" onClick={toggleDescription}>
              {isDescriptionExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
              onClick={() => scrollCarousel(-1, storyPartsCarouselRef)}
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
              ref={storyPartsCarouselRef}
            >
              {storyParts.length === 0 ? (
                <p>No story parts available</p>
              ) : (
                storyParts.map((part) => (
                  <div
                    key={part.partId}
                    className="flex-shrink-0 w-64 rounded-lg p-4"
                  >
                    {part.imageUrl && (
                      <img
                        src={`https://localhost:7023/${part.imageUrl}`}
                        alt={`Story Part ${part.partId}`}
                        className="w-full h-40 object-cover mb-4"
                      />
                    )}
                    <div>
                      {expandedPartId === part.partId
                        ? part.content
                        : `${part.content.split("\n")[0]}...`}
                    </div>
                    <button
                      className="mt-2 py-1 px-3 rounded"
                      onClick={() => toggleExpandPart(part.partId)}
                    >
                      {expandedPartId === part.partId
                        ? "Read Less"
                        : "Read More"}
                    </button>
                  </div>
                ))
              )}
              <button
                className="py-2 px-4 rounded ml-4"
                onClick={handleAddStoryPartClick}
              >
                Add New Story Part
              </button>
            </div>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
              onClick={() => scrollCarousel(1, storyPartsCarouselRef)}
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
        </div>
      )}
    </div>
  );
};

export default StoryDash;

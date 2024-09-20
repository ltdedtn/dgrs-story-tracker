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
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Story[]>(
          "https://localhost:7023/api/Story",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
        const token = localStorage.getItem("token");
        try {
          const url = `https://localhost:7023/api/StoryParts/ByStory/${selectedStory.storyId}`;
          const response = await axios.get<StoryPart[]>(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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

  const isScrollLeftEnabled = () => {
    const container = storiesCarouselRef.current;
    if (container) {
      return container.scrollLeft > 0;
    }
    return false;
  };

  const isScrollRightEnabled = () => {
    const container = storiesCarouselRef.current;
    if (container) {
      return (
        container.scrollWidth > container.clientWidth + container.scrollLeft
      );
    }
    return false;
  };

  const isStoryPartsScrollLeftEnabled = () => {
    const container = storyPartsCarouselRef.current;
    if (container) {
      return container.scrollLeft > 0;
    }
    return false;
  };

  const isStoryPartsScrollRightEnabled = () => {
    const container = storyPartsCarouselRef.current;
    if (container) {
      return (
        container.scrollWidth > container.clientWidth + container.scrollLeft
      );
    }
    return false;
  };

  const toggleExpandPart = (partId: number) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };
  const isScrollableLeft = (carouselRef: React.RefObject<HTMLDivElement>) => {
    const container = carouselRef.current;
    return container && container.scrollLeft > 0;
  };

  const isScrollableRight = (carouselRef: React.RefObject<HTMLDivElement>) => {
    const container = carouselRef.current;
    return (
      container &&
      container.scrollWidth > container.scrollLeft + container.clientWidth
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stories</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/stories/new")}
        >
          Create New Story
        </button>
      </div>
      <div className="relative flex items-center overflow-hidden">
        {isScrollableRight(storiesCarouselRef) && (
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
        )}
        {isScrollableLeft(storiesCarouselRef) && (
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
        )}
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
                onClick={() => setSelectedStory(story)}
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
        </div>
      </div>
      <div>
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Story Parts</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/storyPart/new")}
          >
            Create New Story Part
          </button>
        </div>

        {selectedStory && (
          <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{selectedStory.title}</h2>
            <div>
              <div className="text-xl">Content</div>
              <div className="max-w-3xl mx-auto mb-4 text-left">
                {selectedStory.content || "No content available"}
              </div>
            </div>
            <div>
              <div className="text-xl">Summary</div>
              <div className="max-w-3xl mx-auto mb-4 text-left">
                <div
                  className={`text-lg ${
                    isDescriptionExpanded ? "" : "line-clamp-3"
                  }`}
                >
                  {selectedStory.description || "No description available"}
                </div>
                {selectedStory.description &&
                  selectedStory.description.length > 100 && (
                    <button
                      className="mt-2 rounded"
                      onClick={toggleDescription}
                    >
                      {isDescriptionExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
              </div>
            </div>

            <div className="relative flex items-center overflow-hidden">
              {isScrollableRight(storyPartsCarouselRef) && (
                <button
                  className="absolute left-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
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
              )}
              {isScrollableLeft(storyPartsCarouselRef) && (
                <button
                  className="absolute right-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
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
              )}
              <div
                className="flex overflow-x-auto scroll-smooth gap-4 p-4 mx-2"
                ref={storyPartsCarouselRef}
              >
                {storyParts.length === 0 ? (
                  <p>No story parts available</p>
                ) : (
                  storyParts.map((part) => (
                    <div
                      key={part.storyPartId}
                      className="flex-shrink-0 w-64 h-48 relative bg-gray-200 rounded-lg overflow-hidden"
                      onClick={() => toggleExpandPart(part.storyPartId)}
                    >
                      <img
                        src={`https://localhost:7023/${part.imageUrl}`}
                        alt={part.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm">
                        {part.title}
                      </div>
                      {expandedPartId === part.storyPartId && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white p-4">
                          <p>{part.description}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDash;

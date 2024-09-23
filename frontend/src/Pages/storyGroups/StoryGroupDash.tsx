import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { StoryGroup } from "../../models/StoryGroup";
import { Story } from "../../models/Story";
import { StoryPart } from "../../models/StoryPart";
import { useNavigate } from "react-router-dom";

const StoryGroupDash = () => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [selectedStoryGroup, setSelectedStoryGroup] =
    useState<StoryGroup | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyParts, setStoryParts] = useState<StoryPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPartId, setExpandedPartId] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const [showStoryGroupButtons, setShowStoryGroupButtons] =
    useState<boolean>(false);
  const [showStoryButtons, setShowStoryButtons] = useState<boolean>(false);
  const [showStoryPartButtons, setShowStoryPartButtons] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const storyGroupsCarouselRef = useRef<HTMLDivElement>(null);
  const storiesCarouselRef = useRef<HTMLDivElement>(null);
  const storyPartsCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStoryGroups = async () => {
      try {
        const response = await axios.get<StoryGroup[]>(
          "https://localhost:7023/api/StoryGroups"
        );
        setStoryGroups(response.data);
      } catch (error) {
        console.error("Error fetching story groups", error);
        setError("Failed to fetch story groups. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStoryGroups();
  }, []);

  useEffect(() => {
    if (selectedStoryGroup) {
      const fetchStories = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get<Story[]>(
            `https://localhost:7023/api/Story/ByStoryGroup/${selectedStoryGroup.storyGroupId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStories(response.data);
        } catch (error) {
          console.error("Error fetching stories", error);
          setError("Failed to fetch stories. Please try again later.");
        }
      };
      fetchStories();
    } else {
      setStories([]);
    }
  }, [selectedStoryGroup]);

  useEffect(() => {
    if (selectedStory) {
      const fetchStoryParts = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get<StoryPart[]>(
            `https://localhost:7023/api/StoryParts/ByStory/${selectedStory.storyId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(response.data);
          setStoryParts(response.data);
        } catch (error) {
          console.error("Error fetching story parts", error);
          setError("Failed to fetch story parts. Please try again later.");
        }
      };
      fetchStoryParts();
    } else {
      setStoryParts([]);
    }
  }, [selectedStory]);

  const checkIfScrollable = (
    carouselRef: React.RefObject<HTMLDivElement>,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const carousel = carouselRef.current;
    if (carousel) {
      setShow(carousel.scrollWidth > carousel.clientWidth);
    }
  };

  useEffect(() => {
    checkIfScrollable(storyGroupsCarouselRef, setShowStoryGroupButtons);
    const handleResize = () =>
      checkIfScrollable(storyGroupsCarouselRef, setShowStoryGroupButtons);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [storyGroups]);

  useEffect(() => {
    checkIfScrollable(storiesCarouselRef, setShowStoryButtons);
    const handleResize = () =>
      checkIfScrollable(storiesCarouselRef, setShowStoryButtons);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stories]);

  useEffect(() => {
    checkIfScrollable(storyPartsCarouselRef, setShowStoryPartButtons);
    const handleResize = () =>
      checkIfScrollable(storyPartsCarouselRef, setShowStoryPartButtons);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [storyParts]);

  const handleStoryGroupClick = (storyGroup: StoryGroup) => {
    console.log("check");
    console.log(storyGroup);
    setSelectedStoryGroup(storyGroup);
    setSelectedStory(null);
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setIsDescriptionExpanded(false);
  };

  const toggleExpandPart = (partId: number) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const scrollCarousel = useCallback(
    (direction: number, carouselRef: React.RefObject<HTMLDivElement>) => {
      const container = carouselRef.current;
      if (container) {
        container.scrollBy({
          left: direction * container.clientWidth,
          behavior: "smooth",
        });
      }
    },
    []
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 h-full">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Story Groups</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/newStoryGroup")}
        >
          Create Story Group
        </button>
      </div>

      <div className="relative flex items-center overflow-hidden">
        {showStoryGroupButtons && (
          <button
            className="absolute left-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
            onClick={() => scrollCarousel(-1, storyGroupsCarouselRef)}
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
        <div
          className="flex overflow-x-auto scroll-smooth gap-4 p-4 mx-2"
          ref={storyGroupsCarouselRef}
        >
          {storyGroups.map((storyGroup) => (
            <div
              key={storyGroup.storyGroupId}
              className="flex-shrink-0 w-64 h-48 relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleStoryGroupClick(storyGroup)}
            >
              <img
                src={`https://localhost:7023/${storyGroup.imageUrl}`}
                alt={storyGroup.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm">
                {storyGroup.title}
              </div>
            </div>
          ))}
        </div>
        {showStoryGroupButtons && (
          <button
            className="absolute right-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
            onClick={() => scrollCarousel(1, storyGroupsCarouselRef)}
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
      </div>

      {selectedStoryGroup && (
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold">{selectedStoryGroup.title}</h2>
          <br />
          <div>
            <div className="text-xl">Description</div>
            <div className="max-w-3xl mx-auto mb-4 text-left">
              <div
                className={`text-lg ${
                  isDescriptionExpanded ? "" : "line-clamp-3"
                }`}
              >
                {selectedStoryGroup.description || "No description available"}
              </div>
              {selectedStoryGroup.description &&
                selectedStoryGroup.description.length > 100 && (
                  <button className="mt-2 rounded" onClick={toggleDescription}>
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {selectedStoryGroup && (
        <div className="mt-8 ">
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
            {showStoryButtons && (
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
            <div
              className="flex overflow-x-auto scroll-smooth gap-4 p-4 mx-2"
              ref={storiesCarouselRef}
            >
              {stories.map((story) => (
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
              ))}
            </div>
            {showStoryButtons && (
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
          </div>

          {selectedStory && (
            <div className="mt-8 text-center">
              <h3 className="text-3xl font-bold">{selectedStory.title}</h3>

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

              <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Story Parts</h1>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/storyPart/new")}
                >
                  Create New Story Part
                </button>
              </div>

              <div className="relative flex items-center overflow-hidden">
                {showStoryPartButtons && (
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
                        className="flex-shrink-0 w-64 rounded-lg cursor-pointer"
                      >
                        {part.imageUrl && (
                          <div className="relative">
                            <img
                              src={`https://localhost:7023/${part.imageUrl}`}
                              alt={`Story Part ${part.storyPartId}`}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm">
                              {part.title}
                            </div>
                          </div>
                        )}
                        <div className="p-2">
                          <div className="text-xl">Content</div>
                          <div className="mb-4 text-left">
                            {expandedPartId === part.storyPartId
                              ? part.content
                              : part.content.length > 100
                              ? `${part.content.slice(0, 100)}...`
                              : part.content}
                          </div>
                          {part.content.length > 100 && (
                            <button
                              className="mt-2 px-3 rounded"
                              onClick={() => toggleExpandPart(part.storyPartId)}
                            >
                              {expandedPartId === part.storyPartId
                                ? "Read Less"
                                : "Read More"}
                            </button>
                          )}
                          <div className="text-xl py-1">Summary</div>
                          <div className="mb-4 text-left">
                            {expandedPartId === part.storyPartId
                              ? part.description || "No summary available."
                              : part.description || "No summary available."}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {showStoryPartButtons && (
                  <button
                    className="absolute right-0 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
                    onClick={() => scrollCarousel(1, storyPartsCarouselRef)}
                  >
                    {
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
                    }
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryGroupDash;

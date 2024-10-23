import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { StoryGroup } from "../../models/StoryGroup";
import { Story } from "../../models/Story";
import { StoryPart } from "../../models/StoryPart";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../users/UserContext";

const StoryGroupDash = () => {
  const { role } = useUserContext();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [selectedStoryGroup, setSelectedStoryGroup] =
    useState<StoryGroup | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedStoryPart, setSelectedStoryPart] = useState<Story | null>(
    null
  );
  const [storyParts, setStoryParts] = useState<StoryPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
          "http://localhost:7023/api/StoryGroups"
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
            `http://localhost:7023/api/Story/ByStoryGroup/${selectedStoryGroup.storyGroupId}`,
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
            `http://localhost:7023/api/StoryParts/ByStory/${selectedStory.storyId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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

  const handleStoryPartDelete = async (storyPartId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story part?"
    );
    if (confirmDelete) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(
          `http://localhost:7023/api/StoryParts/${storyPartId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the state to remove the deleted story part
        setStoryParts((prevParts) =>
          prevParts.filter((part) => part.storyPartId !== storyPartId)
        );
      } catch (error) {
        console.error("Error deleting story part", error);
        setError("Failed to delete story part. Please try again later.");
      }
    }
  };

  const handleStoryGroupDelete = async (storyGroupId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story group?"
    );
    if (confirmDelete) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(
          `http://localhost:7023/api/StoryGroups/${storyGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the state to remove the deleted story group
        setStoryGroups((prevGroups) =>
          prevGroups.filter((group) => group.storyGroupId !== storyGroupId)
        );

        // Optionally, clear the selected story group if it's currently selected
        if (selectedStoryGroup?.storyGroupId === storyGroupId) {
          setSelectedStoryGroup(null);
        }
      } catch (error) {
        console.error("Error deleting story group", error);
        setError("Failed to delete story group. Please try again later.");
      }
    }
  };

  const handleStoryDelete = async (storyId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story group?"
    );
    if (confirmDelete) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:7023/api/Story/${storyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the state to remove the deleted story
        setStories((prevStories) =>
          prevStories.filter((story) => story.storyId !== storyId)
        );

        // Optionally, clear the selected story if it's currently selected
        if (selectedStory?.storyId === storyId) {
          setSelectedStoryGroup(null);
        }
      } catch (error) {
        console.error("Error deleting story", error);
        setError("Failed to delete story. Please try again later.");
      }
    }
  };

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
    setSelectedStoryGroup(storyGroup);
    setSelectedStory(null);
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setIsDescriptionExpanded(false);
  };
  const handleStoryPartClick = (part: any) => {
    console.log(part);
    setSelectedStoryPart(part);
    setIsDescriptionExpanded(false);
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
    <div className="p-4 h-full ">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Story Groups</h1>
        {(role === "Admin" || role === "Editor") && (
        <button
          className="btn btn-primary"
          onClick={() => navigate("/newStoryGroup")}
        >
          Create Story Group
        </button>
        )}
      </div>

      <div className="relative flex items-center overflow-hidden">
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
                src={`http://localhost:7023/${storyGroup.imageUrl}`}
                alt={storyGroup.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm">
                {storyGroup.title}
              </div>
            
              {/* Edit Button */}
              {(role === "Admin" || role === "Editor") && (
              <button
                className="absolute top-2 left-2 z-10 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from triggering story group click
                  navigate(`/edit-story-group/${storyGroup.storyGroupId}`); // Navigate to the edit page
                }}
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
                    d="M16 4l4 4-8 8H8v-4l8-8z"
                  />
                </svg>
              </button>
              )}

              {/* Delete Button */}
              {role === "Admin" && (
              <button
                className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from triggering story group click
                  handleStoryGroupDelete(storyGroup.storyGroupId); // Call your delete function here
                }}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              )}
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
            {(role === "Admin" || role === "Editor") && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/stories/new")}
            >
              Create New Story
            </button>
            )}
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
                    src={`http://localhost:7023/${story.imageUrl}`}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm">
                    {story.title}
                  </div>
                  {/* Edit Button */}
                  {(role === "Admin" || role === "Editor") && (
                  <button
                    className="absolute top-2 left-2 z-10 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from triggering story group click
                      navigate(`/edit-story/${story.storyId}`); // Navigate to the edit page
                    }}
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
                        d="M16 4l4 4-8 8H8v-4l8-8z"
                      />
                    </svg>
                  </button>
                  )}
                  
                  {/* Delete Button */}
                  {role === "Admin" && (
                  <button
                    className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from triggering story group click
                      handleStoryDelete(story.storyId); // Call your delete function here
                    }}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  )}
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
                {(role === "Admin" || role === "Editor") && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/storyPart/new")}
                >
                  Create New Story Part
                </button>
                )}
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
                        className="flex-shrink-0 w-64 rounded-lg cursor-pointer relative"
                        onClick={() => handleStoryPartClick(part)}
                      >
                        {/* Image Section */}
                        {part.imageUrl && (
                          <div className="relative">
                            <img
                              src={`http://localhost:7023/${part.imageUrl}`}
                              alt={`Story Part ${part.storyPartId}`}
                              className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm">
                              {part.title}
                            </div>

                            {/* Edit Button */}
                            {(role === "Admin" || role === "Editor") && (
                            <button
                              className="absolute top-2 left-2 z-10 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent click event from triggering story group click
                                navigate(
                                  `/edit-story-part/${part.storyPartId}`
                                ); // Navigate to the edit page
                              }}
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
                                  d="M16 4l4 4-8 8H8v-4l8-8z"
                                />
                              </svg>
                            </button>
                            )}

                            {/* Delete Button */}
                            {role === "Admin" && (
                            <button
                              className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent click event from triggering story group click
                                handleStoryPartDelete(part.storyPartId); // Call your delete function here
                              }}
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                            )}
                          </div>
                        )}
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
              {selectedStoryPart && (
                <div className="mt-8 text-center">
                  <h2 className="text-3xl font-bold">
                    {selectedStoryPart.title}
                  </h2>
                  <br />
                  <div>
                    <div className="text-xl">Description</div>
                    <div className="max-w-3xl mx-auto mb-4 text-left">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedStoryPart.content
                            ? selectedStoryPart.content.replace(/\n/g, "<br />")
                            : "No content available",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl">Description</div>
                    <div className="max-w-3xl mx-auto mb-4 text-left">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedStoryPart.description
                            ? selectedStoryPart.description.replace(
                                /\n/g,
                                "<br />"
                              )
                            : "No description available",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryGroupDash;

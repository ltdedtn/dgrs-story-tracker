import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewStoryPart = () => {
  const [content, setContent] = useState<string>("");
  const [storyId, setStoryId] = useState<number | "">(""); // Initialize with an empty string
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const [error, setError] = useState<string | null>(null);
  const [stories, setStories] = useState<{ storyId: number; title: string }[]>(
    []
  ); // For dropdown
  const navigate = useNavigate();

  // Fetch available stories for the dropdown
  const fetchStories = async () => {
    try {
      const response = await axios.get<{ storyId: number; title: string }[]>(
        "https://localhost:7023/api/Story" // Updated endpoint
      );
      setStories(response.data);
    } catch (error) {
      console.error("Error fetching stories", error);
      setError("Failed to fetch stories. Please try again.");
    }
  };

  // Load stories on component mount
  useEffect(() => {
    fetchStories();
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (storyId === "") {
      setError("Please select a story.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("storyId", storyId.toString());
      if (imageFile) {
        formData.append("imageFile", imageFile); // Ensure this key matches the backend parameter name
      }

      await axios.post("https://localhost:7023/api/StoryParts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/stories");
    } catch (error) {
      console.error("Error creating new story part", error);
      setError("Failed to create story part. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Story Part</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label htmlFor="content" className="label">
            <span className="label-text">Content</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label htmlFor="storyId" className="label">
            <span className="label-text">Story</span>
          </label>
          <select
            id="storyId"
            value={storyId}
            onChange={(e) => setStoryId(Number(e.target.value) || "")} // Convert to number or empty string
            className="select select-bordered w-full"
            required
          >
            <option value="">Select a story</option>
            {stories.map((story) => (
              <option key={story.storyId} value={story.storyId}>
                {story.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="imageFile" className="label">
            <span className="label-text">Image</span>
          </label>
          <input
            type="file"
            id="imageFile"
            onChange={handleImageChange}
            className="input input-bordered w-full"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Create Story Part
        </button>
      </form>
    </div>
  );
};

export default NewStoryPart;

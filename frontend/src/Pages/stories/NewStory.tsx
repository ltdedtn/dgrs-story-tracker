import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewStory = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [storyGroupId, setStoryGroupId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storyGroups, setStoryGroups] = useState<
    {
      storyGroupId: number;
      title: string;
      description: string;
      imageUrl: string;
    }[]
  >([]);

  const navigate = useNavigate();

  // Fetch available story groups for the dropdown
  const fetchStoryGroups = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get<
        {
          storyGroupId: number;
          title: string;
          description: string;
          imageUrl: string;
        }[]
      >("https://localhost:7023/api/StoryGroups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStoryGroups(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching story groups", error);
      setError("Failed to fetch story groups. Please try again.");
    }
  };

  useEffect(() => {
    fetchStoryGroups();
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("storyGroupId", storyGroupId.toString()); // Append StoryGroupId
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      const token = localStorage.getItem("token");
      await axios.post("https://localhost:7023/api/Story", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/stories");
    } catch (error) {
      console.error("Error creating new story", error);
      setError("Failed to create story. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Story</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="content" className="label">
            <span className="label-text">Content</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={6}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label htmlFor="description" className="label">
            <span className="label-text">Summary</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label htmlFor="storyGroupId" className="label">
            <span className="label-text">Story Group</span>
          </label>
          <select
            id="storyGroupId"
            value={storyGroupId}
            onChange={(e) => setStoryGroupId(Number(e.target.value) || "")}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select a story group</option>
            {storyGroups.map((group) => (
              <option key={group.storyGroupId} value={group.storyGroupId}>
                {group.title} {/* Display the title here */}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="image" className="label">
            <span className="label-text">Image</span>
          </label>
          <input
            type="file"
            id="image"
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
          Create Story
        </button>
      </form>
    </div>
  );
};

export default NewStory;

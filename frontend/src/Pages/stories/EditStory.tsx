import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditStory = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [storyGroupId, setStoryGroupId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [storyGroups, setStoryGroups] = useState<
    { storyGroupId: number; title: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch the story data by story ID
  const fetchStoryData = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://localhost:7023/api/Story/${storyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { title, description, content, storyGroupId, imageUrl } =
        response.data;
      setTitle(title);
      setDescription(description);
      setContent(content);
      setStoryGroupId(storyGroupId);
      if (imageUrl) {
        setImagePreview(`https://localhost:7023${imageUrl}`);
      }
    } catch (error) {
      console.error("Error fetching story data", error);
      setError("Failed to fetch story data. Please try again.");
    }
  }, [storyId]);

  // Fetch available story groups for the dropdown
  useEffect(() => {
    const fetchStoryGroups = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<
          { storyGroupId: number; title: string }[]
        >("https://localhost:7023/api/StoryGroups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStoryGroups(response.data);
      } catch (error) {
        console.error("Error fetching story groups", error);
        setError("Failed to fetch story groups. Please try again.");
      }
    };

    fetchStoryGroups();
  }, []);

  useEffect(() => {
    fetchStoryData(); // Fetch the story data
  }, [fetchStoryData]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Reset error state on submission

    try {
      const formData = new FormData();
      formData.append("StoryId", String(storyId)); // Ensure storyId is a string
      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("Content", content);
      formData.append("StoryGroupId", storyGroupId.toString());

      // If there is an image file, append it with the right content type
      if (imageFile) {
        formData.append("ImageUrl", imageFile.name); // This might not be necessary, but include for clarity
        formData.append("ContentType", imageFile.type); // Optional
        formData.append(
          "ContentDisposition",
          `attachment; filename="${imageFile.name}"`
        ); // Optional
        formData.append("imageFile", imageFile);
      }

      // Log the contents of formData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const token = localStorage.getItem("token");
      await axios.put(`https://localhost:7023/api/Story/${storyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/stories");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error updating story", error.response.data);
        setError(
          error.response.data.message ||
            "Failed to update story. Please try again."
        );
      } else {
        console.error("Unexpected error", error);
        setError("Failed to update story. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Story</h1>
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
                {group.title}
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
              <img src={imagePreview} alt="Preview" className="object-cover" />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Update Story
        </button>
      </form>
    </div>
  );
};

export default EditStory;

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditStoryGroup = () => {
  const { storyGroupId } = useParams<{ storyGroupId: string }>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch story group data by ID
  useEffect(() => {
    const fetchStoryGroupData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `https://localhost:7023/api/StoryGroups/${storyGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { title, description, imageUrl } = response.data;
        setTitle(title);
        setDescription(description);
        if (imageUrl) {
          setImagePreview(`https://localhost:7023${imageUrl}`);
        }
      } catch (error) {
        console.error("Error fetching story group data", error);
        setError("Failed to fetch story group data. Please try again.");
      }
    };

    fetchStoryGroupData();
  }, [storyGroupId]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null); // Reset error state on submission

    try {
      const formData = new FormData();
      formData.append("StoryGroupId", String(storyGroupId));
      formData.append("Title", title);
      formData.append("Description", description);

      // If there is an image file, append it
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7023/api/StoryGroups/${storyGroupId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/stories"); // Redirect to the story groups list or detail page
    } catch (error) {
      console.error("Error updating story group", error);
      setError("Failed to update story group. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Story Group</h1>
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
          <label htmlFor="description" className="label">
            <span className="label-text">Description</span>
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
          Update Story Group
        </button>
      </form>
    </div>
  );
};

export default EditStoryGroup;

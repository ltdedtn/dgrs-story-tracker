import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewStory = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("userId", ""); // Sending an empty string to represent null
      if (imageFile) {
        formData.append("imageFile", imageFile); // Ensure this key matches the backend parameter name
      }

      await axios.post("https://localhost:7023/api/Story", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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

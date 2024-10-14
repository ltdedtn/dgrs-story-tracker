import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditStoryPart = () => {
  const { storyPartId } = useParams<{ storyPartId: string }>(); // Get the ID from the route
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [storyId, setStoryId] = useState<number | "">("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stories, setStories] = useState<{ storyId: number; title: string }[]>(
    []
  );
  const navigate = useNavigate();

  // Fetch the story part data by ID
  const fetchStoryPart = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:7023/api/StoryParts/${storyPartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { title, content, description, storyId, imageUrl } = response.data;
      setTitle(title);
      setContent(content);
      setDescription(description);
      setStoryId(storyId);

      // Ensure the image URL is prefixed correctly
      if (imageUrl) {
        setImagePreview(`http://localhost:7023${imageUrl}`); // Load existing image if available
      }
    } catch (error) {
      console.error("Error fetching story part", error);
      setError("Failed to fetch story part. Please try again.");
    }
  }, [storyPartId]);

  // Fetch available stories for the dropdown
  const fetchStories = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get<{ storyId: number; title: string }[]>(
        "http://localhost:7023/api/Story",
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
    }
  };

  useEffect(() => {
    fetchStoryPart(); // Load story part data
    fetchStories(); // Fetch list of stories
  }, [fetchStoryPart]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file); // Save the selected file for upload
      setImagePreview(URL.createObjectURL(file)); // Preview the image locally
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      formData.append("partId", storyPartId ? storyPartId.toString() : "");

      formData.append("title", title);
      formData.append("content", content);
      formData.append("description", description);

      if (imageFile) {
        formData.append("imageFile", imageFile); // Append the new image file if selected
      }

      // Send the updated data to the backend
      const response = await axios.put(
        `http://localhost:7023/api/StoryParts/${storyPartId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After the successful update, update the image preview with the actual URL
      if (response.data.imageUrl) {
        setImagePreview(`http://localhost:7023${response.data.imageUrl}`);
      }

      navigate("/stories");
    } catch (error) {
      console.error("Error updating story part", error);
      setError("Failed to update story part. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Story Part</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            id="title"
            type="text"
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
            rows={4}
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
            rows={3}
            placeholder="Add a short summary for this story part"
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
            onChange={(e) => setStoryId(Number(e.target.value) || "")}
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
              <img src={imagePreview} alt="Preview" className=" object-cover" />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Update Story Part
        </button>
      </form>
    </div>
  );
};

export default EditStoryPart;

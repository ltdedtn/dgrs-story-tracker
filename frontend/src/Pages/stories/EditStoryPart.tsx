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
  const [youtubeLink, setYoutubeLink] = useState<string>(""); // New YouTube link field

  const [ceYear, setCeYear] = useState<number | "">("");
  const [monthNumber, setMonthNumber] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [isAD, setIsAD] = useState<boolean>(true); // Default to AD

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
        `https://localhost:7023/api/StoryParts/${storyPartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const {
        title,
        content,
        description,
        storyId,
        imageUrl,
        ceYear,
        monthNumber,
        day,
        isAD,
        youtubeLink,
      } = response.data;

      setTitle(title || "");
      setContent(content || "");
      setDescription(description || "");
      setStoryId(storyId || "");
      setCeYear(ceYear || "");
      setMonthNumber(monthNumber || "");
      setDay(day || "");
      setIsAD(isAD || true);
      setYoutubeLink(youtubeLink || "");

      if (imageUrl) {
        setImagePreview(`https://localhost:7023${imageUrl}`);
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
      formData.append("ceYear", ceYear.toString());
      formData.append("monthNumber", monthNumber.toString());
      formData.append("day", day.toString());
      formData.append("isAD", isAD.toString());
      formData.append("youtubeLink", youtubeLink);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axios.put(
        `https://localhost:7023/api/StoryParts/${storyPartId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

        {/* Date Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={ceYear}
              onChange={(e) => setCeYear(Number(e.target.value))}
              className="input input-bordered w-1/3"
              required
            />
            <input
              type="number"
              value={monthNumber}
              onChange={(e) => setMonthNumber(Number(e.target.value))}
              min="1"
              max="12"
              className="input input-bordered w-1/3"
              required
            />
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              min="1"
              max="31"
              className="input input-bordered w-1/3"
              required
            />
          </div>
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

        {/* YouTube Link Field */}
        <div className="form-control">
          <label htmlFor="youtubeLink" className="label">
            <span className="label-text">YouTube Link</span>
          </label>
          <input
            id="youtubeLink"
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter YouTube URL"
          />
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
            <span className="label-text">Upload Image</span>
          </label>
          <input
            id="imageFile"
            type="file"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 max-h-48 rounded shadow"
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditStoryPart;

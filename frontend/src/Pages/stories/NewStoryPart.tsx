import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewStoryPart = () => {
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

  // New state variables for date fields
  const [ceYear, setCeYear] = useState<number | "">("");
  const [monthNumber, setMonthNumber] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [isAD, setIsAD] = useState<boolean>(true); // Assuming true for AD by default
  const [youtubeLink, setYoutubeLink] = useState<string>("");

  const navigate = useNavigate();

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
    fetchStories();
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
    if (storyId === "" || ceYear === "" || monthNumber === "" || day === "") {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      formData.append("title", title);
      formData.append("content", content);
      formData.append("description", description);
      formData.append("storyId", storyId.toString());
      formData.append("CEYear", ceYear.toString());
      formData.append("MonthNumber", monthNumber.toString());
      formData.append("Day", day.toString());
      formData.append("IsAD", isAD.toString());
      formData.append("YoutubeLink", youtubeLink);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axios.post("https://localhost:7023/api/StoryParts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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

        {/* New Date Fields */}
        <div className="form-control">
          <label htmlFor="ceYear" className="label">
            <span className="label-text">CE Year</span>
          </label>
          <input
            id="ceYear"
            type="number"
            value={ceYear}
            onChange={(e) => setCeYear(Number(e.target.value) || "")}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="monthNumber" className="label">
            <span className="label-text">Month Number</span>
          </label>
          <input
            id="monthNumber"
            type="number"
            value={monthNumber}
            onChange={(e) => setMonthNumber(Number(e.target.value) || "")}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="day" className="label">
            <span className="label-text">Day</span>
          </label>
          <input
            id="day"
            type="number"
            value={day}
            onChange={(e) => setDay(Number(e.target.value) || "")}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="isAD" className="label">
            <span className="label-text">Is AD?</span>
          </label>
          <select
            id="isAD"
            value={isAD ? "true" : "false"}
            onChange={(e) => setIsAD(e.target.value === "true")}
            className="select select-bordered w-full"
            required
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
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
            placeholder="Enter YouTube link for this story part"
          />
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
              <img src={imagePreview} alt="Preview" className="object-cover" />
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

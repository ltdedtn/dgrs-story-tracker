import React from "react";
import { StoryPart } from "../types";
import { formatDate } from "../utils";
import { X } from "lucide-react";

interface StoryDetailsProps {
  story: StoryPart;
  onClose: () => void;
}

const StoryDetails: React.FC<StoryDetailsProps> = ({ story, onClose }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl p-6 animate-in slide-in-from-right z-10">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="mt-8">
        {story.imageUrl && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
            <img
              src={`https://localhost:7023${story.imageUrl}`}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold">{story.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{formatDate(story.aaDate)}</p>

        <div className="my-4 prose prose-sm">
          <p>{story.description}</p>
        </div>

        {story.youtubeLink && (
          <div className="my-4">
            <h3 className="text-lg font-semibold mb-2">Video</h3>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${story.youtubeLink}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Characters Involved</h3>
          <div className="space-y-2">
            {story.storyPartCharacters?.map((spc) => (
              <div
                key={spc.characterId}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <img
                  src={spc.character.imageUrl}
                  alt={spc.character.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{spc.character.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetails;

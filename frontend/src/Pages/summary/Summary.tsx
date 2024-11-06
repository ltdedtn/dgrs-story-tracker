import React from "react";

const Summary = () => {
  return (
    <div className="summary-page p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Introduction</h1>

      {/* YouTube Video */}
      <div className="flex justify-center mb-6">
        <iframe
          width="600"
          height="400"
          src="https://www.youtube.com/embed/isK6VuGAbs4" // Replace with your YouTube video ID
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="shadow-lg"
        ></iframe>
      </div>

      {/* Description Text */}
      <div className="text-lg text-center">
        <p>
          Welcome to the stories! Here, you’ll find a rich collection of
          narratives and characters that bring life to our universe. Dive in and
          explore the relationships, the adventures, and the moments that define
          each story.
        </p>
      </div>
    </div>
  );
};

export default Summary;

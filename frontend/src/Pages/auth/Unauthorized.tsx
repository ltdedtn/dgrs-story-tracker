import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center ">
      <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
      <p className="text-lg ">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;

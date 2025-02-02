import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <span className="loading loading-bars loading-md"></span>
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-xl"></span>
        <span className="loading loading-bars loading-2xl"></span>
        <span className="loading loading-bars loading-3xl"></span>
        <span className="loading loading-bars loading-4xl"></span>
      </div>
    </div>
  );
};

export default Loader;

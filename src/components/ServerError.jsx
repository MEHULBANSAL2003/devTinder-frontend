import React from "react";

const ServerError = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops! Something went wrong.</h1>
      <p className="text-gray-600 mb-2">
        We're having trouble connecting to the server. This could be due to a temporary issue.
      </p>
      <p className="text-gray-600 mb-6">
        Please try again after some time or contact support if the problem persists.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default ServerError;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "An unexpected error occurred.";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-lg text-gray-700 mb-6">{message}</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;

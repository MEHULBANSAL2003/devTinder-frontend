import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-base-100 to-base-300">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl font-bold text-white mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <img
        src="https://cdn.pixabay.com/photo/2018/01/04/15/51/404-error-3060993_640.png"
        alt="Error illustration"
        className="w-80 h-auto mb-8 rounded-lg shadow-lg"
      />
      <button
        onClick={handleBackToHome}
        className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all shadow-lg"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Error;

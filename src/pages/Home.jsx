import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/signup"); 
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-indigo-300">
      <h1 className="text-6xl font-extrabold text-gray-800">
        Dev<span className="text-indigo-600">Tinder</span>
      </h1>
      <p className="mb-6 mt-1 text-gray-800 text-xl font-serif">"Where developers connect, collaborate, and create the future together." </p>
      <button
        onClick={handleCreateAccount}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium px-8 py-3 rounded-full shadow-lg transition-all"
      >
        Create Account
      </button>
    </div>
  );
};

export default Home;

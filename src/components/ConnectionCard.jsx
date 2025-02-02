import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/Constants";


const ConnectionCard = ({ user, onActionComplete }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleViewProfile = () => {
    navigate(`/profile/${user?.user?._id}`);
  };

  const handleRemoveConnection = async () => {
    const url = `${BASE_URL}/request/remove/${
      user._id
    }`;

    const response = await axios({
      method: "post",
      url: url,
      withCredentials: true,
    });

    if (response.data.result == "success") {
      toast.success(response.data.message);
      onActionComplete(user._id);
    }

    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleOpenConfirmation = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="bg-base-300 rounded-lg shadow-lg p-6 flex flex-col items-center text-center text-white  relative">
      <img
        src={user?.user?.photoUrl}
        alt="user photo"
        className="w-24 h-24 rounded-full object-cover border-4 border-white"
      />
      <h2 className="text-2xl font-bold text-white">
        {user?.user?.firstName} {user?.user?.lastName}
      </h2>
       
      <p className="text-md font-semibold text-gray-200 mt-1 mb-4">{user?.user?.userName}</p>
      <div className="flex">
        <button
          onClick={handleViewProfile}
          className="bg-blue-500 hover:bg-blue-600 text-sm px-6 py-2 rounded-lg shadow-md"
        >
          View Profile
        </button>
        <button
          onClick={handleOpenConfirmation}
          className="bg-red-500 hover:bg-red-600 text-sm px-6 py-2 rounded-lg shadow-md mx-4"
        >
          Remove Connection
        </button>
      </div>

      {showConfirmation && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
            <h3 className="text-xl font-bold text-gray-800">
              Are you sure you want to remove this connection?
            </h3>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleRemoveConnection}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
              >
                Remove
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionCard;

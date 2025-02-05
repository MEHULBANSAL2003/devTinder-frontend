import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/Constants";


const UserFeedCard = ({ user, onActionComplete }) => {
  const [reqBtn, setReqBtn] = useState("Send Request");

  const handleSendRequest = async () => {
    const url = `${BASE_URL}/request/send/interested/${
      user._id
    }`;

    try {
      const response = await axios({
        method: "post",
        url: url,
        withCredentials: true,
      });

      if (response.data.result === "success") {
        toast.success(response.data.message);
        setReqBtn("Cancel Request");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleIgnore = async () => {
    const url = `${BASE_URL}/request/send/ignored/${
      user._id
    }`;

    try {
      const response = await axios({
        method: "post",
        url: url,
        withCredentials: true,
      });

      if (response.data.result === "success") {
        toast.success(response.data.message);
        onActionComplete(user._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleCancelRequest = async () => {
    const url = `${BASE_URL}/request/cancel/${
      user._id
    }`;

    try {
      const response = await axios({
        method: "post",
        url: url,
        withCredentials: true,
      });

      if (response.data.result == "success") {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (err) {}
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 my-3 border-gray-200 rounded-lg shadow-md p-5 flex flex-col sm:flex-row items-center sm:justify-between">
      
      {/* Profile Section */}
      <div className="flex items-center w-full sm:w-auto">
        <img
          src={user.photoUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-indigo-500"
        />
  
        <div className="ml-3 sm:ml-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-100">
            {`${user.firstName} ${user.lastName}`}
          </h2>
          <h3 className="text-gray-400 text-sm">{user.userName}</h3>
        </div>
      </div>
  
      {/* Buttons - Stack on mobile, inline on larger screens */}
      <div className="mt-3 sm:mt-0 flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
        {reqBtn === "Send Request" && (
          <>
            <button
              onClick={handleSendRequest}
              className="px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition w-1/2 sm:w-auto"
            >
              {reqBtn}
            </button>
            <button
              onClick={handleIgnore}
              className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition w-1/2 sm:w-auto"
            >
              Ignore
            </button>
          </>
        )}
  
        {reqBtn === "Cancel Request" && (
          <button
            onClick={handleCancelRequest}
            className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
          >
            {reqBtn}
          </button>
        )}
      </div>
    </div>
  );
  
  
};

export default UserFeedCard;

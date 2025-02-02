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
    <div className="max-w-sm w-full mx-auto bg-slate-800 my-3 border-gray-200 rounded-lg shadow-md p-5 flex flex-col items-center">
      <img
        src={user.photoUrl}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
      />

      <h2 className="mt-4 text-xl font-semibold text-gray-100">
        {`${user.firstName} ${user.lastName}`}
      </h2>
      <h2>{user.userName}</h2>

      <p className="mt-2 text-gray-400 text-center">{user.about}</p>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {user.skills.length > 0 ? (
          user.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-600 text-xs font-medium px-3 py-1 rounded-lg"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm"></span>
        )}
      </div>
      {reqBtn === "Send Request" && (
        <div className="flex gap-4 mt-5">
          <button
            onClick={handleSendRequest}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
          >
            {reqBtn}
          </button>
          {reqBtn === "Send Request" && (
            <button
              onClick={handleIgnore}
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
            >
              Ignore
            </button>
          )}
        </div>
      )}

      {reqBtn === "Cancel Request" && (
        <div className="flex gap-4 mt-5">
          <button
            onClick={handleCancelRequest}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
          >
            {reqBtn}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFeedCard;

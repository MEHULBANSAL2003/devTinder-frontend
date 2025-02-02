import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/Constants";


const RequestCard = ({ user, onActionComplete }) => {
  const { fromUserId, createdAt } = user;

  const navigate = useNavigate();

  const handleAccept = async () => {
    const reqId = user._id;
    const url = `${
      BASE_URL
    }/request/review/accepted/${reqId}`;

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
      toast.error(err?.response?.data?.message);
    }
  };

  const handleReject = async () => {
    const reqId = user._id;
    const url = `${
      BASE_URL
    }/request/review/rejected/${reqId}`;

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
      toast.error(err?.response?.data?.message);
    }
  };

  const handleViewProfile = async () => {
    navigate(`/profile/${fromUserId._id}`);
  };

  return (
    <div className="max-w-md mx-auto bg-base-300 border border-gray-200 rounded-lg shadow-md p-6 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={fromUserId.photoUrl}
            alt={`${fromUserId.firstName} ${fromUserId.lastName}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">
              {fromUserId.firstName} {fromUserId.lastName}
            </h3>
            <p className="text-sm text-gray-200 my-1">
              {`Requested ${formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
              })}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleViewProfile}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
        >
          View Profile
        </button>
      </div>
      <div className="mt-7 mx-20  flex">
        <button
          onClick={handleAccept}
          className="px-4 py-2 mx-3 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default RequestCard;

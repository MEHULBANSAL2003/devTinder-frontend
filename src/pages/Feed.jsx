import React, { useEffect, useState } from "react";
import UserFeedCard from "../components/UserFeedCard";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constants";


const Feed = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserFeedData = async () => {
    const url = `${BASE_URL}/user/feed`;
    try {
      const response = await axios({
        method: "get",
        url: url,
        withCredentials: true,
      });

      if (response.data.result === "success") {
        setUserData(response.data.data);
        setLoading(false);
      }
    } catch (err) {
      let errorMessage = "Something went wrong";

      if (err.response) {
        const status = err.response.status;

        if (status === 400) {
          errorMessage =
            err.response.data?.message ||
            "Invalid input. Please check your data.";
          toast.error(errorMessage);
        } else if (status === 500) {
          navigate("/error", {
            state: {
              message: "Our servers are down. Please try again later.",
            },
          });
        } else {
          errorMessage = `Error ${status}: ${
            err.response.data?.message || "An unexpected error occurred."
          }`;
          toast.error(errorMessage);
        }
      } else if (err.request) {
        navigate("/error", {
          state: {
            message:
              "Unable to connect to the server. Please check your internet connection.",
          },
        });
      } else {
        navigate("/error", {
          state: {
            message: "An unknown error occurred. Please try again later.",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFeedData();
  }, []);

  const handleExplorePosts=()=>{
    navigate("/posts");
  }

  const handleActionComplete = (userId) => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user._id !== userId)
    );
  };

  if (loading) return <Loader />;

  if (userData && userData?.length === 0) {
    return (
      <div>
      <div className="text-2xl md:text-4xl font-semibold mt-64 mx-[20%] md:mt-48 md:mx-[38%] text-white">That's all for now..!!</div>
      <button
          onClick={handleExplorePosts}
            className="bg-green-500 hover:bg-green-600 px-6 py-3  mt-6 mx-[28%] md:mx-[44%] rounded-lg text-white text-lg font-semibold shadow-lg"
          >
            Explore Posts
          </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-16 space-y-6">
      {userData &&
        userData.map((user) => (
          <div key={user._id} className="w-full flex justify-center">
            <UserFeedCard user={user} onActionComplete={handleActionComplete} />
          </div>
        ))}
    </div>
  );
  
};

export default Feed;

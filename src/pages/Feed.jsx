import React, { useEffect, useState,useRef } from "react";
import UserFeedCard from "../components/UserFeedCard";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constants";


const Feed = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredConnection, setFilteredConnection] = useState(null);
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  const handleKeyUpSearch=()=>{
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      const url = `${
        BASE_URL
      }/user/feed?search=${encodeURIComponent(searchText)}`;

      try {
        const response = await axios({
          method: "get",
          url: url,
          withCredentials: true,
        });
        console.log(response);

        if (response.data.result === "success") {
          setFilteredConnection(response.data.data);
        }
      } catch (err) {}
    }, 500);

  }

  const handleSearch = async () => {
    setLoading(true);
    const url = `${
      BASE_URL
    }/user/feed?search=${encodeURIComponent(searchText)}`;

    try {
      const response = await axios({
        method: "get",
        url: url,
        withCredentials: true,
      });

      if (response.data.result === "success") {
        setFilteredConnection(response.data.data);
        setLoading(false);
      }
    } catch (err) {
    
    }
    finally{
      setLoading(false);
    }
  };

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
        setFilteredConnection(response.data.data)
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
    setFilteredConnection((prevUserData) =>
      prevUserData.filter((user) => user._id !== userId)
    );
  };

  if (loading) return <Loader />;

  if (userData && userData?.length === 0) {
    return (
      <div className="flex flex-col items-center mt-32">
        <div className="text-2xl md:text-4xl font-semibold text-white text-center">
          That's all for now..!!
        </div>
        <button
          onClick={handleExplorePosts}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 mt-6 rounded-lg text-white text-lg font-semibold shadow-lg"
        >
          Explore Posts
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center mt-8 space-y-6">
    
      <div className="w-full px-4 sm:px-0 flex flex-col sm:flex-row justify-center items-center mb-4">
        <input
          type="text"
          placeholder="Search connections by name or username"
          className="w-full sm:w-3/4 lg:w-1/2 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3 sm:mb-0 sm:mr-4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyUp={handleKeyUpSearch}
        />
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          Search
        </button>
       
      </div>
      {filteredConnection && filteredConnection.length === 0 && (
            <h1 className="text-white text-2xl font-bold text-center mt-20 sm:mt-40 mx-4 sm:mx-16">
              No such user found..!!
            </h1>
          )}
      {filteredConnection &&
        filteredConnection.map((user) => (
          <div key={user._id} className="w-full max-w-md">
            <UserFeedCard user={user} onActionComplete={handleActionComplete} />
          </div>
        ))}
    </div>
  );
  
};

export default Feed;

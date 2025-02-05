import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import ConnectionCard from "../components/ConnectionCard";
import { BASE_URL } from "../utils/Constants";


const Connections = () => {
  const [connection, setConnection] = useState(null);
  const [filteredConnection, setFilteredConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const debounceTimeout = useRef(null);

  const handleMakeConnection = () => {
    navigate("/feed");
  };

  const handleKeyUpSearch = async () => {
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      const url = `${
        BASE_URL
      }/user/search?search=${encodeURIComponent(searchText)}`;

      try {
        const response = await axios({
          method: "get",
          url: url,
          withCredentials: true,
        });

        if (response.data.result === "success") {
          setFilteredConnection(response.data.data);
        }
      } catch (err) {}
    }, 500);
  };

  const handleSearch = async () => {
    setLoading(true);
    const url = `${
      BASE_URL
    }/user/search?search=${encodeURIComponent(searchText)}`;

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

  const getAllConnections = async () => {
    const url = `${BASE_URL}/user/connection`;
    try {
      const response = await axios({
        method: "get",
        url: url,
        withCredentials: true,
      });

      if (response.data.result === "success") {
        setConnection(response.data.data);
        setFilteredConnection(response.data.data);
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
    getAllConnections();
  }, []);

  const handleActionComplete = (userId) => {
    setFilteredConnection((prevUserData) =>
      prevUserData.filter((user) => user._id !== userId)
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-white mb-8">Your Connections</h1>

      {connection && connection.length === 0 ? (
        <div className="flex flex-col items-center text-white">
          <p className="text-lg mb-4">No connections found...!!</p>
          <button
            onClick={handleMakeConnection}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white text-lg font-semibold shadow-lg"
          >
            Let's Make Connections
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-6 w-full max-w-3xl">
          <div className="flex justify-center items-center mb-8">
            <input
              type="text"
              placeholder="Search connections by name or username"
              className="w-96 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-4"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyUp={handleKeyUpSearch} // Call debounced search on keyup
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-base-300 hover:bg-base-100 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Search
            </button>
          </div>
          {filteredConnection && filteredConnection.length === 0 && (
            <h1 className="text-white text-2xl font-bold text-center mt-20 sm:mt-40 mx-4 sm:mx-16">
              No such connection found..!!
            </h1>
          )}

          {filteredConnection?.map((user) => (
            <ConnectionCard
              key={user._id}
              user={user}
              onActionComplete={handleActionComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/Constants";


const ViewProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleViewProfile = async () => {
    const url = `${BASE_URL}/profile/view/${id}`;
 
    try {
      const response = await axios({
        method: "get",
        url: url,
        withCredentials: true,
      });
      console.log(response);

      if (response.data.result === "success") {
        setProfile(response.data.data);
        setError(null);
      } else {
        setError("User not found.");
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
    handleViewProfile();
  }, []);

  const handleImageClick = (post) => {
    navigate(`/posts/view/${post._id}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600">Error</h1>
          <p className="mt-4 text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  //console.log(profile);

  return (
    <div className=" justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-xl p-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={profile.photoUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-40 h-40 rounded-full object-cover border-4 border-indigo-300"
          />
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-500 text-lg">{profile.emailId}</p>
            <p className="mt-4 text-gray-700">{profile.about}</p>

            <div className="mt-4 flex gap-6 text-lg text-gray-600">
              <div>
                <p className="font-semibold">Age</p>
                <p>{profile.age || "Not available"}</p>
              </div>
              <div>
                <p className="font-semibold">Gender</p>
                <p>{profile.gender || "Not available"}</p>
              </div>
              <div>
                <p className="font-semibold">Posts</p>
                <p>{profile.posts.length}</p>
              </div>
              <div>
                <p className="font-semibold">Connections</p>
                <p>{profile.connections}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          {profile.skills.length > 0 && (
            <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
          )}
          {profile.skills.length > 0 ? (
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
              {profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4">No skills listed.</p>
          )}
        </div>
        <div className="mt-8 text-gray-500 text-sm">
          Member since: {new Date(profile.createdAt).toDateString()}
        </div>
      </div>
      <div className="mt-8">
        <div className="mb-4 flex justify-center text-2xl text-black font-bold">
          Posts
        </div>

        {profile && profile.posts.length > 0 && (
          <div className="md:mx-72 grid grid-cols-2 md:grid-cols-4 bg-gradient-to-r from-blue-100 to-indigo-200 p-4 rounded-lg shadow-lg">
            {profile.posts.map((post) => (
              <div
                key={post._id}
                className="relative md:w-60 hover:cursor-pointer"
                onClick={() => handleImageClick(post)}
              >
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-60 object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;

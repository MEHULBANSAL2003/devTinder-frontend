import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../redux/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosNotifications, IoIosAddCircle } from "react-icons/io";
import { IoLogIn, IoPeople } from "react-icons/io5";
import Loader from "./Loader";
import { BASE_URL } from "../utils/Constants";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    const url = `${BASE_URL}/logout`;
    try {
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.data.result === "success") {
        toast.success(response.data.message, {
          autoClose: 1000,
          position: "top-center",
        });

        dispatch(removeUser());
        sessionStorage.removeItem("user");

        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handlePost = async () => {
    const img = image;
    if (!img) {
      setErr("please select image to post");
    }
    setIsAddPostOpen(false);

    resetModal();
    try {
      setLoading(true);
      const filename = encodeURIComponent(img.name);
      const contentType = img.type;

      const response = await axios.post(
        `${BASE_URL}/generate-upload-url`,
        {
          filename,
          contentType,
        }
      );

      console.log(response);  

      if (response.data.result === "success") {
        const signedUrl = response.data.url;

        await axios.put(signedUrl, img, {
          headers: {
            "Content-Type": contentType,
          },
        });

        const updatedUrl = response.data.key;

        const url = `${BASE_URL}/post/create`;

        const resp = await axios({
          method: "post",
          url: url,
          data: {
            imageUrl: updatedUrl,
            content: caption,
          },
          withCredentials: true,
        });

        if (resp.data.result === "success") {
          toast.success(resp.data.message);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setImage(null);
    setPreview(null);
    setCaption("");
    setStep(1);
  };

  if (loading) return <Loader />;


  return (
    <div className="navbar bg-base-300 relative">
      <div className="flex-1">
        <Link to="/posts" className="btn btn-ghost text-xl">
          DevTinder
        </Link>
      </div>
      {!user && (
        <button onClick={handleLogin} className="mx-4">
          <IoLogIn size={40} />
        </button>
      )}
      {user && (
        <div className="flex-none gap-2">
          <div
            className="mx-1 cursor-pointer"
            onClick={() => setIsAddPostOpen(true)}
          >
            <IoIosAddCircle size={30} />
          </div>

          <Link to="/feed">
            <div className="mx-1 cursor-pointer">
              <IoPeople size={30} />
            </div>
          </Link>

          <Link to="/requests">
            <div className="mx-2 cursor-pointer">
              <IoIosNotifications size={30} />
            </div>
          </Link>
          <div className="form-control">Welcome, {user.firstName}</div>
          <div className="dropdown dropdown-end mx-3">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user profile" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/user/change-password"> Change Password</Link>
              </li>

              <li onClick={handleLogout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {isAddPostOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAddPostOpen(false);
                resetModal();
              }}
              className="absolute top-4 right-4 text-gray-500 text-2xl"
            >
              &times;
            </button>

            {/* Step 1: File Picker */}
            {step === 1 && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">Select an Image</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
                >
                  Choose Image
                </label>
              </div>
            )}

            {/* Step 2: Image Preview with Back/Next */}
            {step === 2 && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">
                  Preview Your Image
                </h2>
                {preview && (
                  <img
                    src={preview}
                    alt="Selected"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div className="flex justify-between w-full mt-4">
                  <button
                    onClick={() => {
                      document.getElementById("fileInput").click();
                      resetModal();
                    }}
                    className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Add Caption */}
            {step === 3 && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">Add a Caption</h2>
                {preview && (
                  <img
                    src={preview}
                    alt="Selected"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here..."
                  className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 mb-4"
                ></textarea>
                <div className="flex justify-between w-full">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePost}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Post
                  </button>
                  <button
                    onClick={() => {
                      setIsAddPostOpen(false);
                      resetModal();
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

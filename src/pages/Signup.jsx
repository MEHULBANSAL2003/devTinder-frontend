import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateSignUpData } from "../utils/validation";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BASE_URL } from "../utils/Constants";


const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subLoading,setSubLoading]=useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    setImage(file);
    setLoading(true);
    try {
      let filename = encodeURIComponent(file.name);
      const contentType = file.type;
      filename = filename.replace(/[^\w.]/g, "");

      const response = await axios.post(
        `${BASE_URL}/generate-upload-url`,
        {
          filename,
          contentType,
        }
      );

      if (response.data.result === "success") {
        const signedUrl = response.data.url;

        await axios.put(signedUrl, file, {
          headers: {
            "Content-Type": contentType,
          },
        });

        setImageUrl(response.data.key);
        toast.success("image uploaded successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
    }
    finally{
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    const message = validateSignUpData(
      firstName,
      lastName,
      username,
      emailId,
      password,
      age,
      gender
    );

    setError(message);

    if (message === null) {
      setSubLoading(true);
      const url = `${BASE_URL}/signup`;

      const data = {
        firstName: firstName,
        lastName: lastName,
        userName: username,
        age: age,
        gender: gender,
        emailId: emailId,
        password: password,
      };
        
      if (imageUrl) {
        data.imageUrl = imageUrl;
      }

      try {
        const response = await axios({
          method: "post",
          url: url,
          data: data,
          withCredentials: true,
        });

        if (response.data.result == "success") {
          toast.success(response.data.message);
          dispatch(addUser(response.data.data));

          navigate("/feed");
        }
      } 
      catch (err) {
      
        let errorMessage = "Something went wrong";
        
      
        if (err.response) {
          const status = err.response.status;
      
          if (status === 400) {
            errorMessage = err.response.data?.message || "Invalid input. Please check your data.";
            toast.error(errorMessage);
          } else if (status === 500) {

            navigate("/error", { state: { message: "Our servers are down. Please try again later." } });
          } else {
            errorMessage = `Error ${status}: ${err.response.data?.message || "An unexpected error occurred."}`;
            toast.error(errorMessage);
          }
        } else if (err.request) {

          navigate("/error", { state: { message: "Unable to connect to the server. Please check your internet connection." } });
        } else {
          navigate("/error", { state: { message: "An unknown error occurred. Please try again later." } });
        }

        if (err.response?.status === 400) {
           
        }
      }
      finally{
         setSubLoading(false);
         setFirstName("");
        setLastName("");
        setEmailId("");
        setPassword("");
        setAge("");
        setUsername("");
      }
      
    }
  };

  const togglePasswordVisibility = () => {
    if (password.current) {
      password.current.type =
        password.current.type === "password" ? "text" : "password";
    }
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center my-8">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-4xl justify-center font-bold text-white">
            DevTinder
          </h2>
          <h2 className="w-60 mx-12 font-semibold">
            Signup to meet developers and
          </h2>
          <h2 className="w-60 mx-24 -my-2">connect with them.</h2>

          <div>
            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                type="text"
                placeholder="enter your first name"
                className="input input-bordered w-full max-w-xs"
                value={firstName}
                onChange={(e) => {
                  setError(null);
                  setFirstName(e.target.value);
                }}
              />
              <div className="text-red-600 mt-1 text-md">
                {error && error.startsWith("First") && <p>{error}</p>}
              </div>
            </label>
            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Last name</span>
              </div>
              <input
                type="text"
                placeholder="enter your last name"
                className="input input-bordered w-full max-w-xs"
                value={lastName}
                onChange={(e) => {
                  setError(null);
                  setLastName(e.target.value);
                }}
              />
              <div className="text-red-600 mt-1 text-md">
                {error && error.startsWith("Last") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                placeholder="enter your username name"
                className="input input-bordered w-full max-w-xs"
                value={username}
                onChange={(e) => {
                  setError(null);
                  setUsername(e.target.value);
                }}
              />
              <div className="text-red-600 mt-1 text-md">
                {error && error.startsWith("User") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Profile Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={handleImageChange}
              />
              
              {loading && (
              <div className="flex items-center mt-2 text-blue-500">
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Uploading...
              </div>
            )}

              {image&&!loading && (
                <div className="text-green-500 mt-2 text-sm">
                  Selected: {image.name}
                </div>
              )}

              <div className="text-red-600 mt-1">
                {error && error.startsWith("Image") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Age</span>
              </div>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                className="input input-bordered w-full max-w-xs"
                value={age}
                onChange={(e) => {
                  setError(null);
                  setAge(e.target.value);
                }}
              />
              <div className="text-red-600 mt-1">
                {error && error.startsWith("Age") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Gender</span>
              </div>
              <select
                name="gender"
                className="select select-bordered w-full max-w-xs"
                value={gender}
                onChange={(e) => {
                  setError(null);
                  setGender(e.target.value);
                }}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div className="text-red-600 mt-1">
                {error && error.startsWith("Gender") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="text"
                placeholder="enter your email"
                className="input input-bordered w-full max-w-xs"
                value={emailId}
                onChange={(e) => {
                  setError(null);
                  setEmailId(e.target.value);
                }}
              />
              <div className="text-red-600 mt-1 text-md">
                {error && error.startsWith("Email") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs relative">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="enter your password"
                className="input input-bordered w-full max-w-xs"
                value={password}
                onChange={(e) => {
                  setError(null);
                  setPassword(e.target.value);
                }}
              />
              <button
                onClick={togglePasswordVisibility}
                className="absolute top-[65%] right-3 transform -translate-y-1/2 bg-transparent text-white hover:text-slate-100"
                type="button"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>

              <div className="text-red-600 mt-1 text-md">
                {error && error.startsWith("Password") && <p>{error}</p>}
              </div>
            </label>
          </div>
          <div className="card-actions justify-center mt-6">
            <button className="btn btn-primary" onClick={handleSignup}>
             {subLoading?"Signing up":"Signup"}
            </button>
          </div>
          <div className="font-semibold mt-4 flex justify-center">
            <p className="mx-8">
              Already have an account?
              <Link to="/login" className="text-slate-200 mx-2">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

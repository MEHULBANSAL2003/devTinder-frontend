import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateProfileEditData } from "../utils/validation";
import { addUser } from "../redux/userSlice";
import Loader from "../components/Loader";
import { BASE_URL } from "../utils/Constants";


const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    about: user?.about,
    gender: user?.gender,
    skills: user?.skills,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeProfile = async () => {
    const message = validateProfileEditData(
      formData.firstName,
      formData.lastName,
      formData.age,
      formData.about
    );
    setError(message);

    if (message === null) {
      setLoading(true);

      let skill = formData.skills;

      skill = Array.isArray(skill) ? skill.join(", ") : skill;
      const skillsArray = skill
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      try {
        const url = `${BASE_URL}/profile/edit`;
        const response = await axios.patch(
          url,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            age: formData.age,
            about: formData.about,
            gender: formData.gender,
            skills: skillsArray,
          },

          { withCredentials: true }
        );

        if (response.data.result == "success") {
          toast.success(response.data.message);
          dispatch(addUser(response.data.data));
          sessionStorage.removeItem("user");
          navigate("/profile");
        }
      } catch (err) {
        toast.error(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center my-8">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center font-bold">
            Edit Profile
          </h2>

          <div>
            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                className="input input-bordered w-full max-w-xs"
                value={formData.firstName}
                onChange={handleChange}
              />
              <div className="text-red-600 mt-1">
                {error && error.startsWith("First") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                className="input input-bordered w-full max-w-xs"
                value={formData.lastName}
                onChange={handleChange}
              />
              <div className="text-red-600 mt-1">
                {error && error.startsWith("Last") && <p>{error}</p>}
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
                value={formData.age}
                onChange={handleChange}
              />
              <div className="text-red-600 mt-1">
                {error && error.startsWith("Age") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">About</span>
              </div>
              <textarea
                name="about"
                placeholder="Tell us about yourself"
                className="textarea textarea-bordered w-full max-w-xs"
                value={formData.about}
                onChange={handleChange}
              ></textarea>
              <div className="text-red-600 mt-1">
                {error && error.startsWith("Please") && <p>{error}</p>}
              </div>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Gender</span>
              </div>
              <select
                name="gender"
                className="select select-bordered w-full max-w-xs"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Skills</span>
              </div>
              <input
                type="text"
                name="skills"
                placeholder="Enter your skills (comma-separated)"
                className="input input-bordered w-full max-w-xs"
                value={formData.skills}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="card-actions justify-center mt-6">
            <button className="btn btn-primary" onClick={handleChangeProfile}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

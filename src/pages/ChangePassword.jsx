import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { validateChangePasswordData } from "../utils/validation";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constants";


const ChangePassword = () => {
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    reNewPassword: false,
  });

  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [currPass, setCurrPass] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();
  

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const clearError = () => {
    setError(null);
  };
  const handleChangePassword = async () => {
    try {
      const message = validateChangePasswordData(currPass, newPass, rePass);
      setError(message);

      if (message === null) {
        setLoading(true);
        const url = `${BASE_URL}/user/change-password`;

        const response = await axios({
          method: "post",
          url: url,
          data: {
            currPass: currPass,
            newPass: newPass,
          },
          withCredentials: true,
        });

        if (response.data.result === "success") {
          toast.success(response.data.message,{autoClose:1000});
          navigate("/profile");
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-8">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center font-bold">
            Change Password
          </h2>

          <div>
            {/* Old Password */}
            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">Curr Password</span>
              </div>
              <div className="relative">
                <input
                  type={showPasswords.oldPassword ? "text" : "password"}
                  placeholder="Enter your curr password"
                  className="input input-bordered w-full max-w-xs"
                  value={currPass}
                  onChange={(e) => {
                    clearError();
                    setCurrPass(e.target.value);
                  }}
                />
                <button
                  onClick={() => togglePasswordVisibility("oldPassword")}
                  className="absolute top-[40%] right-3 transform -translate-y-1/2 bg-transparent text-white hover:text-slate-100"
                  type="button"
                >
                  {showPasswords.oldPassword ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </button>
                <div className="text-red-600 text-sm mt-1">
                  {error && error.startsWith("Current") && <p>{error}</p>}
                </div>
              </div>
            </label>

            {/* New Password */}
            <label className="form-control w-full max-w-xs mb-5">
              <div className="label">
                <span className="label-text">New Password</span>
              </div>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="input input-bordered w-full max-w-xs"
                  value={newPass}
                  onChange={(e) => {
                    clearError();
                    setNewPass(e.target.value);
                  }}
                />
                <button
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute top-[40%] right-3 transform -translate-y-1/2 bg-transparent text-white hover:text-slate-100"
                  type="button"
                >
                  {showPasswords.newPassword ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </button>
                <div className="text-red-600 mt-1">
                  {error && error.startsWith("New") && <p>{error}</p>}
                </div>
              </div>
            </label>

            {/* Re-enter New Password */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Re-enter New Password</span>
              </div>
              <div className="relative">
                <input
                  type={showPasswords.reNewPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  className="input input-bordered w-full max-w-xs"
                  value={rePass}
                  onChange={(e) => {
                    setRePass(e.target.value);
                    clearError();
                  }}
                />
                <button
                  onClick={() => togglePasswordVisibility("reNewPassword")}
                  className="absolute top-[40%] right-3 transform -translate-y-1/2 bg-transparent text-white hover:text-slate-100"
                  type="button"
                >
                  {showPasswords.reNewPassword ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </button>
                <div className="text-red-600 mt-1">
                  {error && error.startsWith("Re-enter") && <p>{error}</p>}
                </div>
              </div>
            </label>
          </div>

          <div className="card-actions justify-center mt-6">
            <button onClick={handleChangePassword} className="btn btn-primary">
              {loading?"Changing password":"Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

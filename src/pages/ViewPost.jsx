import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import PostCard from "../components/PostCard";
import { BASE_URL } from "../utils/Constants";


const ViewPost = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState(null);
  const [err, setErr] = useState(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}/post/${params.id}`;
      const response = await axios({
        method: "get",
        url: url,
        withCredentials: true,
      });

      if (response.data.result === "success") {
        setPostData(response.data.data[0]);
      }
    } catch (err) {
      setErr(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  console.log(postData);

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      {postData && <PostCard post={postData} closeButton deleteOption />}
      {err && <div className="text-xl text-red-600">{err}</div>}
    </div>
  );
};

export default ViewPost;

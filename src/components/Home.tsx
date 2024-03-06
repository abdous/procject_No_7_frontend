// @ts-nocheck
import React, { ReactElement, useEffect, useState } from "react";
import AllPosts from "./Post/AllPosts";
import axios from "axios";

export default function Home(): ReactElement {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [file, setFile] = useState();
  const retrievedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [allPosts, setAllPosts] = useState([
    {
      description: "",
      userId: "",
      imageUrl: "",
    },
  ]);
  const [post, setPost] = useState({
    description: "",
  });

  useEffect(() => {
    const getAllPosts = async () => {
      await axios
        .get(`http://localhost:8080/api/posts/getAllPost`)
        .then((response) => {
          return setAllPosts(response.data);
        })
        .catch(function (error) {
          console.log({ message: error });
        });
    };
    getAllPosts();
  }, [retrievedUser.token]);

  if (!retrievedUser.token && !retrievedUser.id) {
    return null;
  }

  const handleChange = (event: any) => {
    setPost({
      ...post,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let bodyFormData = new FormData();
    bodyFormData.append("description", post.description);
    bodyFormData.append("userId", retrievedUser.id);
    bodyFormData.append("username", retrievedUser.username);
    bodyFormData.append("image", file);

    await axios
      .post("http://localhost:8080/api/posts/addPost", bodyFormData, {
        headers: {
          Authorization: `Basic ${retrievedUser.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log({ message: error });
      });
    window.location.href = "/";
  };

  const onFileAdded = (e) => {
    e.preventDefault();
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  return (
    <div className="flex flex-col p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border border-gray-500 rounded-lg shadow-2xl p-6 relative shadow-[0_0_20px_2px_rgba(0, 0, 0, 0.4)] w-fill md:w-1/2 md:left-[50%] md:-translate-x-1/2"
      >
        <h1>Username: {retrievedUser.username}</h1>
        <textarea
          name="description"
          value={post.description}
          onChange={handleChange}
          placeholder="Add post"
          required
          className="border-b border-gray-700 text-[0.85rem] py-[0.25rem] w-full [&:focus]:border-sky-950 [&:focus]:outline-none italic my-6"
        />
        <div>
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              className="border-none rounded-[0.25rem] font-bold py-3 px-4 bloc no-underline text-xs [&:focus]:no-underline [&:hover]:outline-none [&:hover]:cursor-pointer bg-sky-900 hover:bg-blue-700 text-white w-[40%] md:w-1/4 self-center"
              onClick={() => imageUploader.current.click()}
            >
              Upload image
            </button>
            <input
              filename={file}
              type="file"
              accept="image/*"
              onChange={onFileAdded}
              ref={imageUploader}
              className=" hidden"
            />
            <button
              type="submit"
              className="border-none rounded-[0.25rem] font-bold py-3 px-4 bloc no-underline text-xs [&:focus]:no-underline [&:hover]:outline-none [&:hover]:cursor-pointer bg-sky-900 hover:bg-blue-700 text-white w-[40%] md:w-1/4 self-center"
            >
              Add Post
            </button>
          </div>
          <img alt="" ref={uploadedImage} className="mb-6 w-[60px]" />
        </div>
      </form>

      {allPosts.length >0 ? (
        <div className="p-6 relative w-full mt-3 md:mt-6 md:w-1/2 md:left-[50%] md:-translate-x-1/2  flex flex-col border border-gray-500 rounded-lg shadow-2xl">
          <AllPosts posts={allPosts} />
        </div>
      ) : null}
    </div>
  );
}

// @ts-nocheck
import React, { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import classNames from "classnames";
import axios from "axios";

export default function Post(): ReactElement {
  const [showComments, setShowComments] = useState(false);
  const [post, setPost] = useState({
    description: "",
    userId: "",
    postId: "",
    imageUrl: "",
    username: "",
  });
  const [postedComment, setPostedComment] = useState({
    description: "",
    userId: "",
    postId: "",
  });
  const [allcomments, setAllComments] = useState([
    {
      description: "",
      userId: "",
      postId: "",
    },
  ]);
  const search = useLocation().search;
  const postId = new URLSearchParams(search).get("postId");
  const retrievedUser = JSON.parse(localStorage.getItem("user")) || {};
  useEffect(() => {
    const getPostById = async () => {
      await axios
        .get(`http://localhost:8080/api/posts/${postId}`, {
          headers: {
            Authorization: `Basic ${retrievedUser.token}`,
          },
        })
        .then((response) => {
          return setPost(response.data);
        })
        .catch(function (error) {
          console.log({ message: error });
        });
    };
    getPostById();
  }, [postId, retrievedUser.token]);

  useEffect(() => {
    const getComments = async () => {
      await axios
        .get(`http://localhost:8080/api/comments/getAllComment/${postId}`, {
          headers: {
            Authorization: `Basic ${retrievedUser.token}`,
          },
        })
        .then((response) => {
          return setAllComments(response.data);
        })
        .catch(function (error) {
          console.log({ message: error });
        });
    };
    getComments();
  }, [postId, retrievedUser.token]);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPostedComment({
      ...postedComment,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const contentInfo = {
      description: postedComment.description,
      userId: post.userId,
      postId: postId,
    };

    await axios
      .post(
        `http://localhost:8080/api/comments/addComment/${postId}`,
        contentInfo,
        {
          headers: {
            Authorization: `Basic ${retrievedUser.token}`,
          },
        }
      )
      .then((response) => {
        return setPostedComment(response.data);
      })
      .catch(function (error) {
        console.log({ message: error });
      });
    window.location.reload();
  };

  const inputClasses = classNames(
    ` border-b border-gray-700 text-[0.85rem] py-[0.25rem] w-[99%] [&:focus]:border-sky-950 [&:focus]:outline-none text-black`
  );
  const buttonClasses = classNames(
    `border-none rounded-[0.25rem] font-bold py-3 px-4 bloc no-underline text-xs [&:focus]:no-underline [&:hover]:outline-none [&:hover]:cursor-pointer`
  );

  return (
    <div className="p-6  relative w-full md:left-[50%] md:-translate-x-1/2 md:translate-y-[20%] md:w-1/2">
      <div className="max-w-[37.5rem] text-white bg-sky-900 rounded-[0.875rem] py-6 px-4">
        <h2 className="mb-3 flex flex-col">
          <p className="italic text-2xl self-center font-bold">
            Hey I am {post.username}
          </p>
          <p className="text-sm md:text-xl">
            Would you like to join the Discussion about my post!
          </p>
          <p className="font-bold">{post.description}</p>
        </h2>
        <form
          className=" bg-[#fff] rounded-[0.25rem] mb-[2rem] p-[1rem]"
          onSubmit={handleSubmit}
        >
          <div className="mb-[0.25rem]">
            <input
              placeholder="Comment"
              required
              className={`${inputClasses} italic`}
              name="description"
              value={postedComment.description}
              onChange={handleChange}
            />
          </div>
          <div className="comment-form-actions">
            <button
              type="submit"
              className={`${buttonClasses} bg-black hover:bg-gray-500`}
            >
              Add Comment
            </button>
          </div>
        </form>
        <button
          id="comment-reveal"
          className={`bg-black hover:bg-gray-500 text-white float-right ${buttonClasses}`}
          onClick={() => setShowComments(!showComments)}
        >
          Show Comments
        </button>
        <h3 className=" border-gray-700">Comments</h3>
        <h4 className="text-white border-b border-blue-950 mb-4">
          {allcomments.length} comments
        </h4>
        {showComments &&
          allcomments.map((comment) => {
            const handleDelete = async (e) => {
              e.preventDefault();
              axios
                .delete(`http://localhost:8080/api/comments/${comment.id}`, {
                  headers: {
                    Authorization: `Basic ${retrievedUser.token}`,
                  },
                })
                .then(async (response) => {
                  return response.status;
                })
                .catch(function (error) {
                  console.log({ message: error });
                });
              window.location.reload();
            };
            return (
              <ul>
                <li className="flex items-center justify-between mb-1">
                  <p className="line-clamp-1 md:line-clamp-3">
                    {comment.description}
                  </p>
                  {retrievedUser.id === Number(comment.userId) && (
                    <button
                      onClick={handleDelete}
                      type="button"
                      className="border-none rounded-[0.25rem] font-bold py-3 px-4 bloc no-underline text-xs [&:focus]:no-underline [&:hover]:outline-none [&:hover]:cursor-pointer bg-red-800 hover:bg-red-600 text-white w-[20%] md:w-1/4 self-end"
                    >
                      Delete!
                    </button>
                  )}
                </li>
              </ul>
            );
          })}
      </div>
    </div>
  );
}

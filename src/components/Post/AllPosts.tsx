// @ts-nocheck

import axios from "axios";
import React, { ReactElement } from "react";
import orderBy from "lodash/orderBy";

type Post = {
  description: string;
  userId: string;
  id: string;
  imageUrl: string;
  username: string;
};
export default function AllPosts({ posts }: { posts: Post[] }): ReactElement {
  const retrievedUser = JSON.parse(localStorage.getItem("user")) || {};

  function capitalizeFirstLetter(str: string) {
    return str && str.charAt(0).toUpperCase() + str.slice(1);
  }

  const orderedPosts = orderBy(posts, "createdAt", "desc");

  return (
    <div className="">
      {orderedPosts.map((post, index) => {
        const handleDelete = async (e) => {
          e.preventDefault();

          axios
            .delete(`http://localhost:8080/api/posts/${post.id}`, {
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
          <ul className="w-full">
            <li className="flex flex-col">
              <h2 className="font-bold italic">
                {capitalizeFirstLetter(post?.username)}
              </h2>
              <div className=" flex items-center justify-between my-4">
                <a href={`/post?postId=${post.id}`}>{post.description}</a>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.description}
                    className="w-[70px]"
                  />
                )}
              </div>
              {retrievedUser.username === post.username && (
                <button
                  type="button"
                  className="border-none rounded-[0.25rem] font-bold py-3 px-4 bloc no-underline text-xs [&:focus]:no-underline [&:hover]:outline-none [&:hover]:cursor-pointer bg-red-800 hover:bg-red-600 text-white w-[40%] md:w-1/4 self-end"
                  onClick={handleDelete}
                >
                  Delete Post
                </button>
              )}
              {posts.length - 1 !== index && (
                <div className=" border-b border-lime-900 my-2" />
              )}
            </li>
          </ul>
        );
      })}
    </div>
  );
}

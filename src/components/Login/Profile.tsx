// @ts-nocheck
import axios from "axios";
import React, { ReactElement } from "react";

export default function Profile(): ReactElement {
  const retrievedUser = JSON.parse(localStorage.getItem("user")) || {};
  const isUserLoggedIn = retrievedUser.isAuth;

  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await axios
      .get("http://localhost:8080/api/users/logout", {
        headers: {
          Authorization: `Basic ${retrievedUser.token}`,
        },
      })
      .then(async (response) => {
        if (isUserLoggedIn && response.status === 200) {
          return localStorage.removeItem("user");
        }
      })
      .catch(function (error) {
        console.log({ message: error });
      });

    window.location.href = "/";
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    console.log("event", e);
    axios
      .delete(`http://localhost:8080/api/users/${retrievedUser.id}`, {
        headers: {
          Authorization: `Basic ${retrievedUser.token}`,
        },
      })
      .then(async (response) => {
        if (isUserLoggedIn && response.status === 200) {
          return localStorage.removeItem("user");
        }
      })
      .catch(function (error) {
        console.log({ message: error });
      });
    // window.location.reload();
  };

  return (
    <div className="flex flex-col p-6 md:flex md:flex-row md:justify-end">
      {isUserLoggedIn && (
        <>
          <button
            className="flex w-full md:mb-0 mb-6 md:mr-6 mr-0 md:w-[20%] self-end items-center justify-center bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="flex w-full md:w-[20%] self-end items-center justify-center bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </>
      )}
    </div>
  );
}

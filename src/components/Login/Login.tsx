import axios from "axios";
import React, { ReactElement, useState } from "react";
import { Link } from "react-router-dom";

export default function Login(): ReactElement {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const url = "http://localhost:8080/api/users/login";

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const user = {
      email: userData.email,
      password: userData.password,
    };

    await axios
      .post(url, user)
      .then(async (response) => {
        return localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            token: response.data.token,
            username: response.data.username,
            isAuth: response.data.isAuth,
          })
        );
      })
      .catch(function (error) {
        console.log({ message: error });
      });

    window.location.href = "/";
  };
  return (
    <div className="w-full p-6 md:w-1/2 md:left-[50%] md:-translate-x-1/2 md:translate-y-[20%] shadow-[0_0_20px_2px_rgba(0, 0, 0, 0.4)] relative">
      <div className="flex items-center justify-center">
        <h1 className=" text-lg text-black font-bold">Login</h1>
      </div>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col text-justify border border-gray-500"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={"email"}
          >
            Email
          </label>
          <input
            className="shadow-2xl appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder={"email"}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={"password"}
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder={"password"}
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="flex flex-col items-center justify-center mt-6">
          <p className=" font-bold">No Account</p>
          <Link className=" list-none text-violet-800" to="/signup">
            <li>Register!!!</li>
          </Link>
        </div>
      </form>
    </div>
  );
}

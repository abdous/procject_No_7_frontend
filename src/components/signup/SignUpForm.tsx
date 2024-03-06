import React, { ReactElement, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export type User = {
  email: string;
  password: string;
  username: string;
};

const SignUpForm = (): ReactElement => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const url = "http://localhost:8080/api/users/signup";

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
      username: userData.username,
    };

    await axios
      .post(url, user)
      .then((response) => {
        console.log("response.status", response.status);
        console.log("response.data", response.data);
        return response.data;
      })
      .catch(function (error) {
        console.log({ message: error });
      });
    window.location.href = "/login";
  };

  return (
    <div className="w-full p-6 md:w-1/2 md:left-[50%] relative md:-translate-x-1/2 md:translate-y-[20%] shadow-[0_0_20px_2px_rgba(0, 0, 0, 0.4)]">
      <div className=" text-lg text-black font-bold flex items-center justify-center">
        <h1>Registration</h1>
      </div>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col text-justify border border-gray-500"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={"username"}
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type={"text"}
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder={"username"}
          />
        </div>
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
            Register
          </button>
        </div>
        <div className="flex flex-col items-center justify-center mt-6">
          <p className=" font-bold">If Account exist then</p>
          <Link className=" list-none text-violet-800" to="/login">
            <li>Login!!!</li>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default SignUpForm;

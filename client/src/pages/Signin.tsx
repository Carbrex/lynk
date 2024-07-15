import React, { useState } from "react";
import { SignInType } from "../types";
import { signIn } from "../store/userSlice";
import { useAppDispatch } from "../hooks";
import { Link } from "react-router-dom";

function Signin() {
  const dispatch = useAppDispatch();
  const [signInValues, setSignInValues] = useState<SignInType>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signIn(signInValues));
  };

  return (
    <section className="bg-white dark:bg-gray-900 min-h-section">
      <div className="container flex items-center justify-center px-6 mx-auto min-h-section">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          {/* <img
            className="w-auto h-7 sm:h-8"
            src="https://merakiui.com/images/logo.svg"
            alt=""
          /> */}

          <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">
            sign in
          </h1>

          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>

            <input
              type="email"
              name="email"
              onChange={(e) => {
                setSignInValues({ ...signInValues, email: e.target.value });
              }}
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Email address"
            />
          </div>

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={(e) => {
                setSignInValues({ ...signInValues, password: e.target.value });
              }}
              className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="showPassword"
              className=" text-blue-500 rounded focus:ring-blue-400"
              onClick={() => setShowPassword(!showPassword)}
            />
            <label
              htmlFor="showPassword"
              className="block ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Show password
            </label>
          </div>
          {/* forgot password */}

          {/* <a
            href="#"
            className="text-sm text-blue-500 hover:underline dark:text-blue-400"
          >
            Forgot your password?
          </a> */}

          <div className="mt-6">
            <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Sign in
            </button>

            <div className="mt-2 text-center ">
              <Link
                to="/signup"
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Don't have an account yet? Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Signin;

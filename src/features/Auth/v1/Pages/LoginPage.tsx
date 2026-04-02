import React from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link } from "react-router";

const LoginPage = () => {
  return (
    <div className="w-screen h-screen  flex ">
      <div className="left w-1/2 bg-cover bg-center relative">
        <div className="Logo_Container absolute top-0 left-0 w-full z-50 flex items-center ">
          <img src="/logoWithoutText.png" alt="Logo" className="w-16 h-16 " />

          <h1 className="text-2xl text-white ml-2 font-bold inter">CommDesk</h1>
        </div>
        <img
          src="https://img.freepik.com/premium-photo/boy-with-glasses-is-sitting-front-laptop_488478-333.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Login Icon"
          className="w-full h-full mx-auto  object-cover absolute"
        />
      </div>
      <div className="right w-1/2 flex items-center justify-center">
        <div className="w-[80%]">
          <h2 className="text-3xl  mb-2 inter text-gray-700">Sign in</h2>
          <p className="text-gray-500 mb-6 inter">Please login to your account to continue.</p>
          <form className="space-y-4 mt-[7vh]">
            <div className="flex flex-col gap-2 text-md">
              <label
                htmlFor="email"
                className="block text-gray-700 inter text-md flex items-center"
              >
                <MdEmail className="inline mr-2" /> Work Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="block text-gray-700 inter text-md flex items-center"
              >
                <div className="">
                  <RiLockPasswordFill className="inline mr-2" /> Password
                </div>

                <Link to="/signup" className="text-sm text-blue-500 hover:underline ml-auto">
                  Reset Password?
                </Link>
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4f46e5] text-white py-2  hover:bg-blue-600 transition duration-200 inter py-[1.5vh] text-lg"
            >
              <Link to="/org/dashboard" className="w-full h-full block">
                Sign In
              </Link>
            </button>

            <div className="flex justify-end">
              <Link
                to="/signup"
                className="text-sm text-sm text-gray-500 inter hover:underline ml-1"
              >
                Don't have an account?{" "}
                <span className="text-blue-500 hover:underline">Sign Up Here!</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

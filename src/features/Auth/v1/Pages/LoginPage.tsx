import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";
import Input from "@/Component/ui/Input";
import { useCallback, useState } from "react";

const LoginPage = () => {
  const { loginMutation } = useAuth();

  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validateFields = useCallback((email: string, password: string): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setServerError(null);

      const formData = new FormData(e.currentTarget);

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!validateFields(email, password)) {
        return;
      }

      try {
        const response = await loginMutation.mutateAsync({
          email,
          password,
        });

        console.log("Login successful: come from login page --->", response);

        const Role = response.data.FindUser.role;

        if (Role === "organization") {
          navigate("/org/dashboard");
          return;
        }

        if (Role === "member") {
          navigate("/member/dashboard");
          return;
        }

        navigate("/");
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials and try again.";
        setServerError(message);
      }
    },
    [loginMutation, navigate, validateFields],
  );

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
          <form className="space-y-4 mt-[7vh]" onSubmit={handleLogin} noValidate>
            {serverError && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm inter">
                {serverError}
              </div>
            )}
            <div className="flex flex-col gap-2 text-md">
              <label
                htmlFor="email"
                className="block text-gray-700 inter text-md flex items-center"
              >
                <MdEmail className="inline mr-2" /> Work Email
              </label>
              <Input
                name="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                type="email"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs inter">{fieldErrors.email}</p>
              )}
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

              <Input
                name="password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                type="password"
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-xs inter">{fieldErrors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#4f46e5] text-white py-2  hover:bg-blue-600 transition duration-200 inter py-[1.5vh] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
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

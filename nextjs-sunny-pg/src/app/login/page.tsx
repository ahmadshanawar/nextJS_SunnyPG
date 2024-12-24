"use client";
import useUserStore from "@/lib/store/userStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiUser } from "react-icons/hi"; // User icon from react-icons
import { FaSpinner } from "react-icons/fa"; // Spinner icon from react-icons

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUserId } = useUserStore();

  async function signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return error;
      if (data) return data;
    } catch (error) {
      return error;
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Please fill in all fields");
    } else {
      setError("");
      setIsLoading(true);
      const res: any = await signInWithEmail(email, password);
      setIsLoading(false);
      if (res?.user) {
        localStorage.setItem("supabaseSession", JSON.stringify(res?.session));
        setUserId(res?.user?.id);
        router.push("/dashboard");
        if (error) console.log(error);
      } else {
        setError("Invalid Username or Password");
      }
    }
  };

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    if (forgotPasswordEmail === "") {
      setForgotPasswordError("Please enter your email address");
    } else {
      setForgotPasswordError("");
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotPasswordEmail,
        {
          redirectTo: "http://localhost:3000/login/reset-password",
        }
      );
      if (error) {
        setForgotPasswordError("Error sending password reset email");
      } else {
        setForgotPasswordSuccess("Password reset email sent successfully");
      }
    }
  };

  return (
    <div className="flex mt-2">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-2">
          <HiUser className="text-purple-800 text-7xl" />
        </div>
        {error && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 bg-gray-100 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-800 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin inline mr-2" /> : null}
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-purple-800 text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm">Don't have an account? </span>
          <Link
            href="/signup"
            className="text-purple-800 text-sm font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>

      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Forgot Password
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Enter your email address and we will send you a link to reset your
                password.
              </p>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="mt-4">
                <label
                  htmlFor="forgotPasswordEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  name="forgotPasswordEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
                />
              </div>
              {forgotPasswordError && (
                <div className="mt-2 text-sm text-red-600">
                  {forgotPasswordError}
                </div>
              )}
              {forgotPasswordSuccess && (
                <div className="mt-2 text-sm text-green-600">
                  {forgotPasswordSuccess}
                </div>
              )}
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-800 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-gray-500 text-sm hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

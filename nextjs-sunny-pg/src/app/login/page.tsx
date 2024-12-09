"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiUser } from "react-icons/hi"; // User icon from react-icons

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return error;
      if (data) {
        console.log("loggged in:", data);
        return data;
      }
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
      const res: any = await signInWithEmail(email, password);
      if (res?.user) {
        let { data: tennants, error }: { data: any; error: any } =
          await supabase
            .from("Tennants")
            .select("role")
            .eq("uid", res?.user?.id);
        if (tennants)
          tennants[0]?.role === "admin"
            ? router.push("admin-dashboard")
            : router.push("user-dashboard");
        if (error) console.log(error);        
      } else {
        setError("Invalid Username or Password");
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
              id="email"
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
              id="password"
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
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-purple-800 text-sm hover:underline">
            Forgot Password?
          </a>
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
    </div>
  );
}

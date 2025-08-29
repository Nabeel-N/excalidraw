"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui/Input"; // Assuming this is a styled input component
import { HTTP_BACKEND } from "@/config";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  // 1. Add state for all form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 2. Create the function to handle form submission
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const url = isSignin ? `${HTTP_BACKEND}/signin` : `${HTTP_BACKEND}/signup`;
    const body = isSignin
      ? JSON.stringify({ username: email, password })
      : JSON.stringify({ name, username: email, password });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });

    if (response.ok) {
      if (isSignin) {
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
        // Redirect to a default drawing room after login
        router.push("/Canvas/general"); // Your room URL is /Canvas/[roomId]
      } else {
        // After signup, redirect to the signin page
        alert("Signup successful! Please sign in.");
        router.push("/signin");
      }
    } else {
      const errorMsg = isSignin
        ? "Sign in failed. Please check your credentials."
        : "Sign up failed. User may already exist.";
      setError(errorMsg);
    }
  }

  // 3. Update the JSX to include all fields and the form handler
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-sm p-6 space-y-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          {isSignin ? "Sign In" : "Create Account"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignin && (
            <div>
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          )}
          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {isSignin ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

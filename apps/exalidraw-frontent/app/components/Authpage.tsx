// src/components/Authpage.tsx
"use client";

import { FormEvent, useState } from "react";
import { HTTP_BACKEND } from "@/config";

type AuthpageProps = {
  isSignin: boolean;
};

export default function Authpage({ isSignin }: AuthpageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiEndpoint = isSignin ? "/signin" : "/signup";
    const payload = isSignin ? { email, password } : { name, email, password };

    const base = HTTP_BACKEND ? HTTP_BACKEND.replace(/\/$/, "") : "";
    const path = apiEndpoint.startsWith("/") ? apiEndpoint : `/${apiEndpoint}`;
    const url = `${base}${path}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // special-case 409 so we show friendly message for duplicate email
      if (response.status === 409) {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? "User already exists with this email");
        setIsLoading(false);
        return;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong!");
      }

      console.log("Success:", data);

      if (data?.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch (err) {
          console.warn("Could not save token to localStorage:", err);
        }
      }

      window.location.href = "/";
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-blue-500 max-w-md p-8 m-8 rounded-2xl">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl text-white font-bold mb-6 text-center">
          {isSignin ? "Sign In" : "Create an Account"}
        </h1>

        {!isSignin && (
          <div className="mb-4">
            <input
              className="bg-white p-3 w-full text-black rounded-lg"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <input
            className="bg-white p-3 w-full text-black rounded-lg"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="bg-white p-3 w-full text-black rounded-lg"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-300 text-center mt-4">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 p-2 mt-6 rounded-md text-md font-semibold text-white w-full disabled:bg-gray-400"
        >
          {isLoading ? "Loading..." : isSignin ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@repo/ui/Input";
import { HTTP_BACKEND } from "@/config";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoint = isSignin ? "/signin" : "/signup";
  const title = isSignin ? "Sign in to your Account" : "Create an Account";
  const buttonText = isSignin ? "Sign In" : "Sign Up";

  const switchLinkHref = isSignin ? "/signup" : "/signin";
  const switchLinkText = isSignin
    ? "Don't have an account?"
    : "Already have an account?";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = isSignin
      ? { username: email, password }
      : { name, username: email, password };

    try {
      const response = await fetch(`${HTTP_BACKEND}${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          {/* Adjusted spacing */}
          {/* Conditionally render the Name input only for the Signup page */}
          {!isSignin && (
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-red-500 text-center">
              {error}
            </p>
          )}
          <div className="pt-2">
            {" "}
            {/* Added padding-top for spacing */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400"
            >
              {isLoading ? "Loading..." : buttonText}
            </button>
          </div>
          <p className="text-sm font-medium text-center text-gray-500">
            {switchLinkText}{" "}
            <Link
              href={switchLinkHref}
              className="text-blue-600 hover:underline"
            >
              {isSignin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

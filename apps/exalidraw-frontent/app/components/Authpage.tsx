"use client";
import { FormEvent, useState } from "react";

type AuthpageProps = {
  isSignin: boolean;
};

export default function Authpage({ isSignin }: AuthpageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, Setname] = useState<string>("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("Form submitted with:", { email, password });
  }

  if (isSignin) {
    return (
      <div className="bg-blue-500 max-w-md p-8 m-8 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="bg-white p-3 w-full text-black rounded-lg"
              type="email" // Use type="email" for email fields
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="bg-white p-3 w-full text-black rounded-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 p-2 mt-6 rounded-md text-md font-semibold text-white w-full"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <div className="bg-blue-500 max-w-md p-8 m-8 rounded-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                className="bg-white p-3 w-full text-black rounded-lg"
                type="email" // Use type="email" for email fields
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="bg-white p-3 w-full text-black rounded-lg"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <input
                className="bg-white p-3 w-full text-black rounded-lg"
                type="name"
                placeholder="name"
                value={name}
                onChange={(e) => Setname(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 p-2 mt-6 rounded-md text-md font-semibold text-white w-full"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    ); // Placeholder for your signup form
  }
}

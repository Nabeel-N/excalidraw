"use client";
import { Button } from "@repo/ui/button";
import Link from "next/link";
export default function App() {
  return (
    <div className="w-screen h-screen bg-linear-to-r from-orange-500 to-white">
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center bg-linear-to-r from-black to-gray-700 m-3 p-4 rounded-4xl w-lg space-x-3">
          <Link href="/signup">
            <Button
              className="bg-gradient-to-br bg-linear-to-r from-sky-500 to-violet-500 text-sm text-white rounded-sm p-1"
              onClick={() => {}}
            >
              Signup
            </Button>
          </Link>
          <Link href="/signin">
            <Button
              className="bg-gradient-to-br bg-linear-to-r from-sky-500 to-violet-500 text-sm text-white rounded-sm p-1"
              onClick={() => {}}
            >
              Signin
            </Button>
          </Link>
          <section className="flex space-x-2.5 text-xs">
            <p>Home</p>
            <p>About</p>
            <p>Solution</p>
            <p>Pricing</p>
            <p>Contact</p>
          </section>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="bg-gray-500 p-2 m-2 rounded-4xl text-sm flex items-center justify-center  ">
          nexa solutions for data analytics
        </div>
      </div>
      <div className="flex justify-center items-center">
        Save Time And Build Better With
        <div className="bg-linear-to-t from-sky-500 to-indigo-500 rounded-2xl p-1 m-1">
          Nexa
        </div>
      </div>
    </div>
  );
}

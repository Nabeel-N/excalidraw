"use client";
import { Input } from "@repo/ui/Input";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className=" bg-blue-800 rounded p-3 m-3">
        <div className="p-2 m-2">
          <Input
            type="text"
            placeholder="Email"
            classname="bg-green-900  text-white p-4 m-4 rounded-md shadow-emerald-300"
          ></Input>
        </div>
        <div>
          <button className="bg-violet-800 rounded p-2" onClick={() => {}}>
            {isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

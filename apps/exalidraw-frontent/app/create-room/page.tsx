"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

// Reusable InputGroup component for consistency
function InputGroup({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        required
      />
    </div>
  );
}

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const response = await fetch(`${HTTP_BACKEND}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Correctly formatted Bearer token
          Authorization: `${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });

      const data = await response.json();
      const { roomId } = data;

      if (!response.ok) {
        throw new Error(data.message || "Failed to create room");
      }
      console.log(roomId);

      router.push(`/Canvas/${roomId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-8 bg-blue-50 rounded-xl shadow-2xl space-y-7">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 tracking-tight">
          Create a New Room
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup
            id="roomName"
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g., 'project-discussion'"
          />

          {error && (
            <p className="text-sm text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

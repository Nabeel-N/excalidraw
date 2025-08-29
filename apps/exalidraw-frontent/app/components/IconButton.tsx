"use client";

import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <div
      className={`m-1 cursor-pointer rounded-md border p-2 bg-gray-800 transition-colors hover:bg-gray-700 ${
        activated
          ? "border-blue-500 text-blue-400"
          : "border-gray-600 text-white"
      }`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}

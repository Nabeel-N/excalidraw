import React from "react";

// 1. Extend the standard HTML Input attributes to accept any valid prop (id, value, onChange, etc.)
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// 2. Use a standard 'className' prop and spread the rest of the props.
//    This passes everything down to the actual <input> element.
export function Input({ className, ...props }: InputProps) {
  return <input {...props} className={className} />;
}

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  className?: string;
};

export const Input = ({ label, className, id, name, ...props }: InputProps) => {
  const inputId = id ?? name;

  if (!label) {
    return (
      <input
        id={inputId}
        name={name}
        className={`p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 focus:border-primary-100 placeholder:text-gray-400 transition ${className ?? ""}`}
        {...props}
      />
    );
  }

  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={inputId}
        className="mb-1 text-sm font-semibold text-primary-texto"
      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={`p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 focus:border-primary-100 placeholder:text-gray-400 transition ${className ?? ""}`}
        {...props}
      />
    </div>
  );
};

export default Input;

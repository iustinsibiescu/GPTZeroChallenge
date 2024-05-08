"use client";

import React, { useState } from "react";
import Image from "next/image";
import richieRich from "../../assets/richieRich.webp";
import profilePicture from "../../assets/profilePicture.jpeg";

export const ChatResponse = ({ response }) => (
  <div className="p-10 prose bg-white my-6 rounded-lg mx-auto w-full">
    <div className="flex items-center gap-4">
      <Image
        className="rounded-full"
        src={richieRich}
        alt="Richie Rich"
        width={54}
        height={54}
      />
      <div className="font-semibold text-lg">Richie Rich</div>
    </div>
    <div className="" dangerouslySetInnerHTML={{ __html: response }} />
  </div>
);

export const ChatPrompt = ({ prompt }) => (
  <div className="p-10 prose bg-white my-6 rounded-lg mx-auto w-full">
    <div className="flex items-center gap-4">
      <Image
        className="rounded-full"
        src={profilePicture}
        alt="User"
        width={54}
        height={54}
      />
      <div className="font-semibold text-lg">You</div>
    </div>

    <div className="w-full">{prompt}</div>
  </div>
);

export const TextArea = ({ onChange, onSubmit, isLoading, hasError }) => {
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setText(event.target.value);
    onChange(event);
  };

  const handleClick = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex absolute bottom-0 w-full h-1/6 p-10  bg-slate-950 shadow">
      <textarea
        className={`w-full rounded-xl bg-slate-900 border border-gray-500  p-2 text-white ${hasError ? "border-red-500" : ""}`}
        onChange={handleChange}
        value={text}
      ></textarea>
      <button
        onClick={handleClick}
        className="bg-gray-600 p-2 mx-4 rounded-xl w-20 h-fit my-auto flex justify-center items-center"
        disabled={isLoading}
      >
        {isLoading && <LoadingSpinner />}
        Send
      </button>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="white"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="white"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

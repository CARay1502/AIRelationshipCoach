"use client";

import { useState, FormEvent } from "react";
import ScanResult from "./components/ScanResult";
import Chatbot from "./components/Chatbot";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [prompt, setPrompt] = useState<string>("");
  const [startScan, setStartScan] = useState(false);
  const [showScan, setShowScan] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    
  };

  const handleStart = () => {
    setIsVisible(true);
    setShowScan(true);
    setStartScan(true); // trigger scan process auto
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-300">

      {!isVisible ? (
        <button
          onClick={handleStart} // from scan show result (screenshot of ur ugly self lollll)
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          AI Relationship Coach
        </button>
      ) : (
        <div className="w-full text-black max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col items-center gap-6">
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">AI Dating Coach</h1>
            <ScanResult startScan={startScan} />
          </div>

          <div className="w-full bg-gray-200 p-4 rounded-lg shadow">
            <Chatbot />
          </div>
        </div>
      )}
    </main>
  );
}


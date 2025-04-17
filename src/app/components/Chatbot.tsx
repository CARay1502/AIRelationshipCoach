import { useState, useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import Animation from "@/app/Animation - 1743878247262.json";

export default function Chatbot() {
  const [userInput, setUserInput] = useState<string>(""); // user input
  const [chatbotResponse, setChatbotResponse] = useState<string>("");
  const lottieRef = useRef<LottieRefCurrentProps | null>(null); //lottie ref n shit

  //this initializes lottie file animation speed, its so stupuid
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.1);
    }
  }, []);

  // for enter key
  const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChatbotResponse();
    }
  };

  const handleChatbotResponse = async () => {
    if (!userInput.trim()) return; // no empty msg

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) throw new Error("Failed to fetch chatbot response");

      const data = await response.json();
      console.log("Chatbot response: ", data);
      setChatbotResponse(data.response); 
      setUserInput("");

      if (data.audio) {
        const audio = new Audio(data.audio);
        audio.play();

        if (lottieRef.current) {
          lottieRef.current.setSpeed(1.2);
        }

        audio.onended = () => {
          if (lottieRef.current) {
            lottieRef.current.setSpeed(0.1); 
          }
        };
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-center p-4">
        <Lottie
          animationData={Animation}
          loop={true}
          autoplay={true}
          lottieRef={lottieRef}
          style={{ width: "150px", height: "150px" }} 
        />
      </div>

      <div className="flex flex-row w-full">
        <input
          className="text-left w-full p-2"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handlePressKey}
          placeholder="Ask the coach..."
        />
        <button className="p-2 bg-black text-white rounded" onClick={handleChatbotResponse}>
          Send
        </button>
      </div>

      <div className="flex flex-col w-full p-2 pt-4">
        <p>
          <strong>Transcript: </strong> {chatbotResponse}
        </p>
      </div>
    </div>
  );
}

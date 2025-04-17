

export default function TextToSpeech({ text }: { text: string }) {

  const handleTextToSpeech = async () => {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to generate speech.");

      const { audioContent } = await response.json();
      const audioBlob = new Blob([new Uint8Array(atob(audioContent).split("").map((c) => c.charCodeAt(0)))], {
        type: "audio/mp3",
      });

      const url = URL.createObjectURL(audioBlob);
      new Audio(url).play(); 
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  return (
    <div>
      <button onClick={handleTextToSpeech} className="bg-blue-500 text-white px-4 py-2 rounded">
        🔊 Play Response
      </button>
    </div>
  );
}

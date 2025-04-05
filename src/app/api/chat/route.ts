import { GoogleGenerativeAI } from "@google/generative-ai";
import textToSpeech from "@google-cloud/text-to-speech";
import { Buffer } from "buffer";

const apiKey = process.env.GEMINI_API_KEY;
const ttsClient = new textToSpeech.TextToSpeechClient();

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

const instructions = "You are an AI Relationship Coach, your task is to gice relationship advice in a friendly, fun and supportive tone. Ensure your answers are clear, concise and encouraging.If the user asks for advice, provide positive and actionable tips. Do not use astericks in your responses. "
export async function POST(req: Request) {
  try {
    const { message } = await req.json(); 

    const prompt = `${instructions}\nUser: ${message}\nAI:`;

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 75,
        responseMimeType: "text/plain",
      },
      history: [], 
    });

    const result = await chatSession.sendMessage(prompt);
    let responseText = result.response.text();

    //process text to get rid of special characters that fuck up tts
    responseText = responseText.replace(/\*/g, '');
    responseText = responseText.replace(/_/g, ''); 
    responseText = responseText.replace(/~/g, '');
    //remove shitty emojis
    responseText = responseText.replace(
      /[\p{Emoji}\u200B-\u200D\uFE0F\uD83C-\uDBFF\uDC00-\uDFFF]+/gu, 
      ''
    );

    // convert stupid gemini stuff to audio tts
    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: responseText },
      voice: { languageCode: "en-AU", name: "en-AU-Chirp-HD-O",},
      audioConfig: { audioEncoding: "MP3" },
    });

    
    const audioBase64 = Buffer.from(ttsResponse.audioContent as Buffer).toString("base64");

    return new Response(JSON.stringify({ response: responseText, audio: `data:audio/mp3;base64,${audioBase64}` }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

"use client";

import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { protos } from "@google-cloud/text-to-speech";

const googleTTSClient = new TextToSpeechClient();

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Chirp-HD-M",
        
      },
      audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
    };

    const [response] = await googleTTSClient.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error("No audio content received from Google TTS.");
    }

    // make sure audiocontent is uint8array before convert
    const audioBuffer =
      response.audioContent instanceof Uint8Array
        ? Buffer.from(response.audioContent).toString("base64")
        : response.audioContent;

    return NextResponse.json({ audioContent: audioBuffer });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: "Text-to-Speech failed." }, { status: 500 });
  }
}

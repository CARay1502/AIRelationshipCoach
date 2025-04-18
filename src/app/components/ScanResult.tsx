"use client";

import React, { useEffect, useState } from "react";

const ScanResult = ({ startScan }: { startScan: boolean }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [probStat, setProbStat] = useState<number | null>(null);
    const [chance, setChance] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);

    useEffect(() => {
        if (startScan) {
            captureImage();
        }
    }, [startScan]);

    const captureImage = async () => {
        try {
            if (typeof window === 'undefined') return;
            
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement("video");
            video.srcObject = stream;
            await new Promise((resolve) => (video.onloadedmetadata = resolve));
            video.play();

            await new Promise((resolve) => setTimeout(resolve, 500));

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const capturedImage = canvas.toDataURL("image/png");
                setImageSrc(capturedImage);
            }

            stream.getTracks().forEach((track) => track.stop());

            
            setProbStat(null);
            setChance(null);
            setTimeout(() => {
                const probStat = Math.floor(Math.random() * 101);
                setProbStat(probStat);

                let category = "";
                let color ="";
                if (probStat <= 25) {
                    category = "you have a high chance of dying alone.";
                    color = "text-red-600";
                } else if (probStat <= 50) {
                    category = "not much to work with, but you never know";
                    color = "text-orange-400";
                } else if (probStat <= 75) {
                    category = "good chance, but it will take time/work";
                    color = "text-yellow-500";
                } else {
                    category = "you're a rizzler, ez gg";
                    color = "text-green-500";
                }

                setChance(category);
                setColor(color);
            }, 2000);
        } catch (error) {
            console.error("Error capturing image:", error);
        }
    };

    if (!imageSrc) return <p className="text-center text-green-500 mt-4">Scanning...</p>;

    return (
        <div className="text-center mt-4">
            <img src={imageSrc} alt="scan result" className="rounded-lg shadow-lg max-h-75 min-w-full" />
            <div className="flex flex-row justify-center">
                <p className="text-xl font-bold text-black">Cuteness: </p>
                <p className={`text-xl font-bold ${color}`}> {probStat}%</p>
            </div>
            <div className="flex flex-row justify-center">
                <p className="text-xl font-bold text-black">Summary: </p>
                <p className={`text-xl font-bold ${color}`}> {chance}</p>
            </div>
            
        </div>
    );
};

export default ScanResult;


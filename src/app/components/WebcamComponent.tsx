"use client";
import React, { useEffect, useRef } from "react";

const WebcamComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Function to start the webcam
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();
    }, []);

    return <video ref={videoRef} autoPlay playsInline />;
};

export default WebcamComponent;

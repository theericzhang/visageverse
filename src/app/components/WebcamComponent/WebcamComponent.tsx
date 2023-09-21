"use client";
import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const WebcamComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Function to start the webcam and perform face recognition
        const loadAllModels = () => {
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            ])
                .then(() => console.log("done"))
                .catch((e) => console.log(e));
        };

        videoRef && loadAllModels();
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    // Initialize faceapi with the video element
                    const canvas = faceapi.createCanvasFromMedia(
                        videoRef.current
                    );
                    document.body.append(canvas);

                    // Set canvas dimensions
                    canvas.width = videoRef.current.width || 640;
                    canvas.height = videoRef.current.height || 480;

                    // Perform face detection and recognition
                    const displaySize = {
                        width: canvas.width,
                        height: canvas.height,
                    };
                    faceapi.matchDimensions(canvas, displaySize);

                    // Run face detection and landmarks detection
                    const detections = await faceapi
                        .detectAllFaces(
                            videoRef.current,
                            new faceapi.TinyFaceDetectorOptions()
                        )
                        .withFaceLandmarks()
                        .withFaceDescriptors();
                    const resizedDetections = faceapi.resizeResults(
                        detections,
                        displaySize
                    );

                    // Clear the canvas and draw the results
                    canvas
                        ?.getContext("2d")
                        ?.clearRect(0, 0, canvas.width, canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
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

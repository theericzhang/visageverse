"use client";
import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { drawDetections } from "face-api.js/build/commonjs/draw";

const WebcamComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Function to start the webcam and perform face recognition
    const loadAllModels = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };

    const handleSuccess = (stream) => {
        if (videoRef.current && canvasRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener("play", () => {
                const displaySize = {
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight,
                };
                canvasRef.current.width = displaySize.width;
                canvasRef.current.height = displaySize.height;

                const context = canvasRef.current?.getContext("2d");
                setInterval(async () => {
                    const detections = await faceapi
                        .detectAllFaces(
                            videoRef.current,
                            new faceapi.TinyFaceDetectorOptions()
                        )
                        .withFaceLandmarks()
                        .withFaceExpressions();
                    const resizedDetections = faceapi.resizeResults(
                        detections,
                        displaySize
                    );
                    context.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                    );
                    faceapi.draw.drawDetections(
                        canvasRef.current,
                        resizedDetections
                    );
                }, 100);
            });
        }
    };

    // const startWebcam = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({
    //             video: true,
    //         });

    //         if (videoRef.current) {
    //             console.log("expect load");
    //             videoRef.current.srcObject = stream;

    //             // Initialize faceapi with the video element
    //             const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    //             document.body.append(canvas);

    //             // Set canvas dimensions
    //             canvas.width = videoRef.current.width || 640;
    //             canvas.height = videoRef.current.height || 480;

    //             // Perform face detection and recognition
    //             const displaySize = {
    //                 width: canvas.width,
    //                 height: canvas.height,
    //             };
    //             faceapi.matchDimensions(canvas, displaySize);

    //             // Run face detection and landmarks detection
    //             const detections = await faceapi
    //                 .detectAllFaces(
    //                     videoRef.current,
    //                     new faceapi.TinyFaceDetectorOptions()
    //                 )
    //                 .withFaceLandmarks()
    //                 .withFaceDescriptors();
    //             const resizedDetections = faceapi.resizeResults(
    //                 detections,
    //                 displaySize
    //             );

    //             // Clear the canvas and draw the results
    //             canvas
    //                 ?.getContext("2d")
    //                 ?.clearRect(0, 0, canvas.width, canvas.height);
    //             faceapi.draw.drawDetections(canvas, resizedDetections);
    //             faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    //         }
    //     } catch (error) {
    //         console.error("Error accessing webcam:", error);
    //     }
    // };

    useEffect(() => {
        videoRef && loadAllModels();

        const getUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                handleSuccess(stream);
            } catch (e) {
                console.log(e);
            }
        };

        getUserMedia();
    }, []);

    return (
        <>
            <video ref={videoRef} autoPlay playsInline />
            <canvas ref={canvasRef} />
        </>
    );
};

export default WebcamComponent;

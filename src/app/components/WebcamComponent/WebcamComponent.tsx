"use client";
import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import styled from "styled-components";

const WebcamComponentWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const WebcamVideoComponent = styled.video`
    width: 50vw;
    height: auto;

    @media (max-width: 600px) {
        width: auto;
        height: 100vh;
    }
`;

const CanvasComponent = styled.canvas`
    position: absolute;
    top: 0;
    z-index: 2;
    width: 50vw;
    height: auto;

    @media (max-width: 600px) {
        width: auto;
        height: 100vh;
    }
`;

interface IWebcamComponent {
    setExpression: React.Dispatch<React.SetStateAction<string>>;
}

interface FaceExpressions {
    [key: string]: number;
}

let highPollRateEmotion = "";

const WebcamComponent = ({ setExpression }: IWebcamComponent) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Function to start the webcam and perform face recognition
    const loadAllModels = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };

    let debounceTimeout: NodeJS.Timeout | null = null;

    let expressionPollingID: NodeJS.Timeout | number;

    // interval cleanup
    useEffect(() => {
        return () => {
            clearInterval(expressionPollingID);
        };
    }, []);

    const handleSuccess = (stream: MediaStream) => {
        let tempKeyMax = "";

        if (videoRef.current && canvasRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener("play", () => {
                const displaySize = {
                    width: videoRef.current!.videoWidth,
                    height: videoRef.current!.videoHeight,
                };
                canvasRef.current!.width = displaySize.width;
                canvasRef.current!.height = displaySize.height;

                const context = canvasRef.current?.getContext("2d");
                expressionPollingID = setInterval(async () => {
                    const detections = await faceapi
                        .detectAllFaces(
                            videoRef.current!,
                            new faceapi.TinyFaceDetectorOptions()
                        )
                        .withFaceLandmarks()
                        .withFaceExpressions();

                    // figure out how to grab highest value expression and debounce the value from updating.
                    let maxValue = 0;
                    if (detections[0]) {
                        for (let key in detections[0].expressions) {
                            // @ts-ignore: Unreachable code error
                            if (detections[0].expressions[key] > maxValue) {
                                // @ts-ignore: Unreachable code error
                                maxValue = detections[0].expressions[key];
                                tempKeyMax = key;
                            }
                        }

                        if (tempKeyMax !== highPollRateEmotion) {
                            highPollRateEmotion = tempKeyMax;
                            if (debounceTimeout !== null) {
                                clearTimeout(debounceTimeout);
                            }
                            debounceTimeout = setTimeout(() => {
                                setExpression(highPollRateEmotion);
                                debounceTimeout = null;
                            }, 1000);
                        }

                        const resizedDetections = faceapi.resizeResults(
                            detections,
                            displaySize
                        );
                        context?.clearRect(
                            0,
                            0,
                            canvasRef.current!.width,
                            canvasRef.current!.height
                        );
                        faceapi.draw.drawDetections(
                            canvasRef.current!,
                            resizedDetections
                        );
                        faceapi.draw.drawFaceExpressions(
                            canvasRef.current!,
                            resizedDetections
                        );
                    }
                }, 200);
            });
        }
    };

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
        <WebcamComponentWrapper>
            <WebcamVideoComponent ref={videoRef} autoPlay playsInline />
            <CanvasComponent ref={canvasRef} />
        </WebcamComponentWrapper>
    );
};

export default WebcamComponent;

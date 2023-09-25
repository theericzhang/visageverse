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

const WebcamVideoComponent = styled.video``;

const CanvasComponent = styled.canvas`
    position: absolute;
    top: 0;
    z-index: 2;
`;

interface IWebcamComponent {
    setExpression: React.Dispatch<React.SetStateAction<string | null>>;
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

    let timerID: string | number | NodeJS.Timeout | undefined;

    // const debounceExpressionUpdate = (expression: string) => {
    //     clearInterval(timerID);
    //     setInterval(() => {
    //         highPollRateEmotion = expression;
    //     }, 1000);
    // };

    const handleSuccess = (stream: MediaStream) => {
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
                setInterval(async () => {
                    const detections = await faceapi
                        .detectAllFaces(
                            videoRef.current!,
                            new faceapi.TinyFaceDetectorOptions()
                        )
                        .withFaceLandmarks()
                        .withFaceExpressions();

                    // figure out how to grab highest value expression and debounce the value from updating.
                    let maxValue = 0;
                    let tempKeyMax = "";
                    for (let key in detections[0].expressions) {
                        if (detections[0].expressions[key] > maxValue) {
                            maxValue = detections[0].expressions[key];
                            tempKeyMax = key;
                        }
                    }
                    // grab top expression (tempKeyMax);
                    // debounceExpressionUpdate(tempKeyMax);

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

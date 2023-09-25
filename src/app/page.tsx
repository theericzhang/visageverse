"use client";

import WebcamComponent from "./components/WebcamComponent/WebcamComponent";
import styled from "styled-components";
import QuoteLabel from "./components/QuoteLabel/QuoteLabel";
import useFetch from "./hooks/useFetch";
import { useState, useRef } from "react";

const HomeWrapper = styled.section``;

export default function Home() {
    const expressionRef = useRef<string | null>("");
    setInterval(() => console.log(expressionRef.current), 1000);
    const { data, error, isLoading } = useFetch("Happy");
    console.log(data?.result.content);
    let quote = data?.result.content;
    return (
        <HomeWrapper>
            <QuoteLabel quote={quote} />
            <WebcamComponent expressionRef={expressionRef} />
        </HomeWrapper>
    );
}

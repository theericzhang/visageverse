"use client";

import WebcamComponent from "./components/WebcamComponent/WebcamComponent";
import styled from "styled-components";
import QuoteLabel from "./components/QuoteLabel/QuoteLabel";
import useFetch from "./hooks/useFetch";
import { useState, useRef, useEffect } from "react";

const HomeWrapper = styled.section``;

export default function Home() {
    const [expression, setExpression] = useState("");

    const { data, error, isLoading } = useFetch(expression);

    setInterval(() => console.log(expression), 1000);
    console.log(data?.result.content);
    let quote = data?.result.content;
    return (
        <HomeWrapper>
            <QuoteLabel quote={quote} isLoading={isLoading} />
            <WebcamComponent setExpression={setExpression} />
        </HomeWrapper>
    );
}

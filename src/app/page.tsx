"use client";

import WebcamComponent from "./components/WebcamComponent/WebcamComponent";
import styled from "styled-components";
import QuoteLabel from "./components/QuoteLabel/QuoteLabel";
import useFetch from "./hooks/useFetch";
import { useState } from "react";

const HomeWrapper = styled.section``;

export default function Home() {
    const [expression, setExpression] = useState<string | null>("");
    setInterval(() => console.log(expression), 1000);
    const { data, error, isLoading } = useFetch("Happy");
    console.log(data?.result.content);
    let quote = data?.result.content;
    return (
        <HomeWrapper>
            <QuoteLabel quote={quote} />
            <WebcamComponent setExpression={setExpression} />
        </HomeWrapper>
    );
}

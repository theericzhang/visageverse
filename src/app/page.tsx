"use client";

import WebcamComponent from "./components/WebcamComponent/WebcamComponent";
import styled from "styled-components";
import QuoteLabel from "./components/QuoteLabel/QuoteLabel";
import useFetch from "./hooks/useFetch";

const HomeWrapper = styled.section``;

export default function Home() {
    const { data, error, isLoading } = useFetch("Neutral");
    console.log(data?.result.content);
    let quote = data?.result.content;
    return (
        <HomeWrapper>
            <QuoteLabel quote={quote} />
            <WebcamComponent />
        </HomeWrapper>
    );
}

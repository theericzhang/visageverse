"use client";

import WebcamComponent from "./components/WebcamComponent/WebcamComponent";
import styled from "styled-components";
import QuoteLabel from "./components/QuoteLabel/QuoteLabel";
import useFetch from "./hooks/useFetch";

const HomeWrapper = styled.section``;

export default function Home() {
    return (
        <HomeWrapper>
            <QuoteLabel />
            <WebcamComponent />
        </HomeWrapper>
    );
}

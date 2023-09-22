"use client";

import WebcamComponent from "./components/WebcamComponent/WebcamComponent";
import styled from "styled-components";
import QuoteLabel from "./components/QuoteLabel/QuoteLabel";

const HomeWrapper = styled.section``;

export default function Home() {
    return (
        <HomeWrapper>
            <QuoteLabel />
            <WebcamComponent />
        </HomeWrapper>
    );
}

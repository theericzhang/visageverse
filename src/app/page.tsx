"use client";

import WebcamComponent from "./components/WebcamComponent/WebcamComponent";
import styled from "styled-components";

const HomeWrapper = styled.section`
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default function Home() {
    return (
        <HomeWrapper>
            <WebcamComponent />
        </HomeWrapper>
    );
}

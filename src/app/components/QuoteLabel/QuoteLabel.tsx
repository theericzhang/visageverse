import styled from "styled-components";

interface IQuoteLabel {
    quote?: string;
    isLoading: boolean;
}

const QuoteWrapper = styled.span`
    font-size: 16px;
    white-space: pre;
    text-align: left;
    width: auto;
    position: absolute;
    z-index: 3;
    color: white;
    font-weight: 600;
    background-color: black;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    @media (max-width: 600px) {
        font-size: 20px;
        max-width: 100vw;
        white-space: normal;
        top: 40px;
        bottom: unset;
    }
`;

export default function QuoteLabel({ quote, isLoading }: IQuoteLabel) {
    return <QuoteWrapper>{isLoading ? "Loading..." : `${quote}`}</QuoteWrapper>;
}

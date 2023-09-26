import styled from "styled-components";

interface IQuoteLabel {
    quote?: string;
    isLoading: boolean;
}

const QuoteWrapper = styled.span`
    white-space: pre-wrap;
    position: absolute;
    z-index: 3;
    color: blue;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
`;

export default function QuoteLabel({ quote, isLoading }: IQuoteLabel) {
    return <QuoteWrapper>{isLoading ? "Loading..." : `${quote}`}</QuoteWrapper>;
}

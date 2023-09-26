import styled from "styled-components";

interface IQuoteLabel {
    quote?: string;
    isLoading: boolean;
}

const QuoteWrapper = styled.span`
    white-space: pre-wrap;
`;

export default function QuoteLabel({ quote, isLoading }: IQuoteLabel) {
    return <QuoteWrapper>{isLoading ? "Loading..." : `${quote}`}</QuoteWrapper>;
}

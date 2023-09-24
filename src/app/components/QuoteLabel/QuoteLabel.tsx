import styled from "styled-components";

interface IQuoteLabel {
    quote?: string;
}

const QuoteWrapper = styled.span`
    white-space: pre-wrap;
`;

export default function QuoteLabel({ quote }: IQuoteLabel) {
    return <QuoteWrapper>{`${quote}`}</QuoteWrapper>;
}

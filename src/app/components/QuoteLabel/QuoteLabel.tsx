import styled from "styled-components";

interface IQuoteLabel {
    quote?: string;
}
export default function QuoteLabel({ quote }: IQuoteLabel) {
    return <div>{quote}</div>;
}

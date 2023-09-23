import { useState } from "react";

interface Error {
    status: number;
    message: string;
}

export default function useFetch(userInput: string) {
    const [data, setData] = useState<String>("");
    const [error, setError] = useState<Error | null>();
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    let corePrompt = `Write a few poetic lines on someone who is: ${userInput}.`;

    getData();

    async function getData() {
        try {
            setIsLoading(true);
            const response = await fetch("api/openai/server", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: corePrompt }),
            });
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: "Request Failed",
                } as Error;
            } else {
                const data = await response.json();
                setData(data);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
            setError(e as Error);
            setIsLoading(false);
        }
    }

    return { data, error, isLoading };
}

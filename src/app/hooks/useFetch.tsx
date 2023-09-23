import { useState, useEffect } from "react";

interface Error {
    status: number;
    message: string;
}

export default function useFetch(userInput: string) {
    const [data, setData] = useState<String>("");
    const [error, setError] = useState<Error | null>();
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    let corePrompt = `Write a few poetic lines on someone who is: ${userInput}.`;

    useEffect(() => {
        getData();
    }, [userInput]);

    async function getData() {
        try {
            setIsLoading(true);
            const response = await fetch("/src/app/api/openai/server", {
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
            }
        } catch (e) {
            console.log(e);
            setError(e as Error);
        } finally {
            setIsLoading(false);
        }
    }

    return { data, error, isLoading };
}

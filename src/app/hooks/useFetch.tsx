import { useState, useEffect } from "react";

interface IError {
    status: number;
    message: string;
}

interface IData {
    result: {
        role: string;
        content: string;
    };
}

export default function useFetch(userInput: string) {
    const [data, setData] = useState<IData | null>();
    const [error, setError] = useState<IError | null>();
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    useEffect(() => {
        getData();
    }, [userInput]);

    async function getData() {
        try {
            setIsLoading(true);
            const response = await fetch("/api/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userInput }),
                // body: JSON.stringify({ prompt: corePrompt }),
            });
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: "Request Failed",
                } as IError;
            } else {
                const data = await response.json();
                setData(data);
            }
        } catch (e) {
            console.log(e);
            setError(e as IError);
        } finally {
            setIsLoading(false);
        }
    }

    return { data, error, isLoading };
}

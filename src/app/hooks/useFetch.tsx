import { useState } from "react";

interface Error {
    status: number;
    message: string;
}

export default function useFetch() {
    const [data, setData] = useState<String>("");
    const [error, setError] = useState<Error | null>();
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    async function getData() {
        try {
            setIsLoading(true);
            const response = await fetch("");
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: "Request Failed",
                } as Error;
            }
            const data = await response.json();
            setData(data);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setError(e as Error);
            setIsLoading(false);
        }
    }

    return { data, error, isLoading };
}

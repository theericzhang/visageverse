/* eslint-disable import/no-anonymous-default-export */
import OpenAI from "openai";
import { NextResponse } from "next/server";

const apiKey = process.env.AZURE_OPENAI_KEY;
const base_url = process.env.BASE_URL;
const deploymentName = process.env.DEPLOYMENT_NAME;

// WARNING - DO NOT EDIT BLOCKS CONTAINING isCurrentEnvironmentAzure UNLESS YOU HAVE DEPLOYED A GPT-3 INSTANCE ON AZURE.
const isCurrentEnvironmentAzure = process.env.CURRENT_ENVIRONMENT === "azure";
console.log(isCurrentEnvironmentAzure);
let url;
let openai;
console.log(isCurrentEnvironmentAzure);

if (isCurrentEnvironmentAzure) {
    url = `${base_url}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-05-15`;
    console.log("set url");
} else {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

const httpMessages = {
    400: "Your request could not be understood. Try reworking your prompt and resubmitting it",
    401: "There was a problem authenticating your account. Check to see if your API keys are correct.",
    403: "Your request was received, but you do not have permission to access the resource.",
    404: "Not Found - The requested resource could not be found on the server.",
    500: "Internal Server Error - An unexpected error occurred on the server.",
};

let messages = [
    {
        role: "system",
        content:
            "You're writing a short poetic line or two based on someone's emotion. Add a bit of sass in your responses too. Try to make them laugh",
    },
];

export async function POST(req) {
    if (isCurrentEnvironmentAzure) {
        try {
            const res = await req.json();
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": apiKey,
                },
                body: JSON.stringify(generatePrompt(res.userInput)),
            });

            if (!response.ok) {
                console.log(
                    `HTTP Code: ${response.status} - ${response.statusText}`
                );
                console.log("fetch failed");
                return NextResponse.json({
                    error: `Oops! Something went wrong. ${
                        httpMessages[response.status]
                    }`,
                });

                // If something went wrong, like an api call did not go through because of bad permissions, you will be redirected here
            } else {
                const completion = await response.json();
                console.log(completion);
                return NextResponse.json({
                    result: completion.choices[0].message,
                });
            }
        } catch (e) {
            console.error(e);
            return NextResponse.json({
                error: "Could not contact GPT 3.5. Check to see if your internet connection is stable",
            });
            // If there was an issue where the outbound connection could not reach the server, then you will be redirected here.
        }
    } else {
        const completion = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: generatePrompt(req.body.prompt),
            temperature: 0.6,
            max_tokens: 1000,
        });
        return NextResponse.json({
            result: completion.data.choices[0].text,
        });
    }
}

function generatePrompt(prompt) {
    if (isCurrentEnvironmentAzure) {
        // console.log('attempting to set model?');
        return {
            model: "gpt-35-turbo",
            messages: [
                ...messages,
                {
                    role: "user",
                    content: `I am ${prompt}`,
                },
            ],
            // other options here
        };
    } else {
        return `${prompt}`;
    }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
// import { StreamingTextResponse } from 'ai';
// import { experimental_StreamData } from 'ai';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Create a Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = await streamText({
            model: google('gemini-1.5-pro-002'),
            messages,
            system: `You are a helpful recipe assistant that helps users find recipes based on their ingredients and answers cooking-related questions.`,
        });
        console.log("The respoisnes issssss:", result.text);
        return result.toDataStreamResponse({});
            
    } catch (error) {
        console.log(error);
    }
}
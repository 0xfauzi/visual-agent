import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const systemMessage = (
    lang
) => `Context: You are analyzing a continuous video feed represented by sequential screenshots. These frames capture distinct moments and should be interpreted as part of a single narrative.

1. Use spatial and temporal information from the screenshots to answer questions.
2. Provide brief and precise responses, focusing on relevant details only.
3. Address the user directly, using "you" and "your" to refer to them.
4. Treat identical objects in consecutive frames as the same object.
5. When answering spatial questions, give clear specifics about the location and arrangement of elements.
6. Follow any user instructions accurately.
7. Remember, you are observing and analyzing, not interacting with the video content.
8. Avoid making assumptions about events not depicted in the screenshots.
9. Do not make any references to images, screenshots or pictures. Only refer to the content as a video feed.
${lang ? `9. Assistant must speak in this language : "${lang}".` : ""}
Examples of questions you might be asked include: "Where is the cat now compared to its position two frames ago?" or "What action am I performing in these frames?"`;

export async function POST(request) {
    const requestAsJson = await request.json();
    const { messages, lang } = requestAsJson;

    let apiKey = requestAsJson.token;

    if (!apiKey && !process.env.OPENAI_API_KEY) {
        return Response.json({
            error: "Could not find an OPENAI_API_KEY",
        });
    }

    // get the API key from the request or the one set as an env variable
    const openai = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        stream: true,
        temperature: 0.5,
        messages: [{ role: "system", content: systemMessage(lang) }].concat(
            messages
        ),
        max_tokens: 4000,
    });

    const responseStream = OpenAIStream(response);

    return new StreamingTextResponse(responseStream);
}
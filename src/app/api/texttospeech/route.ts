import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {

    const formData = await req.formData();
    const input = formData.get("input") as string;
    let apiKey = formData.get("token") as string;

    if (!apiKey || apiKey === "null" && !process.env.OPENAI_API_KEY) {
        return Response.json({
            error: "No OPENAI_API_KEY env variable set",
        });
    }

    const openai = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    const mp3 = await openai.audio.speech.create({
        model: "tts-1", // hd model is optimized for quality, not speed
        voice: "alloy",
        input,
        speed: 1.3,
        response_format: "opus",
    });

    const audioData = await mp3.arrayBuffer();
    const audioBlob = new Blob([audioData], { type: "audio/mpeg" });

    return new Response(audioBlob, {
        headers: {
            "Content-Type": "audio/ogg",
        },
    });
}
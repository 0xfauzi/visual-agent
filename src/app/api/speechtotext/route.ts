import OpenAI from "openai";
export const runtime = "edge";

export async function POST(req: Request) {

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const apiKey = formData.get("token") as string;
    const lang = formData.get("lang") as string;

    if ((!apiKey || apiKey === "null" && !process.env.OPENAI_API_KEY)) {
        return Response.json({
            error: "No OPENAI_API_KEY env variable set"
        });
    }

    const openai = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY
    });

    const transcript = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
        language: lang || undefined
    });

    return Response.json(transcript);
}
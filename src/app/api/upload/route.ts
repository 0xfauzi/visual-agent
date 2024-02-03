import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { temporaryFile } from "tempy";

export async function POST(req: { formData: () => any; }) {

    const formData = await req.formData();
    const imageData = formData.get("image") as string;

    if (!imageData) {
        return new Response(JSON.stringify({ error: "Request is invalid, it has no image data." }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    try {
        const imageDataAsBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
        const dataBuffer = Buffer.from(imageDataAsBase64, "base64");
        const id = uuidv4();
        const filename = id + ".png";

        const tmpPath = temporaryFile({ name: filename });

        fs.writeFileSync(tmpPath, dataBuffer);

        return new Response(JSON.stringify({ id }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Encountered an error while processing image upload request" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}

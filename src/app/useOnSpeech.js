import { uploadImage } from "./useImageUpload";
import { useImagesGrid } from "./useImagesGrid";

const MAX_SCREENSHOTS = 60;
const IMAGE_QUALITY = 0.6;
const COLUMNS = 4;
const IMAGE_WIDTH = 512;

/**
 * Processes speech data and handles the uploading of video captures.
 *
 * This function is triggered upon receiving speech data. It stops the recording,
processes the speech to text,
 * uploads the last set of video captures as a single image, and appends the
processed data to the chat.
 * It utilizes local storage to retrieve the AI token for authentication purposes.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.audio - The audio control object with methods for managin
audio recording.
 * @param {Object} params.isBusy - Ref object indicating if the chat is currently
processing a message.
 * @param {Function} params.setPhase - Function to update the chat phase state.
 * @param {Function} params.setTranscription - Function to update the transcription
state.
 * @param {Function} params.setImagesGridUrl - Function to update the state of the
images grid URL.
 * @param {Object} params.screenshotsRef - Ref object pointing to an array where th
captured images are stored.
 * @param {string} params.lang - The language code for speech processing.
 * @returns {Function} A function that takes speech data and an append function,
processes the speech, and handles the upload.
 */
export function useOnSpeech({ audio, isBusy, setPhase, setTranscription,
    setImagesGridUrl, screenshotsRef, lang }) {
    return async (data, append) => {
        if (isBusy.current) return;

        // Retrieve the AI token from local storage for authentication.
        const token = JSON.parse(localStorage.getItem("ai-token"));

        isBusy.current = true;
        audio.stopRecording();

        setPhase("user: processing speech to text");

        const speechtotextFormData = new FormData();
        speechtotextFormData.append("file", data, "audio.webm");
        speechtotextFormData.append("token", token);
        speechtotextFormData.append("lang", lang);

        // Perform the speech-to-text API call.
        const speechtotextResponse = await fetch("/api/speechtotext", {
            method: "POST",
            body: speechtotextFormData,
        });

        const { text, error } = await speechtotextResponse.json();

        if (error) {
            alert(error);
        }

        setTranscription(text);

        setPhase("user: uploading video captures");

        // Keep only the last MAX_SCREENSHOTS screenshots.
        screenshotsRef.current = screenshotsRef.current.slice(-MAX_SCREENSHOTS);

        const [createImagesGrid] = useImagesGrid(screenshotsRef.current,
            setImagesGridUrl, COLUMNS, IMAGE_WIDTH, IMAGE_QUALITY);
        const imageUrl = await createImagesGrid();

        screenshotsRef.current = [];

        // Upload the image and update the chat.
        const uploadedUrl = await uploadImage(imageUrl);
        setImagesGridUrl(uploadedUrl);

        setPhase("user: processing completion");

        // Append the processed data to the chat.
        await append({
            content: [
                text,
                {
                    type: "image_url",
                    image_url: {
                        url: uploadedUrl,
                    },
                },
            ],
            role: "user",
        });
    };
}
/**
 * Handles the completion of a chat message processing.
 * This function is triggered when a chat message has been processed.
 * It performs text-to-speech conversion on the message content, plays the resulting audio,
 * and prepares the system for the next user input.
 * 
 * @param {Object} message - The chat message object.
 * @param {Function} setPhase - Function to update the chat phase state.
 * @param {Object} audio - Audio control object with methods for managing audio recording.
 * @param {Object} isBusy - Ref object indicating if the chat is currently processing a message.
 */
export const useOnFinishChat = async (message, setPhase, audioControl, isProcessing) => {
    setPhase("assistant: processing text to speech");

    // Retrieve the AI token from local storage to authenticate the text-to-speech request.
    const aiToken = JSON.parse(localStorage.getItem("ai-token"));

    const texttospeechFormData = new FormData();
    texttospeechFormData.append("input", message.content);
    texttospeechFormData.append("token", aiToken);

    // Perform the text-to-speech API call using the message content and the retrieved AI token.
    const ttsResponse = await fetch("/api/texttospeech", {
        method: "POST",
        body: texttospeechFormData,
    });

    setPhase("assistant: playing audio");

    // Convert the response to a blob and generate a URL for the audio file.
    const audioBlob = await ttsResponse.blob();
    // Play the audio file from the generated URL.
    const audioUrl = URL.createObjectURL(audioBlob);
    await playAudio(audioUrl);

    // Start recording the next user input and mark the chat as ready for more input.
    audioControl.startRecording();
    isProcessing.current = false;

    setPhase("user: waiting for speech");
};

/**
 * Plays an audio file from a given URL and returns a promise that resolves when the audio ends.
 * @param {string} url - The URL of the audio file to play.
 * @returns {Promise} A promise that resolves when the audio playback ends.
 */
/**
 * Plays an audio file from a given URL.
 * This function creates an audio element, sets its source to the provided URL,
 * and plays the audio. It returns a promise that resolves when the audio playback ends.
 * 
 * @param {string} url - The URL of the audio file to play.
 * @returns {Promise} A promise that resolves when the audio playback ends.
 */
function playAudio(audioUrl) {
    return new Promise((resolve) => {
        // Create a new audio element and set its source to the provided URL.
        const audioElement = new Audio(audioUrl);
        // Play the audio and resolve the promise when playback ends.
        audioElement.onended = resolve;
        audioElement.play();
    });
}

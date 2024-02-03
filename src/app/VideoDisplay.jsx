/**
 * VideoDisplay Component
 * 
 * This component is responsible for displaying the live video stream during the chat session.
 * It accepts a media stream and a reference to the video element, ensuring the stream is correctly attached.
 * 
 * Props:
 * - liveStream: The live media stream to be displayed in the video component.
 * - videoRef: A React ref that is passed to the video component for direct DOM manipulation. This allows for dynamic control over the video element, such as attaching the live stream.
 * 
 * The component uses the `useEffect` hook to attach the `liveStream` to the `videoRef`'s `srcObject` property when the component mounts or when the `liveStream` prop changes. This ensures that the video element displays the current live stream.
 * 
 * The `autoPlay` attribute on the video element ensures that the video plays as soon as the stream is attached without requiring user interaction.
 */
import { useEffect } from "react";

export default function VideoDisplay({ liveStream, videoRef }) {
    useEffect(() => {
        // Attach the liveStream to the video element when the component mounts or the liveStream changes.
        if (videoRef.current && liveStream && !videoRef.current.srcObject) {
            videoRef.current.srcObject = liveStream;
        }
    }, [liveStream, videoRef]);

    return (
        <video
            ref={videoRef}
            className="h-auto w-full aspect-[4/3] object-cover rounded-[1rem] bg-gray-900"
            autoPlay
        />
    );
}

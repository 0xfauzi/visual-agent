/**
 * VideoContainer Component
 * 
 * This component serves as a container for the video display and volume indicator during recording.
 * It integrates the VideoDisplay component and dynamically adjusts the volume indicator based on the current volume level.
 * 
 * Props:
 * - liveStream: The live media stream to be displayed in the video component.
 * - videoRef: A React ref that is passed to the video component for direct DOM manipulation.
 * - audio: An object containing the state and functions related to audio recording, including whether recording is active.
 * - volumePercentage: A number representing the current volume level as a percentage, used to adjust the volume indicator.
 * 
 * The component renders a VideoDisplay component for the video feed and a visual indicator for the audio volume when recording.
 * The volume indicator's size dynamically adjusts based on the volumePercentage prop, providing visual feedback on the audio level.
 */
import React from 'react';
import VideoDisplay from "./VideoDisplay";

export default function VideoContainer({ liveStream, videoRef, audio, volumePercentage }) {
    return (
        <div className="relative">
            <VideoDisplay liveStream={liveStream} videoRef={videoRef} />
            {audio.isRecording ? (
                <div className="w-16 h-16 absolute bottom-4 left-4 flex justify-center items-center">
                    <div
                        className="w-16 h-16 bg-red-500 opacity-50 rounded-full"
                        style={{
                            transform: `scale(${Math.pow(volumePercentage, 4).toFixed(
                                4
                            )})`,
                        }}
                    ></div>
                </div>
            ) : (
                <div className="w-16 h-16 absolute bottom-4 left-4 flex justify-center items-center cursor-pointer">
                    <div className="text-5xl text-red-500 opacity-50">⏸</div>
                </div>
            )}
        </div>
    );
}

"use client";

import VideoContainer from './VideoContainer';
import AssistantMessageDisplay from "./AssistantMessageDisplay";
import ControlPanel from "./ControlPanel";
import DebugPanel from "./DebugPanel";

import { useVolumeControl } from "./useVolumeControl";
import { useOnFinishChat } from "./useOnFinishChat";
import { captureFrame } from './captureFrame';
import { useOnSpeech } from "./useOnSpeech";
import { useId, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import useSilenceAwareRecorder from "silence-aware-recorder/react";
import useMediaRecorder from "@wmik/use-media-recorder";
import { useLocalStorage } from "./use-local-storage";

const INTERVAL = 250;
const IMAGE_WIDTH = 512;
const SILENCE_DURATION = 2500;
const SILENT_THRESHOLD = -30;

const transparentPixel =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/2lXzAAAACV0RVh0ZGF0ZTpjcmVhdGU9MjAyMy0xMC0xOFQxNTo0MDozMCswMDowMEfahTAAAAAldEVYdGRhdGU6bW9kaWZ5PTIwMjMtMTAtMThUMTU6NDA6MzArMDA6MDBa8cKfAAAAAElFTkSuQmCC";


/**
 * The main Chat component that orchestrates the chat functionality.
 * It handles audio recording, video recording, speech-to-text, and image capture.
 * @returns {JSX.Element} The Chat component.
 */
export default function Chat() {
    const id = useId();
    const maxVolumeRef = useRef(0);
    const minVolumeRef = useRef(-100);
    const [displayDebug, setDisplayDebug] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [phase, setPhase] = useState("not initiated");
    const [transcription, setTranscription] = useState("");
    const [imagesGridUrl, setImagesGridUrl] = useState(null);
    const [currentVolume, setCurrentVolume] = useState(-50);
    const [volumePercentage, setVolumePercentage] = useState(0);
    const [token, setToken] = useLocalStorage("ai-token", "");
    const [lang, setLang] = useLocalStorage("lang", "");
    const isBusy = useRef(false);
    const screenshotsRef = useRef([]);
    const videoRef = useRef();
    const canvasRef = useRef();

    const audio = useSilenceAwareRecorder({
        onDataAvailable: (data) => onSpeech(data, append),
        onVolumeChange: setCurrentVolume,
        silenceDuration: SILENCE_DURATION,
        silentThreshold: SILENT_THRESHOLD,
        minDecibels: -100,
    });

    let { liveStream, ...video } = useMediaRecorder({
        recordScreen: false,
        blobOptions: { type: "video/webm" },
        mediaStreamConstraints: { audio: false, video: true },
    });

    function startRecording() {
        audio.startRecording();
        video.startRecording();

        setIsStarted(true);
        setPhase("user: waiting for speech");
    }

    function stopRecording() {
        document.location.reload();
    }

    const onSpeech = useOnSpeech({ audio, isBusy, setPhase, setTranscription, setImagesGridUrl, screenshotsRef, lang });

    const { messages, append, reload, isLoading } = useChat({
        id,
        body: {
            id,
            token,
            lang,
        },
        onFinish: (message) => useOnFinishChat(message, setPhase, audio, isBusy),
    });

    useEffect(() => {
        const intervalId = setInterval(() => captureFrame(videoRef, canvasRef, screenshotsRef, IMAGE_WIDTH), INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [video.status, audio.isRecording]);

    useVolumeControl(audio, currentVolume, setCurrentVolume, setVolumePercentage, maxVolumeRef, minVolumeRef);

    const lastAssistantMessage = messages
        .filter((it) => it.role === "assistant")
        .pop();

    return (
        <>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="antialiased w-screen h-screen p-4 flex flex-col justify-center items-center bg-black">
                <div className="w-full h-full sm:container sm:h-auto grid grid-rows-[auto_1fr] grid-cols-[1fr] sm:grid-cols-[2fr_1fr] sm:grid-rows-[1fr] justify-content-center bg-black">
                    <VideoContainer
                        liveStream={liveStream}
                        videoRef={videoRef}
                        audio={audio}
                        volumePercentage={volumePercentage}
                    />
                    <AssistantMessageDisplay lastAssistantMessage={lastAssistantMessage} isLoading={isLoading} />
                </div>
                <ControlPanel
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    reload={reload}
                    setDisplayDebug={setDisplayDebug}
                    setToken={setToken}
                    setLang={setLang}
                    token={token}
                    lang={lang}
                    isStarted={isStarted}
                />
            </div>
            <DebugPanel
                displayDebug={displayDebug}
                setDisplayDebug={setDisplayDebug}
                phase={phase}
                transcription={transcription}
                imagesGridUrl={imagesGridUrl}
                transparentPixel={transparentPixel}
            />
        </>
    );
}

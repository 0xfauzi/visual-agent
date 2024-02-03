/**
 * ControlPanel Component
 * 
 * This component renders the control panel for the chat application. It includes buttons to start and stop the session,
 * regenerate the session, toggle the debug panel, and input fields for the OpenAI API key and optional language code.
 * 
 * Props:
 * - startRecording: Function to start the recording session.
 * - stopRecording: Function to stop the recording session.
 * - reload: Function to regenerate the session.
 * - setDisplayDebug: Function to toggle the visibility of the debug panel.
 * - setToken: Function to update the OpenAI API key stored in local storage.
 * - setLang: Function to update the language code stored in local storage.
 * - token: The current OpenAI API key.
 * - lang: The current language code.
 * - isStarted: Boolean indicating whether the session has started.
 */
import { useState } from "react";

/**
 * Renders the control panel with session control buttons, OpenAI API key input, and language code input.
 * 
 * The panel allows the user to start or stop the recording session, regenerate the session, toggle the debug panel,
 * and set the OpenAI API key and language code for the session.
 */
export default function ControlPanel({ startRecording, stopRecording, reload, setDisplayDebug, setToken, setLang, token, lang, isStarted }) {
    return (
        <div className="flex flex-wrap justify-center p-4 opacity-50 gap-2">
            {isStarted ? (
                <button
                    className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
                    onClick={stopRecording}
                    title="Stop the current session"
                >
                    Stop session
                </button>
            ) : (
                <button
                    className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
                    onClick={startRecording}
                    title="Start a new session"
                >
                    Start session
                </button>
            )}
            <button
                className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
                onClick={() => reload()}
                title="Regenerate the session"
            >
                Regenerate
            </button>
            <button
                className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
                onClick={() => setDisplayDebug((p) => !p)}
                title="Toggle the visibility of the debug panel"
            >
                Debug
            </button>
            <input
                type="password"
                className="px-4 py-2 bg-gray-700 rounded-md"
                value={token}
                placeholder="OpenAI API key"
                onChange={(e) => setToken(e.target.value)}
                title="Input for the OpenAI API key"
            />
            <input
                className="px-4 py-2 bg-gray-700 rounded-md"
                value={lang}
                placeholder="Optional language code"
                onChange={(e) => setLang(e.target.value)}
                title="Input for the optional language code"
            />
        </div>
    );
}

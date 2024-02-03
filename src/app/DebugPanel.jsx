/**
 * DebugPanel Component
 * Displays debugging information including the current phase, transcription, and image captures.
 * 
 * Props:
 * - displayDebug: Boolean indicating whether the debug panel is visible.
 * - setDisplayDebug: Function to toggle the visibility of the debug panel.
 * - phase: Current phase of the chat session.
 * - transcription: Latest transcription text.
 * - imagesGridUrl: URL of the image grid to display.
 * - transparentPixel: Data URL for a transparent pixel, used as a fallback.
 * 
 * The component renders a panel with sections for phase, transcription, and image captures.
 * It uses conditional rendering to show or hide based on the `displayDebug` prop.
 * The close button allows toggling the debug panel's visibility.
 */
export default function DebugPanel({ displayDebug, setDisplayDebug, phase, transcription, imagesGridUrl, transparentPixel }) {
    return (
        <div
            className={`bg-[rgba(20,20,20,0.8)] backdrop-blur-xl p-8 rounded-sm absolute left-0 top-0 bottom-0 transition-all w-[75vw] sm:w-[33vw] ${displayDebug ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            <button
                className="absolute z-10 top-4 right-4 opacity-50 cursor-pointer"
                onClick={() => setDisplayDebug(false)}
                aria-label="Close Debug Panel"
            >
                ⛌
            </button>
            <div className="space-y-8">
                <div className="space-y-2">
                    <h2 className="font-semibold opacity-50">Phase:</h2>
                    <p>{phase}</p>
                </div>
                <div className="space-y-2">
                    <h2 className="font-semibold opacity-50">Transcript:</h2>
                    <p>{transcription || "--"}</p>
                </div>
                <div className="space-y-2">
                    <h2 className="font-semibold opacity-50">Captures:</h2>
                    <img
                        className="object-contain w-full border border-gray-500"
                        alt="Captured Images Grid"
                        src={imagesGridUrl || transparentPixel}
                    />
                </div>
            </div>
        </div>
    );
}

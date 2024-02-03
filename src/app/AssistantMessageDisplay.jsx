/**
 * AssistantMessageDisplay Component
 * 
 * This component is responsible for displaying the latest message from the assistant.
 * It also shows a loading animation when a new message is being processed.
 * 
 * Props:
 * - lastAssistantMessage: The most recent message object from the assistant. It should contain a `content` property.
 * - isLoading: A boolean indicating whether the assistant is currently processing a message.
 * 
 * The component conditionally renders the content of the last assistant message or a loading animation based on the `isLoading` prop.
 */
export default function AssistantMessageDisplay({ lastAssistantMessage, isLoading }) {
    return (
        <div className="flex items-center justify-center p-12 text-md leading-relaxed relative">
            {lastAssistantMessage?.content}
            {isLoading && (
                <div className="absolute left-50 top-50 w-8 h-8 ">
                    <div className="w-6 h-6 -mr-3 -mt-3 rounded-full bg-cyan-500 animate-ping" />
                </div>
            )}
        </div>
    );
}

## Overview
![image](https://github.com/0xfauzi/visual-agent/assets/5702728/8dfff751-1701-4a65-a609-463ffcc6169e)

This is a demonstration of audio-visual user interactions with AI assistants, much like the Google Gemini demo. It captures video and audio, converts speech to text, processes the video as individual frames, and generates responses through text-to-speech output, simulating a conversation.

## Application Flow
- **Video + Audio Capture:** The application begins by capturing both video and audio inputs.
- **Screenshots and Transcription:** Video frames are processed as screenshots while audio is transcribed to text.
- **AI Processing:** Both visual and textual inputs are analyzed by the GPT-4 Vision Model, which then generates a contextual response.
- **Response Generation:** The AI's response is converted from text to speech, providing the user with audible feedback.

## Key Features
- **Audio-Visual Input Processing:** Captures video and audio simultaneously, leveraging these inputs for dynamic interaction.
- **Speech-to-Text Transcription:** Utilizes OpenAI's Whisper to accurately transcribe user speech.
- **AI-Driven Image Analysis:** Uses the GPT-4 Vision Model to understand and interpret visual information from the captured video frames.
- **Interactive AI Responses:** Generates spoken responses using text-to-speech (TTS-1)

## Demo
*todo*

## Running locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

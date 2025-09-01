
// A placeholder for your actual ElevenLabs API Key.
// IMPORTANT: Do not commit your real API key to version control.
// Use environment variables or a secure key management solution in a real application.
const ELEVENLABS_API_KEY = "04433434433443434"; // Replace with your key

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // A default voice, e.g., 'Rachel'

const API_BASE_URL = "https://api.elevenlabs.io/v1";

/**
 * Converts speech from an audio blob to text using ElevenLabs API.
 * @param {Blob} audioBlob The audio data to transcribe.
 * @returns {Promise<string>} The transcribed text.
 */
export async function speechToText(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    
    try {
        const response = await fetch(`${API_BASE_URL}/speech-to-text`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`ElevenLabs STT API Error: ${response.status} ${errorBody}`);
        }

        const result = await response.json();
        return result.text || '';
    } catch (error) {
        console.error("Error in speechToText service:", error);
        throw new Error("Failed to transcribe audio.");
    }
}

/**
 * Converts text to speech using ElevenLabs API and returns an audio blob.
 * @param {string} text The text to convert to speech.
 * @returns {Promise<Blob>} A blob containing the speech audio.
 */
export async function textToSpeech(text: string): Promise<Blob> {
    const payload = {
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Accept': 'audio/mpeg',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`ElevenLabs TTS API Error: ${response.status} ${errorBody}`);
        }
        
        const audioBlob = await response.blob();
        return audioBlob;

    } catch (error) {
        console.error("Error in textToSpeech service:", error);
        throw new Error("Failed to generate speech.");
    }
}
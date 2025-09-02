
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speechToText, textToSpeech } from '../services/elevenLabsService';
import { XIcon, PauseIcon, PlayIcon } from './icons';
import { Chat, GoogleGenAI } from "@google/genai";

interface SiloLiveViewProps {
  onExit: () => void;
  ai: GoogleGenAI;
}

type Status = 'idle' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'error';

const SiloLiveView: React.FC<SiloLiveViewProps> = ({ onExit, ai }) => {
    const [status, setStatus] = useState<Status>('idle');
    const [isPaused, setIsPaused] = useState(true); // Start in a paused state
    const [error, setError] = useState<string | null>(null);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const chatSessionRef = useRef<Chat | null>(null);
    const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Forward declarations for useCallback dependencies
    let processAudio: () => Promise<void>;
    let stopListening: (stopAndDiscard?: boolean) => void;

    const startListening = useCallback(async () => {
        if (status === 'listening') return;
        setError(null);
        setStatus('idle');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                     if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
                     audioChunksRef.current.push(event.data);
                     silenceTimeoutRef.current = setTimeout(() => stopListening(false), 1000);
                }
            };
            
            mediaRecorderRef.current.onstop = () => processAudio();

            audioChunksRef.current = [];
            mediaRecorderRef.current.start(250);
            setStatus('listening');
        } catch (err) {
            console.error("Microphone access denied:", err);
            setError("Microphone permission is required for Silo Live.");
            setStatus('error');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    processAudio = useCallback(async () => {
        if (audioChunksRef.current.length === 0) {
            if(!isPaused) startListening();
            return;
        }

        setStatus('processing');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];

        try {
            const userText = await speechToText(audioBlob);
            if (!userText.trim()) {
                if(!isPaused) startListening();
                return;
            }
            setStatus('thinking');
            const response = await chatSessionRef.current?.sendMessage({ message: userText });
            if (!response || !response.text) {
                throw new Error("No response from AI");
            }
            const modelText = response.text;
            const modelAudioBlob = await textToSpeech(modelText);
            const audioUrl = URL.createObjectURL(modelAudioBlob);
            if (audioPlayerRef.current) {
                audioPlayerRef.current.src = audioUrl;
                audioPlayerRef.current.play();
                setStatus('speaking');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unknown error occurred.');
            setStatus('error');
        }
    }, [isPaused, startListening]);

    stopListening = useCallback((stopAndDiscard = false) => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.onstop = stopAndDiscard ? null : processAudio;
            mediaRecorderRef.current.stop();
        } else if (!stopAndDiscard && audioChunksRef.current.length > 0) {
            processAudio();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, [processAudio]);
    
    useEffect(() => {
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are Silo Live, a conversational AI. Respond in very short, concise sentences. Keep your answers brief and to the point, like in a real, fast-paced conversation. Do not use markdown.",
                thinkingConfig: { thinkingBudget: 0 } 
            },
        });
        
        audioPlayerRef.current = new Audio();

        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current = null;
            }
        };
    }, [ai]);

    useEffect(() => {
        if (audioPlayerRef.current) {
            const handleAudioEnd = () => {
                if (!isPaused) {
                    startListening();
                } else {
                    setStatus('idle');
                }
            };
            audioPlayerRef.current.addEventListener('ended', handleAudioEnd);
            return () => audioPlayerRef.current?.removeEventListener('ended', handleAudioEnd);
        }
    }, [isPaused, startListening]);

    const handlePauseToggle = () => {
        if (isPaused) {
            setIsPaused(false);
            startListening();
        } else {
            setIsPaused(true);
            stopListening(true);
            if(audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current.src = '';
            }
            setStatus('idle');
        }
    };

    const handleEnd = () => {
        stopListening(true);
        onExit();
    };

    const getImageAnimationClass = () => {
        if (isPaused) return 'shadow-gray-400/30';
        switch (status) {
            case 'listening': return 'shadow-lg shadow-indigo-400/80 ring-4 ring-indigo-300 ring-offset-4 animate-pulse';
            case 'processing':
            case 'thinking': return 'shadow-lg shadow-yellow-400/80 ring-4 ring-yellow-300 ring-offset-4 animate-pulse';
            case 'speaking': return 'shadow-lg shadow-green-400/80 ring-4 ring-green-300 ring-offset-4';
            case 'error': return 'shadow-lg shadow-red-500/80 ring-4 ring-red-400';
            default: return 'shadow-gray-400/30';
        }
    }

    return (
        <div className="fixed inset-0 bg-white text-gray-800 flex flex-col items-center justify-between p-4 sm:p-8 z-50 animate-in fade-in duration-300">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mt-4 sm:mt-8">SiLo Live</h1>

            <div className="flex-grow flex items-center justify-center w-full">
                <div className="relative">
                    <img
                        src="https://i.ibb.co/LhNrwSYr/IMG-3657.png"
                        alt="Silo Live Visualizer"
                        className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover transition-all duration-500 ${getImageAnimationClass()}`}
                    />
                    {error && <p className="absolute bottom-[-3rem] w-full text-center text-red-500">{error}</p>}
                </div>
            </div>

            <div className="flex items-center gap-8 mb-4 sm:mb-8">
                <button
                    onClick={handlePauseToggle}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label={isPaused ? "Start" : "Pause"}
                >
                    {isPaused ? <PlayIcon className="w-8 h-8 sm:w-10 sm:h-10" /> : <PauseIcon className="w-8 h-8 sm:w-10 sm:h-10" />}
                </button>

                <button
                    onClick={handleEnd}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="End Session"
                >
                    <XIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                </button>
            </div>
        </div>
    );
};

export default SiloLiveView;

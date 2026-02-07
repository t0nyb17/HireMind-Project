"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Mic, Phone, PhoneOff, Clock, User, Bot, Loader2, Square, Send, Shield, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger,AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { ViolationWarningModal } from '@/components/interview/violation-warning-modal';
import { requestMediaAccess, getDetailedErrorMessage } from '@/lib/media-utils';

interface ConversationEntry {
  role: 'user' | 'ai';
  text: string;
}

export default function RealInterviewSessionPage({ params }: { params: { applicationId: string } }) {
    const router = useRouter();
    const [interviewContext, setInterviewContext] = useState<any>(null);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(15 * 60);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [conversation, setConversation] = useState<ConversationEntry[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [violations, setViolations] = useState(0);
    const [showViolationModal, setShowViolationModal] = useState(false);
    const MAX_VIOLATIONS = 5;

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        const fetchContext = async () => {
            try {
                const res = await fetch(`/api/applications/interview-context/${params.applicationId}`);
                const data = await res.json();
                if (!data.success) throw new Error('Failed to fetch interview context');
                setInterviewContext(data.data);
            } catch (error) {
                alert('Error: Could not load interview details.');
                router.push('/candidate/applications');
            }
        };
        fetchContext();
    }, [params.applicationId, router]);

    // Define endInterview before useEffect hooks that depend on it
    const endInterview = useCallback(async (status?: string) => {
        setIsInterviewStarted(false);
        if(isRecording) mediaRecorderRef.current?.stop();
        stream?.getTracks().forEach(track => track.stop());
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        speechSynthesis.cancel();
        
        // Defensive: if this was invoked as an event handler, avoid serializing the event
        const finalStatus = typeof status === 'string' ? status : undefined;
        const serializableConversation = conversation.map(c => ({ role: c.role, text: String(c.text) }));

        fetch('/api/interview/analyze', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ applicationId: params.applicationId, jobRole: interviewContext?.jobRole, conversation: serializableConversation, status: finalStatus }) }).catch(console.error);
        await fetch('/api/applications/complete-interview', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ applicationId: params.applicationId, status: finalStatus }) });
        
        router.push(`/candidate/interview/${params.applicationId}/completed`);
    }, [isRecording, stream, conversation, interviewContext, params.applicationId, router]);

    useEffect(() => {
        if (isInterviewStarted && timeRemaining > 0) {
            timerIntervalRef.current = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
        } else if (timeRemaining <= 0 && isInterviewStarted) {
            endInterview();
        }
        return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
    }, [isInterviewStarted, timeRemaining, endInterview]);

    useEffect(() => {
        scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }, [conversation]);



    // Anti-cheating: Visibility API (tab switching detection)
    useEffect(() => {
        if (!isInterviewStarted) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isInterviewStarted) {
                setViolations(prev => {
                    const newViolations = prev + 1;
                    setShowViolationModal(true);
                    
                    if (newViolations >= MAX_VIOLATIONS) {
                        setTimeout(() => {
                            endInterview('Failed due to security violations');
                        }, 2000);
                    }
                    return newViolations;
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isInterviewStarted, endInterview]);

    // Anti-cheating: Disable cheat shortcuts
    useEffect(() => {
        if (!isInterviewStarted) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Alt+Tab, Cmd+Tab (Windows/Mac)
            if ((e.altKey && e.key === 'Tab') || (e.metaKey && e.key === 'Tab')) {
                e.preventDefault();
                e.stopPropagation();
                setViolations(prev => {
                    const newViolations = prev + 1;
                    setShowViolationModal(true);
                    
                    if (newViolations >= MAX_VIOLATIONS) {
                        setTimeout(() => {
                            endInterview('Failed due to security violations');
                        }, 2000);
                    }
                    return newViolations;
                });
                return false;
            }

            // Prevent Ctrl+C / Cmd+C (Copy)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Prevent Ctrl+V / Cmd+V (Paste)
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Prevent Ctrl+X / Cmd+X (Cut)
            if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Prevent PrintScreen
            if (e.key === 'PrintScreen' || (e.key === 'F13' && e.shiftKey)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Prevent F12 (Developer Tools)
            if (e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Prevent Ctrl+Shift+I / Cmd+Option+I (Developer Tools)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('contextmenu', handleContextMenu, true);
        document.addEventListener('copy', handleCopy, true);
        document.addEventListener('paste', handlePaste, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('contextmenu', handleContextMenu, true);
            document.removeEventListener('copy', handleCopy, true);
            document.removeEventListener('paste', handlePaste, true);
        };
    }, [isInterviewStarted, endInterview]);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsAiTyping(true);
        utterance.onend = () => setIsAiTyping(false);
        speechSynthesis.speak(utterance);
    };

    const getNextQuestion = async (currentConversation: ConversationEntry[]) => {
        setIsAiTyping(true);
        try {
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: interviewContext.candidateName, ...interviewContext, conversationHistory: currentConversation.map(c => ({ role: c.role, text: String(c.text) })) }),
            });
            const result = await response.json();
            const aiResponse = result.question;
            setConversation(prev => [...prev, { role: 'ai', text: aiResponse }]);
            speak(aiResponse);
        } catch (error) {
            speak("I'm sorry, I encountered an error.");
        }
    };

    const startInterview = async () => {
        setIsInterviewStarted(true);
        
        // Request media access first (separate from fullscreen)
        const mediaResult = await requestMediaAccess();
        
        if (mediaResult.error) {
            setIsInterviewStarted(false);
            alert(getDetailedErrorMessage(mediaResult.error));
            return;
        }

        try {
            // Set up media stream
            setStream(mediaResult.stream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaResult.stream;
            }

            // Mark interview as started in backend
            try {
                await fetch('/api/applications/start-interview', { 
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({ applicationId: params.applicationId }) 
                });
            } catch (apiError) {
                console.error('Failed to update interview status:', apiError);
                // Continue even if API call fails
            }

            // Start the interview
            getNextQuestion([]);
        } catch (error: any) {
            console.error('Error starting interview:', error);
            setIsInterviewStarted(false);
            
            // Clean up stream if something went wrong
            if (mediaResult.stream) {
                mediaResult.stream.getTracks().forEach(track => track.stop());
            }
            
            alert(`Error starting interview: ${error.message || 'Unknown error'}. Please try again.`);
        }
    };

    const handleSendTextAnswer = () => {
        if (!textInput.trim()) return;
        const newConversation = [...conversation, { role: 'user' as const, text: textInput }];
        setConversation(newConversation);
        setTextInput("");
        getNextQuestion(newConversation);
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
        } else if (stream && stream.active) {
            try {
                // Check if stream is still active
                const videoTracks = stream.getVideoTracks();
                const audioTracks = stream.getAudioTracks();
                
                if (videoTracks.length === 0 && audioTracks.length === 0) {
                    alert('Camera and microphone are no longer available. Please refresh the page and try again.');
                    return;
                }
                
                // Check if MediaRecorder is supported
                if (!window.MediaRecorder) {
                    alert('Your browser does not support audio recording. Please use a modern browser.');
                    return;
                }
                
                // FIX: Let the browser choose the mimeType for better compatibility
                mediaRecorderRef.current = new MediaRecorder(stream);
                
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if(event.data.size > 0) {
                        audioChunksRef.current.push(event.data)
                    }
                };
                
                mediaRecorderRef.current.onstop = async () => {
                    setIsRecording(false);
                    setIsTranscribing(true);
                    
                    if (audioChunksRef.current.length === 0) {
                        setIsTranscribing(false);
                        speak("I didn't hear anything. Could you please try again?");
                        return;
                    }
                    
                    try {
                        const mimeType = audioChunksRef.current[0].type || 'audio/webm';
                        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                        audioChunksRef.current = [];
                        
                        const formData = new FormData();
                        formData.append('audio', audioBlob, 'recording.webm');
                        
                        const res = await fetch('/api/interview/transcribe', { method: 'POST', body: formData });
                        
                        if (!res.ok) {
                            throw new Error(`Transcription failed: ${res.statusText}`);
                        }
                        
                        const data = await res.json();
                        if (!data.success || !data.transcription) {
                            throw new Error(data.error || "Empty transcription");
                        }
                        
                        const newConversation = [...conversation, { role: 'user' as const, text: data.transcription }];
                        setConversation(newConversation);
                        getNextQuestion(newConversation);
                    } catch (error: any) {
                        console.error('Transcription error:', error);
                        speak("Sorry, I couldn't quite catch that. Could you please repeat?");
                    } finally {
                        setIsTranscribing(false);
                    }
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);

            } catch (error: any) {
                console.error("Failed to start MediaRecorder:", error);
                let errorMessage = "Could not start recording. ";
                
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    errorMessage += "Microphone permission was denied. Please allow microphone access in your browser settings.";
                } else if (error.name === 'NotFoundError') {
                    errorMessage += "No microphone found. Please connect a microphone and try again.";
                } else if (error.name === 'NotReadableError') {
                    errorMessage += "Microphone is being used by another application. Please close other applications and try again.";
                } else {
                    errorMessage += "Please ensure your microphone is connected and permissions are allowed.";
                }
                
                alert(errorMessage);
                setIsRecording(false);
            }
        } else if (!stream) {
            alert('Camera and microphone are not available. Please refresh the page and grant permissions.');
        } else if (!stream.active) {
            alert('Camera and microphone connection was lost. Please refresh the page and try again.');
        }
    };

    const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    if (!interviewContext) return <div className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    const remainingWarnings = MAX_VIOLATIONS - violations;

    return (
        <div
            ref={containerRef}
            className="flex h-[calc(100vh-8rem)] w-full p-4 gap-4 bg-background"
            onContextMenu={(e) => e.preventDefault()}
        >
            <ViolationWarningModal 
                open={showViolationModal} 
                violationCount={violations} 
                maxViolations={MAX_VIOLATIONS}
                onClose={() => setShowViolationModal(false)}
            />
            <div className="flex flex-col flex-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-4">
                    <Card className="flex flex-col items-center justify-center p-4 bg-muted/30"><Avatar className="w-24 h-24 mb-4"><AvatarImage src="https://placehold.co/128x128/222/fff?text=AI" /></Avatar><h3 className="text-xl font-semibold">HireMind AI</h3><p className="text-muted-foreground">{interviewContext.jobRole}</p>{isAiTyping && <div className="mt-2 text-sm text-blue-400">Speaking...</div>}</Card>
                    <Card className="relative overflow-hidden bg-black flex items-center justify-center"><video ref={videoRef} className="w-full h-full object-cover" muted autoPlay playsInline /><div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{interviewContext.candidateName}</div></Card>
                </div>
                <div className="flex justify-center items-center gap-4 p-2 bg-card rounded-full border">
                     {!isInterviewStarted ? (
                        <Button size="lg" className="rounded-full w-48" onClick={startInterview}><Phone className="h-5 w-5 mr-2" />Start Interview</Button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Button
                                size="lg"
                                className={`rounded-full w-48 transition-colors ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                onClick={handleToggleRecording}
                                disabled={isAiTyping || isTranscribing}
                            >
                                {isRecording ? <Square className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                                {isRecording ? 'Stop Speaking' : 'Speak Answer'}
                            </Button>
                            <div className="flex items-center gap-2 text-lg font-semibold font-mono"><Clock className="h-5 w-5 text-primary" />{formatTime(timeRemaining)}</div>
                            <AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="destructive" className="rounded-full"><PhoneOff className="h-5 w-5" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={endInterview}>End Interview</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div>
                    )}
                </div>
            </div>
            <Card className="w-full md:w-1/3 flex flex-col">
                <CardHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-center flex-1">Interview Transcript</CardTitle>
                            {isInterviewStarted && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-xs font-semibold">
                                    <Shield className="h-3 w-3" />
                                    Secure Session Active
                                </div>
                            )}
                        </div>
                        {isInterviewStarted && (
                            <div className="flex items-center justify-center gap-2 text-xs">
                                <AlertTriangle className={`h-3 w-3 ${remainingWarnings <= 2 ? 'text-red-500' : remainingWarnings <= 3 ? 'text-yellow-500' : 'text-green-500'}`} />
                                <span className="text-muted-foreground">
                                    Remaining Allowed Warnings: <span className={`font-semibold ${remainingWarnings <= 2 ? 'text-red-500' : remainingWarnings <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>{remainingWarnings}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto">
                    <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {conversation.map((entry, index) => (<div key={index} className={`flex items-start gap-3 ${entry.role === 'user' ? 'justify-end' : ''}`}>{entry.role === 'ai' && <Avatar className="w-8 h-8"><AvatarFallback><Bot /></AvatarFallback></Avatar>}<div className={`rounded-lg px-4 py-2 max-w-[80%] ${entry.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><p className="text-sm">{entry.text}</p></div>{entry.role === 'user' && <Avatar className="w-8 h-8"><AvatarFallback><User /></AvatarFallback></Avatar>}</div>))}
                            {isTranscribing && <div className="flex justify-end"><div className="rounded-lg px-4 py-2 bg-primary/80 text-primary-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div></div>}
                        </div>
                    </ScrollArea>
                    <div className="flex items-center gap-2 border-t pt-4">
                        <Input placeholder="Type your answer..." value={textInput} onChange={(e) => setTextInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendTextAnswer()} disabled={!isInterviewStarted || isAiTyping || isRecording || isTranscribing} />
                        <Button size="icon" onClick={handleSendTextAnswer} disabled={!isInterviewStarted || isAiTyping || isRecording || isTranscribing || !textInput.trim()}><Send className="h-4 w-4" /></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
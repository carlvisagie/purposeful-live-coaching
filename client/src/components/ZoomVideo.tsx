import { useEffect, useRef, useState } from "react";
import ZoomVideo from "@zoom/videosdk";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare } from "lucide-react";

interface ZoomVideoProps {
  sessionName: string;
  token: string;
  userName: string;
  onLeave?: () => void;
}

/**
 * ZOOM VIDEO SDK COMPONENT
 * 
 * Integrates Zoom Video SDK for live coaching sessions
 * Handles video/audio streams, controls, and session management
 */
export function ZoomVideoComponent({ sessionName, token, userName, onLeave }: ZoomVideoProps) {
  const clientRef = useRef<typeof ZoomVideo | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initZoom = async () => {
      try {
        // Initialize Zoom client
        const client = ZoomVideo.createClient();
        clientRef.current = client;

        // Join session
        await client.join(sessionName, token, userName);
        setIsInSession(true);

        // Start video
        const stream = client.getMediaStream();
        if (videoContainerRef.current) {
          await stream.startVideo({
            videoElement: videoContainerRef.current.querySelector("video") as HTMLVideoElement,
          });
        }

        // Start audio
        await stream.startAudio();
      } catch (err) {
        console.error("Zoom initialization error:", err);
        setError(err instanceof Error ? err.message : "Failed to join session");
      }
    };

    initZoom();

    return () => {
      // Cleanup on unmount
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, [sessionName, token, userName]);

  const toggleMute = async () => {
    if (!clientRef.current) return;

    try {
      const stream = clientRef.current.getMediaStream();
      if (isMuted) {
        await stream.unmuteAudio();
      } else {
        await stream.muteAudio();
      }
      setIsMuted(!isMuted);
    } catch (err) {
      console.error("Toggle mute error:", err);
    }
  };

  const toggleVideo = async () => {
    if (!clientRef.current) return;

    try {
      const stream = clientRef.current.getMediaStream();
      if (isVideoOff) {
        await stream.startVideo({
          videoElement: videoContainerRef.current?.querySelector("video") as HTMLVideoElement,
        });
      } else {
        await stream.stopVideo();
      }
      setIsVideoOff(!isVideoOff);
    } catch (err) {
      console.error("Toggle video error:", err);
    }
  };

  const leaveSession = async () => {
    if (!clientRef.current) return;

    try {
      await clientRef.current.leave();
      setIsInSession(false);
      onLeave?.();
    } catch (err) {
      console.error("Leave session error:", err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative" ref={videoContainerRef}>
        <video
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        {isVideoOff && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white">👤</span>
              </div>
              <p className="text-white font-medium">{userName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant={isMuted ? "destructive" : "secondary"}
            className="rounded-full w-14 h-14"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            size="lg"
            variant={isVideoOff ? "destructive" : "secondary"}
            className="rounded-full w-14 h-14"
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-14 h-14"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>

          <Button
            size="lg"
            variant="destructive"
            className="rounded-full w-16 h-16"
            onClick={leaveSession}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            {isInSession ? "Session in progress" : "Connecting..."}
          </p>
        </div>
      </div>
    </div>
  );
}

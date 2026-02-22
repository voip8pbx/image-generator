import { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaPaperclip, FaTimes } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { GoogleGenAI } from "@google/genai";
import Spinner from "./components/Spinner";
import Antigravity from "./components/uicompo/AntiGravity";

export default function GeminiTextToImage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hello! I'm your AI image generation assistant. Describe any image you'd like me to create, or upload an image and I'll help you edit it!",
      image: null,
      timestamp: new Date(),
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Changed to true for more reliable recognition
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started successfully");
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        console.log("Speech recognition result received");
        let interimTranscript = "";
        let hasFinalResult = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            console.log("Final transcript:", transcript);
            setPrompt((prev) => prev + (prev ? " " : "") + transcript);
            hasFinalResult = true;
          } else {
            interimTranscript += transcript;
            console.log("Interim transcript:", interimTranscript);
          }
        }

        // Auto-stop after getting final result (with small delay for natural flow)
        if (hasFinalResult && recognitionRef.current) {
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              try {
                recognitionRef.current.stop();
                console.log("Auto-stopping after final result");
              } catch (e) {
                console.log("Already stopped");
              }
            }
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error details:", {
          error: event.error,
          message: event.message,
        });
        setIsListening(false);

        // Provide user-friendly error messages
        let errorMessage = "";
        switch (event.error) {
          case "not-allowed":
          case "permission-denied":
            errorMessage = "❌ Microphone permission denied!\n\nPlease:\n1. Click the 🔒 lock icon in your browser's address bar\n2. Allow microphone access\n3. Refresh the page and try again";
            break;
          case "no-speech":
            // Don't show alert for no-speech, just log it
            console.log("No speech detected, stopping...");
            return;
          case "audio-capture":
            errorMessage = "❌ No microphone detected!\n\nPlease:\n1. Connect a microphone\n2. Check if it's working in your system settings\n3. Try again";
            break;
          case "network":
            errorMessage = "❌ Connection issue!\n\nThis could be:\n1. Internet connection problem\n2. Microphone permission issue\n3. Browser security settings\n\nTry:\n- Check your internet connection\n- Allow microphone permissions\n- Use Chrome or Edge browser\n- Make sure you're on HTTPS or localhost";
            break;
          case "aborted":
            // Don't show alert for aborted, user stopped it
            console.log("Speech recognition aborted");
            return;
          default:
            errorMessage = `❌ Speech recognition error: ${event.error}\n\nPlease try again or check your browser console for details.`;
        }

        if (errorMessage) {
          alert(errorMessage);
        }
      };
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log("Cleanup: Recognition already stopped");
        }
      }
    };
  }, []);

  // Check if running on HTTPS or localhost
  useEffect(() => {
    const isSecureContext = window.isSecureContext;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isSecureContext && !isLocalhost) {
      console.warn("⚠️ Speech Recognition requires HTTPS or localhost!");
      console.warn("Current URL:", window.location.href);
    } else {
      console.log("✅ Running in secure context - Speech Recognition available");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage({
        data: event.target?.result,
        name: file.name,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      console.log("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted!");
      // Stop the stream immediately as we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      alert("❌ Microphone Access Denied!\n\nPlease allow microphone access:\n1. Click the 🔒 lock icon in your browser's address bar\n2. Set 'Microphone' to 'Allow'\n3. Refresh the page and try again\n\nError: " + error.message);
      return false;
    }
  };

  const toggleMicrophone = async () => {
    if (!recognitionRef.current) {
      alert("❌ Speech Recognition is not supported in your browser.\n\nPlease use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
        console.log("Stopping speech recognition...");
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
        setIsListening(false);
      }
    } else {
      // Request microphone permission first
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        return;
      }

      try {
        console.log("Starting speech recognition...");
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);

        // Check if it's because recognition is already started
        if (error.message && error.message.includes("already started")) {
          console.log("Recognition already started, stopping and restarting...");
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              recognitionRef.current.start();
            }, 100);
          } catch (e) {
            console.error("Failed to restart:", e);
            setIsListening(false);
          }
        } else {
          alert("❌ Failed to start microphone.\n\nPlease:\n1. Check microphone permissions\n2. Ensure you're using HTTPS or localhost\n3. Try refreshing the page\n\nError: " + error.message);
          setIsListening(false);
        }
      }
    }
  };

  const generateImage = async () => {
    if (!prompt.trim() && !attachedImage) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      text: prompt,
      image: attachedImage?.data || null,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    removeAttachedImage();
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!API_KEY) throw new Error("API key is missing");

      const ai = new GoogleGenAI({ apiKey: API_KEY });

      // Build the prompt with image if attached
      let contents = [];

      if (attachedImage) {
        // If there's an attached image, add it first
        const base64Image = attachedImage.data.split(",")[1]; // Remove data:image/png;base64, prefix
        contents.push({
          inlineData: {
            mimeType: attachedImage.mimeType,
            data: base64Image,
          },
        });
      }

      // Add the text prompt
      if (prompt.trim()) {
        contents.push({ text: prompt });
      } else if (attachedImage) {
        // If only image is attached, use a default prompt
        contents.push({
          text: "Edit or modify this image as requested",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: contents,
      });

      console.log("Generation response:", response);

      // Extract image data and text from response
      let imageData = null;
      let textResponse = "";

      const candidates = response.candidates || [];
      for (const candidate of candidates) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData.data;
          } else if (part.text) {
            textResponse += part.text;
          }
        }
      }

      if (!imageData && !textResponse) {
        throw new Error("No response from model");
      }

      // Add assistant response to chat
      const assistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        text: textResponse || "Image generated successfully!",
        image: imageData ? `data:image/png;base64,${imageData}` : null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error generating image:", err);

      // Add error message to chat
      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        text: `Error: ${err.message || "Something went wrong"}`,
        image: null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 opacity-40">
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#3B82F6"
          autoAnimate
          rotationSpeed={0.1}
          pulseSpeed={3}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90" />

      {/* Header */}
      <div className="relative z-10 border-b border-blue-500/20 bg-black/70 backdrop-blur-xl p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Image Generator Chat
          </h1>
          <p className="text-blue-400/60 text-sm mt-1">
            Chat with AI to generate or edit images
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-md lg:max-w-xl ${message.role === "user"
                  ? "bg-blue-600/40 border border-blue-500/50"
                  : "bg-black/40 border border-blue-500/30"
                  } rounded-2xl px-4 py-3 backdrop-blur-sm`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Chat"
                    className="rounded-xl max-h-80 w-full object-cover shadow-lg mb-2"
                  />
                )}
                {message.text && (
                  <p className="text-white text-sm">{message.text}</p>
                )}
                <p className="text-blue-400/50 text-xs mt-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-black/40 border border-blue-500/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <div className="p-4">
                  <Spinner />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Attached Image Preview */}
      {attachedImage && (
        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 pb-4">
          <div className="relative inline-block">
            <img
              src={attachedImage.data}
              alt="Attached"
              className="rounded-lg max-h-64 border border-blue-500/50 bg-black/40"
            />
            <button
              onClick={removeAttachedImage}
              className="absolute top-2 right-2 p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="relative z-10 sticky bottom-0 w-full p-4 bg-black/70 backdrop-blur-xl border-t border-blue-500/20">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-black/80 border border-blue-500/30 rounded-2xl px-4 py-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          {/* Attach */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:text-blue-300 transition flex-shrink-0"
            title="Attach image"
          >
            <FaPaperclip size={18} />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageAttach}
            className="hidden"
          />

          {/* Input */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              attachedImage
                ? "Describe how to edit this image..."
                : "Describe the image you want to generate..."
            }
            className="flex-1 bg-transparent outline-none text-blue-100 placeholder-blue-400/60"
            onKeyDown={(e) => e.key === "Enter" && !loading && generateImage()}
            disabled={loading}
          />

          {/* Mic */}
          <button
            onClick={toggleMicrophone}
            className={`transition flex-shrink-0 ${isListening
              ? "text-red-500 animate-pulse"
              : "text-blue-400 hover:text-blue-300"
              }`}
            title={isListening ? "Stop recording" : "Start voice input"}
          >
            <FaMicrophone size={18} />
          </button>

          {/* Send Icon */}
          <button
            onClick={generateImage}
            disabled={loading || (!prompt.trim() && !attachedImage)}
            className="ml-2 p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black hover:scale-110 transition shadow-[0_0_15px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

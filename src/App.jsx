import { useState } from "react";
import { FaMicrophone, FaPaperclip } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Spinner from "./components/Spinner"; 
import Antigravity from './components/uicompo/AntiGravity';

export default function GeminiTextToImage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: { sampleCount: 1 }
          })
        }
      );

      const data = await res.json();
      const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

      if (!base64Image) throw new Error("No image returned");

      setImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">

      {/* Background */}
      <div className="absolute inset-0 opacity-80">
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Image Area */}
        <div className="flex-1 flex items-center justify-center px-4">
          {loading && (
            <div className="p-6 rounded-full bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.8)]">
              <Spinner />
            </div>
          )}

          {!loading && error && <p className="text-red-400">{error}</p>}

          {!loading && image && (
            <img
              src={image}
              alt="Generated"
              className="max-h-[420px] rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.6)]"
            />
          )}

          {!loading && !image && !error && (
            <p className="text-blue-400/60">Your generated image will appear here</p>
          )}
        </div>

        {/* Bottom Input Bar */}
        <div className="sticky bottom-0 w-full p-4 bg-black/70 backdrop-blur-xl border-t border-blue-500/20">
          <div className="max-w-3xl mx-auto flex items-center gap-3 bg-black/80 border border-blue-500/30 rounded-2xl px-4 py-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]">

            {/* Attach */}
            <button className="text-blue-400 hover:text-blue-300 transition">
              <FaPaperclip size={18} />
            </button>

            {/* Input */}
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="flex-1 bg-transparent outline-none text-blue-100 placeholder-blue-400"
              onKeyDown={(e) => e.key === "Enter" && generateImage()}
            />

            {/* Mic */}
            <button className="text-blue-400 hover:text-blue-300 transition">
              <FaMicrophone size={18} />
            </button>

            {/* Send Icon */}
            <button
              onClick={generateImage}
              className="ml-2 p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black hover:scale-110 transition shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            >
              <IoSend size={18} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

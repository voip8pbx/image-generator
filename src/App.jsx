import { useState } from "react";
import Spinner from "./components/Spinner"; 


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
            instances: [
              { prompt }
            ],
            parameters: {
              sampleCount: 1
            }
          })
        }
      );

      const data = await res.json();
      const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

      if (!base64Image) throw new Error("No image returned from Gemini");

      setImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-100 to-rose-100 p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white/70 backdrop-blur-xl shadow-2xl p-8 border border-orange-200">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Gemini AI Image Generator
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Describe anything and watch it come alive ✨
        </p>

        <div className="mt-6 flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city at sunset, ultra realistic..."
            className="flex-1 rounded-xl border border-orange-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={generateImage}
            className="rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 font-semibold hover:scale-105 transition-transform"
          >
            Generate
          </button>
        </div>

        <div className="mt-8 min-h-[300px] flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-rose-50 border border-dashed border-orange-300">
          {loading && <Spinner />}

          {!loading && error && (
            <p className="text-red-500 font-medium">{error}</p>
          )}

          {!loading && image && (
            <img
              src={image}
              alt="Generated"
              className="rounded-xl shadow-lg max-h-[400px] object-contain"
            />
          )}

          {!loading && !image && !error && (
            <p className="text-gray-400">Your generated image will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}

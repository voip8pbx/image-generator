# Satendra Image Generator Chat

A powerful AI-powered image generation and editing application built with React, Vite, and Google's Gemini AI.

## 🌟 Features

- **Text-to-Image Generation**: Generate stunning images from text descriptions using the Gemini 2.5 Flash model.
- **Image Editing**: Upload an existing image and describe changes to edit or modify it.
- **Voice Input**: Integrated speech recognition to dictate your prompts for a hands-free experience.
- **Modern UI**: Sleek dark mode interface with "Antigravity" particle background effects, glassmorphism design, and responsive layout.
- **Real-time Chat Interface**: Interactive chat-style experience to track your generation history.

## 🚀 Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini AI](https://ai.google.dev/) (`@google/genai`)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Animations**: Custom particle effects using HTML5 Canvas (`Antigravity` component)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   > **Note**: You can get an API key from [Google AI Studio](https://aistudio.google.com/).

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 📖 Usage

1. **Generate Image**: Type a description in the input box (e.g., "A futuristic city under a purple sky") and hit Send.
2. **Edit Image**: Click the paperclip icon to attach an image, then type instructions (e.g., "Make the sky blue") and send.
3. **Voice Command**: Click the microphone icon and speak your prompt. Click again to stop or wait for auto-detection.

## 📦 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run lint`: Lint the codebase.
- `npm run preview`: Preview the production build locally.

---
*Built with ❤️ using React & Gemini AI*

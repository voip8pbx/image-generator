# 🎨 AI Image Generator

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

A premium, interactive AI-powered image generation and editing platform built with **React**, **Vite**, and **Google's Gemini AI**. Experience the future of creativity with voice commands, multi-language support, and a stunning 3D-infused interface.

---

## ✨ Key Features

### 🚀 Advanced Image Generation
- **Text-to-Image:** Describe anything, and watch Gemini bring it to life with high-quality visual synthesis.
- **Image Editing:** Upload an existing image and provide instructions to modify, enhance, or completely transform it.

### 🎙️ Voice Intelligence (Mic Support)
- **Hands-Free Control:** Integrated Web Speech API allows you to dictate your prompts.
- **Real-time Recognition:** Experience low-latency voice-to-text processing directly in the chat bar.

### 🌍 Multi-Language Support
- **Global Reach:** The underlying Gemini engine identifies and processes prompts in dozens of world languages.
- **Seamless Interaction:** Communicate with the AI in your native tongue for more precise creative control.

### 🌌 Immersive User Experience
- **Anti-Gravity UI:** A sleek, dark-themed interface featuring a dynamic 3D particle system powered by Three.js.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
- **Real-time Chat:** Intuitive messaging interface with loading states and message history.

---

## �️ Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS 4
- **AI Engine:** Google Generative AI (Gemini 2.5 Flash-Image)
- **3D Graphics:** Three.js, @react-three/fiber
- **Icons:** React Icons

---

## 🚦 Getting Started

Follow these steps to get your local development environment up and running.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/))

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/voip8pbx/AI-Image-Generator.git
cd AI-Image-Generator
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deployment

This project is optimized for **Vercel**.

### Deploy via Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts and ensure you add the `VITE_GEMINI_API_KEY` in the Vercel Dashboard under **Environment Variables**.

### Deploy via GitHub (Recommended)
1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Vercel will automatically detect Vite settings.
4. Add your `VITE_GEMINI_API_KEY` to the **Environment Variables** section in the Vercel project settings.
5. Deploy!

---

## � Usage Guide

1. **Text Prompt:** Type your description in the input field and hit enter.
2. **Voice Prompt:** Click the 🎙️ icon, speak your prompt, and watch it appear in the box.
3. **Image Edit:**
   - Click the 📎 icon to upload an image.
   - Type instructions (e.g., "Change the background to a sunset" or "Make it look like a pencil sketch").
   - Click Send.
4. **Download:** Right-click the generated image to save it to your device.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Created with ❤️ by [voip8pbx](https://github.com/voip8pbx)


# CreatorThumb AI - AI Thumbnail Generator

A production-ready application for content creators to generate and customize high-converting YouTube thumbnails.

## 🚀 Key Features
- **AI Image Generation**: Uses `gemini-2.5-flash-image` for high-quality visual assets.
- **Smart Prompts**: Pre-configured styles (Cinematic, Vibrant, Neon, etc.) tailored for engagement.
- **HD Canvas Editor**: Add text overlays, adjust visual properties (brightness, contrast, saturation).
- **History & Gallery**: Save and manage your previous creations locally.
- **HD Export**: Download final results in standard 1280x720 resolution.

## 🛠 Tech Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons.
- **AI Engine**: Google Gemini API (@google/genai).
- **Editor**: HTML5 Canvas API.
- **Storage**: LocalStorage (simulating database persistence).

## 🌍 Deployment Instructions

### Frontend (Vercel / Netlify)
1. Push this repository to GitHub.
2. Connect your repository to Vercel/Netlify.
3. **Crucial**: Add `API_KEY` to your Environment Variables in the hosting dashboard.
4. Set Build Command: `npm run build`.
5. Set Output Directory: `dist`.

### Backend (Optional Migration)
While the app currently runs as a powerful SPA, you can migrate the logic in `server.ts` to a Node.js host like **Render** or **Railway**.
1. Set up a MongoDB Atlas cluster.
2. Use the `server.ts` template to create your routes.
3. Update the frontend `geminiService.ts` to call your new API instead of the SDK directly.

## 🧪 AI Prompt Engineering
We use a layered prompt strategy:
1. **System Base**: Ensures 16:9 aspect ratio and "creator-optimized" aesthetic.
2. **Category Layer**: Adds context (e.g., "Sleek hardware" for Tech, "Extreme food close-ups" for Cooking).
3. **Style Layer**: Adds the artistic flair (e.g., "Cyberpunk neon" vs "Cinematic lighting").
4. **User Layer**: Specific topics provided by the creator.

## 📦 How to Run Locally
1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file with `API_KEY=your_gemini_api_key`.
4. Run `npm start`.

---
Built with ❤️ for the Creator Economy.

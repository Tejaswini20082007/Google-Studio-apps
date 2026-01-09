
import React, { useState, useEffect } from 'react';
// Fix: Added useParams to the import list from react-router-dom
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import EditorCanvas from './components/EditorCanvas';
import { 
  ThumbnailCategory, 
  ThumbnailStyle, 
  GeneratedThumbnail, 
  EditorState 
} from './types';
import { STYLES, CATEGORIES } from './constants';
import { generateThumbnailImage } from './services/geminiService';
import { saveThumbnail, getSavedThumbnails, deleteThumbnail } from './services/dbService';
import { Wand2, Loader2, ImagePlus, ChevronRight, X, LayoutGrid, Trash2 } from 'lucide-react';

// --- PAGES ---

const GeneratePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ThumbnailCategory>(ThumbnailCategory.TECH);
  const [selectedStyle, setSelectedStyle] = useState<ThumbnailStyle>(STYLES[0]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title) {
      setError("Please enter a video title/topic first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateThumbnailImage(title, category, selectedStyle, userPrompt);
      
      const newThumb: GeneratedThumbnail = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        prompt: userPrompt,
        title: title,
        category: category,
        createdAt: Date.now()
      };
      
      await saveThumbnail(newThumb);
      navigate(`/edit/${newThumb.id}`);
    } catch (err) {
      setError("Failed to generate thumbnail. Check your API key or try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Thumbnail Game</span>
        </h1>
        <p className="text-slate-400 text-lg">AI-powered creation for professional content creators.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-8">
        {/* Step 1: Core Topic */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <span className="bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
            VIDEO TITLE OR TOPIC
          </label>
          <input 
            type="text" 
            placeholder="e.g. How to Build a SaaS in 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Step 2: Category & Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <span className="bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
              CATEGORY
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <span className="bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
              VISUAL STYLE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    selectedStyle.id === style.id 
                      ? 'bg-slate-800 border-indigo-500 text-white' 
                      : 'bg-slate-800 border-transparent text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${style.previewColor}`} />
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional: Custom Prompt */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <span className="bg-slate-700 text-slate-300 w-6 h-6 flex items-center justify-center rounded-full text-xs">4</span>
            CUSTOM PROMPT (OPTIONAL)
          </label>
          <textarea 
            placeholder="Add specific details like 'neon red lighting', 'exploding background', etc."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 h-24 resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <X size={18} /> {error}
          </div>
        )}

        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> 
              GENERATIVE MAGIC IN PROGRESS...
            </>
          ) : (
            <>
              <Wand2 /> 
              GENERATE THUMBNAILS
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const EditPage = () => {
  // Fix: Used useParams hook directly instead of incorrect Router.useParams()
  const { id } = useParams();
  const [thumb, setThumb] = useState<GeneratedThumbnail | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  useEffect(() => {
    const all = getSavedThumbnails();
    const found = all.find(t => t.id === id);
    if (found) {
      setThumb(found);
      setEditorState({
        imageUrl: found.url,
        overlays: [],
        filter: 'none',
        brightness: 100,
        contrast: 100,
        saturation: 100
      });
    }
  }, [id]);

  if (!editorState) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
      <p className="text-slate-400">Loading your canvas...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Editor: <span className="text-slate-400 font-normal">{thumb?.title}</span>
        </h2>
      </div>
      <EditorCanvas 
        editorState={editorState} 
        onUpdate={setEditorState} 
      />
    </div>
  );
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const [thumbs, setThumbs] = useState<GeneratedThumbnail[]>([]);

  useEffect(() => {
    setThumbs(getSavedThumbnails());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteThumbnail(id);
    setThumbs(getSavedThumbnails());
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My History</h1>
          <p className="text-slate-400">Your previously generated AI assets.</p>
        </div>
        <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-lg text-indigo-400 flex items-center gap-2">
          <LayoutGrid size={20} />
          <span className="font-bold">{thumbs.length} Saved</span>
        </div>
      </div>

      {thumbs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
          <ImagePlus size={64} className="mx-auto text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No thumbnails yet</h3>
          <p className="text-slate-500 mb-6">Start by creating your first AI thumbnail!</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Create Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {thumbs.map(thumb => (
            <div 
              key={thumb.id}
              onClick={() => navigate(`/edit/${thumb.id}`)}
              className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={thumb.url} 
                  alt={thumb.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white text-black font-bold rounded-lg flex items-center gap-2">
                    Open Editor <ChevronRight size={18} />
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={(e) => handleDelete(thumb.id, e)}
                    className="p-2 bg-black/60 hover:bg-red-600 text-white rounded-lg backdrop-blur-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold truncate mb-1">{thumb.title}</h4>
                <div className="flex items-center justify-between">
                   <span className="text-xs text-indigo-400 font-medium px-2 py-0.5 bg-indigo-400/10 rounded-full">
                    {thumb.category}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(thumb.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- APP COMPONENT ---

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/edit/:id" element={<EditPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-950 border-t border-slate-900 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
               <div className="bg-indigo-600 p-1 rounded">
                <LayoutGrid className="text-white" size={16} />
              </div>
              <span className="font-bold text-white">CreatorThumb AI</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              Professional-grade thumbnails powered by Gemini 2.5. Designed for YouTubers, streamers, and content creators.
            </p>
            <div className="flex justify-center gap-8 text-xs font-medium text-slate-600">
              <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Discord</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;


import React, { useRef, useEffect, useState } from 'react';
// Fix: Removed THUMBNAIL_WIDTH and THUMBNAIL_HEIGHT from types import as they are defined in constants.ts
import { TextOverlay, EditorState } from '../types';
// Fix: Added import for THUMBNAIL_WIDTH and THUMBNAIL_HEIGHT from constants.ts
import { THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT } from '../constants';
import { Download, Type, Move, Plus, Trash2, Sliders } from 'lucide-react';

interface EditorCanvasProps {
  editorState: EditorState;
  onUpdate: (state: EditorState) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ editorState, onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = editorState.imageUrl;
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply image filters
      ctx.filter = `brightness(${editorState.brightness}%) contrast(${editorState.contrast}%) saturate(${editorState.saturation}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      // Draw text overlays
      editorState.overlays.forEach(overlay => {
        ctx.save();
        ctx.font = `bold ${overlay.fontSize}px ${overlay.fontFamily}`;
        ctx.fillStyle = overlay.color;
        ctx.strokeStyle = overlay.strokeColor;
        ctx.lineWidth = overlay.strokeWidth;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw stroke
        if (overlay.strokeWidth > 0) {
          ctx.strokeText(overlay.text, overlay.x, overlay.y);
        }
        // Draw main text
        ctx.fillText(overlay.text, overlay.x, overlay.y);
        
        // Highlight selected
        if (overlay.id === selectedOverlayId) {
          ctx.strokeStyle = '#4f46e5';
          ctx.lineWidth = 2;
          const metrics = ctx.measureText(overlay.text);
          const padding = 10;
          const w = metrics.width + padding * 2;
          const h = overlay.fontSize + padding;
          ctx.strokeRect(overlay.x - w/2, overlay.y - h/2, w, h);
        }
        ctx.restore();
      });
    };
  }, [editorState, selectedOverlayId]);

  const addText = () => {
    const newOverlay: TextOverlay = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'NEW TEXT',
      x: THUMBNAIL_WIDTH / 2,
      y: THUMBNAIL_HEIGHT / 2,
      fontSize: 80,
      color: '#ffffff',
      fontFamily: 'Oswald',
      strokeColor: '#000000',
      strokeWidth: 4
    };
    onUpdate({ ...editorState, overlays: [...editorState.overlays, newOverlay] });
    setSelectedOverlayId(newOverlay.id);
  };

  const removeText = () => {
    if (!selectedOverlayId) return;
    onUpdate({
      ...editorState,
      overlays: editorState.overlays.filter(o => o.id !== selectedOverlayId)
    });
    setSelectedOverlayId(null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'youtube-thumbnail.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const updateSelectedOverlay = (updates: Partial<TextOverlay>) => {
    if (!selectedOverlayId) return;
    onUpdate({
      ...editorState,
      overlays: editorState.overlays.map(o => o.id === selectedOverlayId ? { ...o, ...updates } : o)
    });
  };

  const selectedOverlay = editorState.overlays.find(o => o.id === selectedOverlayId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Canvas Area */}
      <div className="flex-1">
        <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <canvas 
            ref={canvasRef} 
            width={THUMBNAIL_WIDTH} 
            height={THUMBNAIL_HEIGHT}
            className="w-full h-full object-contain cursor-crosshair"
            onClick={(e) => {
              // Basic hit detection could be added here for dragging
              // For simplicity, we use the sidebar controls
            }}
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
           <div className="flex gap-2">
            <button 
              onClick={addText}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
            >
              <Plus size={18} /> Add Text
            </button>
            <button 
              onClick={removeText}
              disabled={!selectedOverlayId}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-all"
            >
              <Trash2 size={18} /> Remove
            </button>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-bold shadow-lg"
          >
            <Download size={20} /> Download HD
          </button>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="w-full lg:w-80 space-y-6">
        {/* Visual Adjustments */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
            <Sliders size={16} /> IMAGE ADJUSTMENTS
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Brightness: {editorState.brightness}%</label>
              <input 
                type="range" min="50" max="200" value={editorState.brightness}
                onChange={(e) => onUpdate({...editorState, brightness: parseInt(e.target.value)})}
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Contrast: {editorState.contrast}%</label>
              <input 
                type="range" min="50" max="200" value={editorState.contrast}
                onChange={(e) => onUpdate({...editorState, contrast: parseInt(e.target.value)})}
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Saturation: {editorState.saturation}%</label>
              <input 
                type="range" min="50" max="200" value={editorState.saturation}
                onChange={(e) => onUpdate({...editorState, saturation: parseInt(e.target.value)})}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Text Styling */}
        {selectedOverlay && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
              <Type size={16} /> TEXT STYLING
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Content</label>
                <input 
                  type="text" value={selectedOverlay.text}
                  onChange={(e) => updateSelectedOverlay({ text: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 block mb-1">Color</label>
                  <input 
                    type="color" value={selectedOverlay.color}
                    onChange={(e) => updateSelectedOverlay({ color: e.target.value })}
                    className="w-full h-10 bg-slate-800 border border-slate-700 rounded p-1 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 block mb-1">Stroke</label>
                  <input 
                    type="color" value={selectedOverlay.strokeColor}
                    onChange={(e) => updateSelectedOverlay({ strokeColor: e.target.value })}
                    className="w-full h-10 bg-slate-800 border border-slate-700 rounded p-1 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Font Size: {selectedOverlay.fontSize}px</label>
                <input 
                  type="range" min="20" max="300" value={selectedOverlay.fontSize}
                  onChange={(e) => updateSelectedOverlay({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">X Pos</label>
                  <input 
                    type="number" value={Math.round(selectedOverlay.x)}
                    onChange={(e) => updateSelectedOverlay({ x: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Y Pos</label>
                  <input 
                    type="number" value={Math.round(selectedOverlay.y)}
                    onChange={(e) => updateSelectedOverlay({ y: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedOverlayId && editorState.overlays.length > 0 && (
          <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs italic">
            Select an existing text box on the canvas or via the overlay list to edit its properties.
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;


import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Ghost } from 'lucide-react';
import { speak } from '../../services/geminiService';

const SYMBOLS_POOL = ['👁️', '💀', '🕯️', '🐍', '🌙', '🗝️', '🔮', '🃏', '🕸️', '🍄', '🦇', '🔥', '🌀', '🧪', '📜', '🎭', '🐺', '🪐', '⚔️', '💎'];

interface SymbolNode {
  icon: string;
  id: number;
}

export const HauntedGallery: React.FC = () => {
  const [step, setStep] = useState(0);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [grid, setGrid] = useState<SymbolNode[]>([]);
  const [instruction, setInstruction] = useState("Gaze into the gallery. Choose a symbol and lock its image in your mind.");
  const [revealMode, setRevealMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const initGrid = () => {
    const shuffled = [...SYMBOLS_POOL].sort(() => Math.random() - 0.5).slice(0, 9);
    setGrid(shuffled.map((icon, id) => ({ icon, id })));
    setRevealMode(false);
  };

  useEffect(() => {
    initGrid();
    // Speak initial instruction
    const startSpeech = async () => {
      setIsSpeaking(true);
      await speak("Look at the symbols in the gallery. Choose one and fix your gaze upon it. Let the image burn into your mind.");
      setIsSpeaking(false);
    };
    startSpeech();
  }, []);

  const handleNext = async () => {
    const nextStep = step + 1;
    setIsSpeaking(true);
    let nextInstruction = "";

    switch (nextStep) {
      case 1:
        nextInstruction = "Slide your mind to the nearest corner. Whether fate moves you to a new image or keeps you anchored, this symbol is now your true destiny. Lock it in.";
        break;
      case 2:
        nextInstruction = "The White Roads are appearing. In your mind, move exactly 3 times along these glowing paths. Up, down, left, or right. Never diagonally.";
        break;
      case 3:
        setEliminated([0, 2, 6, 8]);
        nextInstruction = "The corner rooms have collapsed into shadow. Only the inner corridors remain. Move exactly 2 more times through the pathways.";
        break;
      case 4:
        nextInstruction = "The air grows cold as the spirits narrow the search. Move one final time to a symbol directly adjacent to your current position.";
        break;
      case 5:
        setEliminated([0, 1, 2, 3, 5, 6, 7, 8]);
        nextInstruction = `The ritual is complete. Every path has led back to the source. You are standing on the ${grid[4]?.icon}.`;
        setRevealMode(true);
        break;
      default:
        nextInstruction = instruction;
    }

    setInstruction(nextInstruction);
    setStep(nextStep);
    await speak(nextInstruction);
    setIsSpeaking(false);
  };

  const reset = async () => {
    setStep(0);
    setEliminated([]);
    initGrid();
    const resetText = "The vision fades. Clear your mind and we shall begin again.";
    setInstruction(resetText);
    setIsSpeaking(true);
    await speak(resetText);
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 text-center max-w-md mx-auto select-none">
      <div className="flex items-center gap-2 mb-2">
        <Ghost className="text-indigo-400 animate-pulse" size={24} />
        <h2 className="text-3xl gold-text">The Haunted Gallery</h2>
      </div>
      
      <div className="glass-card p-6 rounded-3xl w-full border-indigo-500/20 shadow-xl relative overflow-hidden mb-4 min-h-[160px] flex items-center justify-center">
        {isSpeaking && (
          <div className="absolute top-4 right-4 flex gap-1 items-end h-3">
            <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite]"></div>
            <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_0.1s]"></div>
            <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_0.2s]"></div>
          </div>
        )}
        
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Sparkles size={32} className="text-indigo-400" />
        </div>
        <p className="text-lg text-indigo-100 italic leading-relaxed font-serif">
          "{instruction}"
        </p>
      </div>

      <div className="relative w-full aspect-square max-w-[340px] p-4 bg-[#050507] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5">
        <svg 
          className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-1000 z-0
            ${step >= 2 ? 'opacity-100' : 'opacity-0 scale-95'}
          `} 
          viewBox="0 0 100 100"
        >
          <defs>
            <filter id="roadGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <g stroke="white" strokeWidth="0.8" strokeLinecap="round" filter="url(#roadGlow)" className="transition-opacity duration-1000">
            <line x1="18" y1="50" x2="82" y2="50" strokeDasharray="1, 3" className={`transition-opacity duration-700 ${step >= 3 ? 'opacity-100' : 'opacity-30'}`} />
            <line x1="50" y1="18" x2="50" y2="82" strokeDasharray="1, 3" className={`transition-opacity duration-700 ${step >= 3 ? 'opacity-100' : 'opacity-30'}`} />
          </g>

          <g stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" filter="url(#roadGlow)" className="animate-pulse">
            <line x1="18" y1="50" x2="82" y2="50" strokeDasharray="4 12" />
            <line x1="50" y1="18" x2="50" y2="82" strokeDasharray="4 12" />
          </g>
        </svg>

        <div className="grid grid-cols-3 gap-4 h-full relative z-10">
          {grid.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center text-4xl rounded-2xl transition-all duration-700 aspect-square border
                ${eliminated.includes(idx) 
                  ? 'opacity-0 scale-50 rotate-45 blur-xl pointer-events-none border-transparent' 
                  : 'opacity-100 scale-100 shadow-lg bg-indigo-950/40 border-white/5 backdrop-blur-sm'
                }
                ${revealMode && idx === 4 
                  ? 'ring-4 ring-yellow-500 ring-offset-4 ring-offset-[#050507] scale-125 z-20 bg-indigo-800 shadow-[0_0_80px_rgba(234,179,8,0.5)] border-yellow-400' 
                  : ''
                }
              `}
            >
              <span className={`transition-transform duration-500 ${revealMode && idx === 4 ? 'scale-110' : ''}`}>
                {s.icon}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-6">
        {step < 5 ? (
          <button
            disabled={isSpeaking}
            onClick={handleNext}
            className="group w-full py-5 bg-indigo-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 active:scale-95 border-b-4 border-indigo-800 disabled:opacity-50 disabled:grayscale"
          >
            {isSpeaking ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">The Oracle is Speaking...</span>
              </span>
            ) : (
              <>
                {step === 0 ? "My thought is chosen" : "I have moved my mind"}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-1000">
            <div className="p-6 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 backdrop-blur-md">
              <p className="text-sm gold-text font-bold uppercase tracking-[0.3em] mb-2">The Revelation</p>
              <p className="text-2xl text-white font-serif italic">
                You were guided to the {grid[4]?.icon}.
              </p>
            </div>
            <button
              onClick={reset}
              disabled={isSpeaking}
              className="flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-white transition-colors py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-30"
            >
              <RefreshCw size={12} /> Clear the vision
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-4 items-center justify-center">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 transition-all duration-500 rounded-full ${step >= i ? 'bg-indigo-400 w-6 shadow-[0_0_10px_#818cf8]' : 'bg-gray-800 w-1.5'}`}
          />
        ))}
      </div>
    </div>
  );
};

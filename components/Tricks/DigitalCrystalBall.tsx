
import React, { useState, useRef } from 'react';
import { getMagicalPatter } from '../../services/geminiService';

export const DigitalCrystalBall: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [patter, setPatter] = useState("Focus on a color and a number from 1 to 10. Say them aloud when the ball glows.");
  
  const startRitual = async () => {
    setIsRecording(true);
    setPatter("Listening to the vibrations of your soul...");
    
    // Simulate audio processing delay
    setTimeout(async () => {
      setIsRecording(false);
      setLoading(true);
      
      const res = await getMagicalPatter("Crystal Ball", "User has spoken their thought. Reveal a 'psychic impression' of a card (e.g. 7 of Hearts). Randomize the result.");
      setPrediction(res);
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-10 p-6">
      <h2 className="text-2xl gold-text">Vocal Psychometry</h2>
      
      <div className="relative group">
        <div className={`w-48 h-48 rounded-full transition-all duration-1000 flex items-center justify-center relative z-10 
          ${isRecording ? 'bg-indigo-600 shadow-[0_0_60px_rgba(79,70,229,0.8)] scale-110' : 'bg-gray-900 border-4 border-indigo-900 shadow-[0_0_30px_rgba(79,70,229,0.2)]'}
          ${loading ? 'animate-pulse' : ''}
        `}>
          {loading ? (
            <div className="text-indigo-200 animate-bounce">✨</div>
          ) : isRecording ? (
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-1 h-8 bg-white rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          ) : (
            <div className="text-indigo-500/50 text-xs text-center px-4 uppercase tracking-tighter">Place finger or speak</div>
          )}
        </div>
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-3xl scale-150"></div>
      </div>

      <div className="text-center max-w-sm">
        {!prediction ? (
          <>
            <p className="text-gray-400 mb-6 italic">{patter}</p>
            <button
              onClick={startRitual}
              disabled={isRecording || loading}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-700 to-purple-800 font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              Begin Attunement
            </button>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <p className="text-indigo-200 text-lg mb-6 leading-relaxed">"{prediction}"</p>
             <button
              onClick={() => { setPrediction(null); setPatter("Focus your mind once more..."); }}
              className="text-gray-500 hover:text-white"
            >
              Reset the Ball
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw, Zap, Sparkles, Layers } from 'lucide-react';
import { speak } from '../../services/geminiService';

const STEPS = [
  {
    title: "Gathering the Aces",
    instruction: "Grab a deck of cards and take out the four aces and lay them on the table.",
  },
  {
    title: "The Foundation",
    instruction: "Shuffle the remaining deck, then count off exactly 16 cards into a pile. Put the rest of the deck away.",
  },
  {
    title: "The Inversion",
    instruction: "Take your 4 Aces and lose them—face up—into the 16 face-down cards. You now have the glowing face-up, while the others face the shadows, face down.",
  },
  {
    title: "Mixing the Chaos",
    instruction: "Give the cards an overhand shuffle. Mix them thoroughly. The face-up and face-down cards are now becoming one. Chaos is taking hold.",
  },
  {
    title: "The Great Partition",
    instruction: "Count exactly 10 cards into a pile on the table. Set the remaining 10 cards beside them. Leave a small gap between these two pillars of cards.",
  },
  {
    title: "The Mirror Flip",
    instruction: "Choose either pile. It does not matter which. Pick it up, turn the entire pile upside down, and place it back where it was.",
  },
  {
    title: "The Bridge of Shadows",
    instruction: "Now interlace the cards. Take the top card from either pile and place it in the center. Then take the top card from the other pile and place it on top of that. Alternate until all cards are in a single stack.",
  },
  {
    title: "The Simple Sever",
    instruction: "The universe demands it's cut. Cut any amount from the top, place it on the table, and complete the cut with the remaining cards. Order is moving under the surface.",
  },
  {
    title: "The Four Quartets",
    instruction: "Deal the cards into 4 separate piles, one at a time, as if dealing a game of cards until all 20 cards are distributed. Each pile now holds 5 cards.",
  },
  {
    title: "The Binary Choice",
    instruction: "Number the piles 1, 2, 3, and 4 in your mind. Now, choose: Even or Odd? Tell the oracle your choice.",
  },
  {
    title: "The First Convergence",
    instruction: "If you chose Odd, stack piles 1 and 3 together. If you chose Even, stack 2 and 4. Stack the remaining two piles and separately. Should have 2 piles of 10 cards each.",
  },
  {
    title: "The Final Inversion",
    instruction: "Take either of the two 10-card piles. It does not matter which. Flip that entire pile upside down and place it back on top of the other.",
  },
  {
    title: "The Riffle of Entropy",
    instruction: "To create total chaos, give the cards one final riffle shuffle on the table. Push them together into a neat pile. Put your hand on top of them.",
  },
  {
    title: "The Revelation",
    instruction: "Close your eyes. Say 'Catawampus' and wave your hand. Spread the cards slowly across the table. Every card faces the shadows, except the four Aces, which alone face the light.",
  }
];

export const ChaosProtocol: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const speakInstruction = async () => {
      setIsSpeaking(true);
      await speak(STEPS[currentStep].instruction);
      setIsSpeaking(false);
    };
    speakInstruction();
  }, [currentStep]);

  const handleNext = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8 flex flex-col items-center gap-2">
        <Zap className="text-yellow-500 w-10 h-10 mb-2 animate-pulse" />
        <h2 className="text-4xl gold-text">The Chaos Protocol</h2>
        <div className="flex items-center justify-center gap-2 text-indigo-400 text-[10px] uppercase tracking-widest font-bold">
          <Layers size={14} />
          <span>Follow the oracle's voice exactly</span>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-indigo-500/10 shadow-2xl p-8 md:p-12 relative border-t-indigo-500/30">
        {/* Mobile Heartbeat Visual */}
        {isSpeaking && (
          <div className="absolute top-8 right-10 flex gap-1.5 items-end h-5">
            <div className="w-1 bg-yellow-500/80 animate-[bounce_0.8s_infinite]"></div>
            <div className="w-1 bg-yellow-500/80 animate-[bounce_0.8s_infinite_0.1s]"></div>
            <div className="w-1 bg-yellow-500/80 animate-[bounce_0.8s_infinite_0.2s]"></div>
          </div>
        )}

        <div className="flex justify-between items-center mb-10">
          <span className="text-indigo-400 font-bold tracking-[0.3em] text-[10px] uppercase bg-indigo-950/40 px-4 py-1.5 rounded-full border border-white/5">
            Protocol {currentStep + 1} / {STEPS.length}
          </span>
          <div className="h-1 w-24 bg-gray-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6 min-h-[220px]">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-white mystical-font">
            <Sparkles size={20} className="text-yellow-500" />
            {STEPS[currentStep].title}
          </h3>
          <p className="text-xl md:text-2xl text-indigo-50 italic leading-relaxed font-serif">
            "{STEPS[currentStep].instruction}"
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-12 pt-8 border-t border-white/5">
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="group w-full py-6 bg-indigo-600 rounded-2xl font-bold text-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-950/50 active:scale-95 border-b-4 border-indigo-800 flex items-center justify-center gap-3"
            >
              {isSpeaking ? (
                <span className="animate-pulse">Tap to Skip Voice</span>
              ) : (
                <>
                  {currentStep === 0 ? "Completed" : "I have done that"}
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={reset} 
              className="w-full py-6 bg-yellow-600/20 text-yellow-500 rounded-2xl font-bold text-xl hover:bg-yellow-600/30 transition-all border border-yellow-500/30 flex items-center justify-center gap-3"
            >
              <RefreshCw size={24} /> End the Protocol
            </button>
          )}

          <div className="flex justify-between items-center px-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-gray-500 hover:text-white disabled:opacity-0 transition-colors py-2 flex items-center gap-1 text-xs uppercase font-bold tracking-widest"
            >
              <ChevronLeft size={16} /> Revisit
            </button>
            <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
              Digital Grimoire v2.5
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-center px-10">
        <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] leading-relaxed">
          The chaos protocol uses entropic resonance to align your reality. Keep your intention focused.
        </p>
      </div>
    </div>
  );
};

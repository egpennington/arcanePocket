
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw, BookOpen, Sparkles } from 'lucide-react';
import { speak } from '../../services/geminiService';

const STEPS = [
  {
    title: "The Chaos Phase",
    instruction: "Grab a deck of cards and shuffle it thoroughly. Let the spirits randomize the order. Then, count out exactly 9 cards and set the rest aside. We only need nine to bridge the worlds.",
  },
  {
    title: "The Three Gates",
    instruction: "Deal those 9 cards into 3 piles of 3 cards each, face down. These represent the three gates of time: Past, Present, and Future. They will guide the path.",
  },
  {
    title: "The Secret Artifact",
    instruction: "Choose one of the piles that represent the past, the present, or the future. Pick it up and look at the card on the very bottom. Memorize it. This is your secret artifact, hidden from all eyes.",
  },
  {
    title: "The Binding",
    instruction: "Place your chosen pile ON TOP of one of the other piles. Then, place the final remaining pile ON TOP of those. Your card is now bound in the heart of the stack.",
  },
  {
    title: "The Ritual of Two",
    instruction: "Take the top two cards from your small stack and move them together to the bottom. This shifts the numeric frequency of the cards, aligning them with the hands of fate. Two cards move, yet the universe remains balanced.",
  },
  {
    title: "The Vanishing Act",
    instruction: "Now, take the new top card from your stack—a card displaced by the ritual—and bury it somewhere deep into the small stack of cards you are still holding. It has vanished from the surface, merging with the shadows of the ritual.",
  },
  {
    title: "The Spell of Value",
    instruction: "The incantations begin. Spell the value of your secret card. For example, if it was a King, spell K-I-N-G. Deal one card for each letter into a new pile. When finished, drop the remaining cards in your hand on top of that pile.",
  },
  {
    title: "The Connection",
    instruction: "Now, spell the word 'O-F'. Deal one card for each letter into a new pile. Drop the rest of the cards from your hand on top. A mystical link is forged between your thought and the cards.",
  },
  {
    title: "The Spell of Suit",
    instruction: "Spell the name of your suit. For example, S-P-A-D-E-S. Deal one card for each letter. When the word is finished, drop the rest of the cards in your hand on top of the pile.",
  },
  {
    title: "The Final Miracle",
    instruction: "The cards are in perfect alignment. You may now spell 'M-A-G-I-C'. Deal one card per letter. On the final letter 'C', stop. Turn that card over. The universe has delivered your artifact back from the void.",
  }
];

export const SelfWorkingCard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Automatically read instructions when the user moves to a new phase
  useEffect(() => {
    const speakInstruction = async () => {
      setIsSpeaking(true);
      await speak(STEPS[currentStep].instruction);
      setIsSpeaking(false);
    };
    speakInstruction();
  }, [currentStep]);

  const goToStep = (idx: number) => {
    setCurrentStep(idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl gold-text mb-2">The Automaton's Deck</h2>
        <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm italic px-4">
          <BookOpen size={16} className="shrink-0" />
          <span>Listen to the oracle's voice and follow the cards carefully.</span>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border-indigo-500/20 shadow-2xl p-8 relative">
        {/* Visual feedback for speaking */}
        {isSpeaking && (
          <div className="absolute top-6 right-8 flex gap-1 items-end h-4">
            <div className="w-1 bg-indigo-500 animate-[bounce_1s_infinite]"></div>
            <div className="w-1 bg-indigo-500 animate-[bounce_1s_infinite_0.1s]"></div>
            <div className="w-1 bg-indigo-500 animate-[bounce_1s_infinite_0.2s]"></div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase flex items-center gap-2">
            Phase {currentStep + 1} of {STEPS.length}
          </span>
          <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-700 ease-out" 
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
            <Sparkles size={22} className="text-indigo-500 animate-pulse" />
            {STEPS[currentStep].title}
          </h3>
          <p className="text-xl text-gray-300 leading-relaxed min-h-[140px] font-serif italic">
            "{STEPS[currentStep].instruction}"
          </p>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-4">
          <button
            onClick={() => goToStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || isSpeaking}
            className="flex items-center gap-2 text-gray-500 hover:text-white disabled:opacity-10 transition-colors py-2"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => goToStep(currentStep + 1)}
              disabled={isSpeaking}
              className="flex items-center gap-2 bg-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 active:scale-95 disabled:grayscale disabled:opacity-50"
            >
              I have done that <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={() => goToStep(0)} 
              disabled={isSpeaking}
              className="text-yellow-500 font-bold flex items-center gap-2 hover:text-yellow-400 transition-all py-4 px-6 border border-yellow-500/20 rounded-xl hover:bg-yellow-500/5"
            >
              <RefreshCw size={20} /> Restart the Ritual
            </button>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Digital Grimoire v2.5</p>
      </div>
    </div>
  );
};

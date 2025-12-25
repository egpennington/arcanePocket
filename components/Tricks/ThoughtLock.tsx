
import React, { useState, useEffect } from 'react';
import { speak, getThoughtLockRevelation } from '../../services/geminiService';
import { Lock, Unlock, Sparkles, RefreshCw, Key, Watch, Circle, Smartphone, PenTool, Map as MapIcon, Compass, Anchor, Moon, Sun, SquareUserRound, Gem, Flame } from 'lucide-react';

const QUESTIONS = [
  "Is your object more functional and useful than it is sentimental?",
  "Is it usually kept very close to your body, or perhaps even worn upon it?",
  "Is it something you would notice almost immediately if it were missing from your day?"
];

interface MagicItem {
  name: string;
  icon: React.ReactNode;
}

const ITEM_POOLS: MagicItem[][] = [
  // Pool 1: The Modern Pocket
  [
    { name: 'Photo', icon: <SquareUserRound size={32} /> },      // 00X (Sentimental, Not Close)
    { name: 'Ring', icon: <Circle size={32} /> },     // 01X (Sentimental, Close)
    { name: 'Pen', icon: <PenTool size={32} /> },      // 100 (Useful, Not Close, Not Noticeable)
    { name: 'Phone', icon: <Smartphone size={32} /> }, // 101 (Useful, Not Close, Noticeable)
    { name: 'Watch', icon: <Watch size={32} /> },     // 110 (Useful, Close, Not Noticeable)
    { name: 'Keys', icon: <Key size={32} /> }         // 111 (Useful, Close, Noticeable)
  ],
  // Pool 2: The Explorer's Kit
  [
    { name: 'Old Map', icon: <MapIcon size={32} /> },   // 00X
    { name: 'Locket', icon: <Anchor size={32} /> },    // 01X
    { name: 'Inkwell', icon: <Flame size={32} /> },    // 100
    { name: 'Compass', icon: <Compass size={32} /> },  // 101
    { name: 'Bracelet', icon: <Sun size={32} /> },     // 110
    { name: 'Skeleton Key', icon: <Key size={32} /> }  // 111
  ],
  // Pool 3: The Mystic's Table
  [
    { name: 'Dried Rose', icon: <Moon size={32} /> },   // 00X
    { name: 'Amulet', icon: <Gem size={32} /> },       // 01X
    { name: 'Sealing Wax', icon: <Flame size={32} /> },// 100
    { name: 'Crystal', icon: <Sparkles size={32} /> }, // 101
    { name: 'Tarot Card', icon: <SquareUserRound size={32} /> }, // 110
    { name: 'Ritual Dagger', icon: <PenTool size={32} /> } // 111
  ]
];

export const ThoughtLock: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Start, 1-3: Questions, 4: Revel
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [revelation, setRevelation] = useState<string | null>(null);
  
  // Pick a random pool on component mount or reset
  const [poolIndex, setPoolIndex] = useState(0);
  
  useEffect(() => {
    setPoolIndex(Math.floor(Math.random() * ITEM_POOLS.length));
  }, []);

  const currentPool = ITEM_POOLS[poolIndex];

  useEffect(() => {
    if (step === 0) {
      const initialSpeech = async () => {
        setIsSpeaking(true);
        await speak("Behold the gallery of shadows. Choose one to lock in your mind. Do not speak its name.  Simply picture its weight, its history, and its secret purpose. Let me know when your choice is made.");
        setIsSpeaking(false);
      };
      initialSpeech();
    }
  }, [step]);

  const startRitual = async () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setIsSpeaking(true);
    setStep(1);
    await speak(QUESTIONS[0]);
    setIsSpeaking(false);
  };

  const handleAnswer = async (val: number) => {
     if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    setIsSpeaking(true);

    if (newAnswers.length < 3) {
      setStep(newAnswers.length + 1);
      await speak(QUESTIONS[newAnswers.length]);
    } else {
      setStep(4);
      const binary = newAnswers.join("");
      
      // Dynamic Mapping Logic for 6 items
      let targetIndex = 0;
      if (binary === "111") targetIndex = 5;      // Useful, Close, Notice
      else if (binary === "110") targetIndex = 4; // Useful, Close, Not Notice
      else if (binary === "101") targetIndex = 3; // Useful, Not Close, Notice
      else if (binary === "100") targetIndex = 2; // Useful, Not Close, Not Notice
      else if (binary.startsWith("01")) targetIndex = 1; // Sentimental, Close
      else targetIndex = 0; // Sentimental, Not Close (000 or 001)

      const targetItem = currentPool[targetIndex].name;
      
      await speak("The echoes of your choice are vibrating through the Void... I see the spectral patterns of your destiny forming. Hold that image in your mind. Keep your focus pure.");
      const result = await getThoughtLockRevelation(targetItem);
      setRevelation(result);
      await speak(result);
    }
    setIsSpeaking(false);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setRevelation(null);
    setPoolIndex(Math.floor(Math.random() * ITEM_POOLS.length));
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 text-center max-w-lg mx-auto">
      <div className="flex flex-col items-center gap-2">
        {step < 4 ? <Lock className="text-yellow-500 w-12 h-12 mb-2 animate-pulse" /> : <Unlock className="text-green-500 w-12 h-12 mb-2" />}
        <h2 className="text-4xl gold-text">The Thought-Lock</h2>
      </div>

      <div className="glass-card p-10 rounded-3xl w-full border-white/5 relative overflow-hidden shadow-2xl min-h-[480px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Sparkles size={40} className="text-yellow-400" />
        </div>

        {step === 0 ? (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentPool.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="text-indigo-400 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{item.name}</span>
                </div>
              ))}
            </div>
            
            <p className="text-xl text-indigo-100 italic font-serif leading-relaxed">
              "Behold the gallery of shadows. Choose one artifact to anchor your soul. Do not speak its name."
            </p>
            
            <button
              onClick={startRitual}
              className="w-full py-6 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] transition-transform border-b-4 border-indigo-900"
            >
              {isSpeaking ? "Tap to Skip Voice" : "I Have My Thought"}
            </button>
          </div>
        ) : step <= 3 ? (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">Mental Inquiry {step}</span>
              <p className="text-2xl text-white font-serif italic leading-snug">"{QUESTIONS[step - 1]}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                
                onClick={() => handleAnswer(1)}
                 className="py-6 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl font-bold text-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
              >
                {isSpeaking ? "Skip & Yes" : "Yes"}
              </button>
              <button
                
                onClick={() => handleAnswer(0)}
                className="py-6 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl font-bold text-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
              >
                {isSpeaking ? "Skip & No" : "No"}
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'bg-yellow-500 w-8 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-800 w-2'}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-1000">
            {revelation ? (
              <>
                <div className="p-8 bg-indigo-950/60 rounded-2xl border border-indigo-500/30 shadow-inner relative">
                  <div className="absolute -top-3 -left-3">
                    <Sparkles className="text-yellow-500/50 w-8 h-8" />
                  </div>
                  <p className="text-xl text-yellow-100 italic font-serif leading-relaxed">
                    "{revelation}"
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-white transition-colors py-2 uppercase text-[10px] font-bold tracking-[0.2em]"
                >
                  <RefreshCw size={14} /> Sever the connection
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 py-12">
                 <div className="w-16 h-16 border-4 border-t-yellow-500 border-indigo-900 rounded-full animate-spin"></div>
                 <p className="text-indigo-300 animate-pulse tracking-[0.4em] uppercase text-[10px] font-bold">Parsing Cognitive Echoes...</p>
                 <button onClick={() => setIsSpeaking(false)} className="text-xs text-gray-600 underline">Still loading? Tap here.</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center px-8">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold leading-relaxed">
          The oracle senses your pulse through the glass. Keep your gaze steady.
        </p>
      </div>
    </div>
  );
};

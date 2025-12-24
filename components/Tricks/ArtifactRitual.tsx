
import React, { useState } from 'react';
import { speak, getFreeWillPrediction } from '../../services/geminiService';
import { RefreshCw, Sparkles, Pocket } from 'lucide-react';

const ITEMS = ['Key', 'Pen', 'Coin'];

export const ArtifactRitual: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const startRitual = async () => {
    setIsSpeaking(true);
    setStep(1);
    await speak("Gather three items: a key, a pen, and a coin. Place them in a row. Any order is fine. Let me know when you are ready.");
    setIsSpeaking(false);
  };

  const nextStep = async () => {
    setIsSpeaking(true);
    const nextS = step + 1;
    setStep(nextS);

    switch(nextS) {
      case 2:
        await speak("Excellent. Now, exchange the COIN with the nearest item on its right. If there is nothing on its right, leave it exactly where it is.");
        break;
      case 3:
        await speak("Next, exchange the KEY with the nearest item on its left. If there is nothing on its left, do nothing.");
        break;
      case 4:
        await speak("Now, exchange the PEN with the nearest item on its right. Again, if there is nothing on its right, keep it there.");
        break;
      case 5:
        await speak("Your artifacts are now in a pattern known only to the beyond. Pick up the item on the far left and put it in your left pocket. Do it now.");
        break;
      case 6:
        await speak("From the two remaining, pick up the smaller item. Put it in your right pocket.");
        break;
      case 7:
        await speak("Pick up the final item. This is the witness. Place it on the table in front of you.");
        break;
      case 8:
        // Use Gemini for the mystical text revelation
        const res = await getFreeWillPrediction({
          hand: "the pen on the table",
          pocket: "the key in your left pocket",
          table: "the coin in your right pocket"
        });
        setPrediction(res);
        // Vocal revelation using the specific requested phrasing
        await speak("I sense the threads of destiny. The pen is on the table so you can write about the magic... with the key in the left pocket and wealth in the right one. Exactly as was written by the hands of fate.");
        break;
    }
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 text-center max-w-lg mx-auto">
      <div className="flex flex-col items-center gap-2">
        <Pocket className="text-indigo-400 w-12 h-12 mb-2 animate-pulse" />
        <h2 className="text-3xl gold-text">The Artifact Ritual</h2>
      </div>
      
      <div className="glass-card p-10 rounded-3xl w-full border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Sparkles size={40} className="text-yellow-400" />
        </div>
        
        {step === 0 ? (
          <div className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-lg italic font-serif">
              "You will need three physical items: <span className="text-indigo-300 font-bold">a Key</span>, <span className="text-indigo-300 font-bold">a Pen</span>, and <span className="text-indigo-300 font-bold">a Coin</span>. The machine will guide your hands through the chaos."
            </p>
            <button
              onClick={startRitual}
              className="w-full py-5 bg-indigo-600 rounded-2xl font-bold text-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 active:scale-95 border-b-4 border-indigo-800"
            >
              Begin the Ritual
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-center gap-3">
               {ITEMS.map(i => (
                 <div key={i} className="px-3 py-1 bg-indigo-950/50 rounded-full text-[10px] uppercase tracking-widest text-indigo-400 border border-white/5">
                   {i}
                 </div>
               ))}
            </div>
            
            <div className="min-h-[120px] flex items-center justify-center px-4">
              {prediction ? (
                 <div className="space-y-4">
                   <p className="text-xs uppercase tracking-[0.3em] text-yellow-500/60 font-bold">The Oracle Speaks</p>
                   <p className="text-xl text-yellow-100 italic font-serif leading-relaxed">
                     "{prediction}"
                   </p>
                 </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-3 h-3 rounded-full bg-indigo-500 ${isSpeaking ? 'animate-ping' : 'opacity-20'}`}></div>
                  <p className="text-lg text-white italic font-serif">
                    {step === 8 ? "Destiny Revealed." : "Follow the voice carefully..."}
                  </p>
                </div>
              )}
            </div>

            {step < 8 ? (
              <button
                onClick={nextStep}
                disabled={isSpeaking}
                className="group w-full py-5 bg-indigo-600 rounded-2xl font-bold text-lg disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3 border-b-4 border-indigo-800 shadow-xl"
              >
                {isSpeaking ? (
                   <>
                     <div className="flex gap-1">
                       <div className="w-1 h-4 bg-white/50 animate-bounce"></div>
                       <div className="w-1 h-4 bg-white/50 animate-bounce [animation-delay:0.2s]"></div>
                       <div className="w-1 h-4 bg-white/50 animate-bounce [animation-delay:0.4s]"></div>
                     </div>
                     Listening...
                   </>
                ) : (
                  <>
                    I have done that
                    <Sparkles size={18} className="group-hover:rotate-12 transition-transform text-yellow-400" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => { setStep(0); setPrediction(null); }}
                className="flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-white transition-colors py-4 uppercase text-xs font-bold tracking-widest"
              >
                <RefreshCw size={14} /> Clear the artifacts
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-400 w-4' : 'bg-gray-800 w-1'}`}
          />
        ))}
      </div>
    </div>
  );
};

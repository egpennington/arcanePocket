
import React, { useState } from 'react';
import { getFreeWillPrediction } from '../../services/geminiService';

const ITEMS = ['Coin', 'Key', 'Pen'];

export const FreeWill: React.FC = () => {
  const [positions, setPositions] = useState<{ [key: string]: string | null }>({
    hand: null,
    pocket: null,
    table: null,
  });
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrag = (item: string, spot: string) => {
    setPositions(prev => ({
      ...prev,
      [spot]: item,
    }));
  };

  const reveal = async () => {
    if (!positions.hand || !positions.pocket || !positions.table) return;
    setLoading(true);
    const result = await getFreeWillPrediction({
      hand: positions.hand,
      pocket: positions.pocket,
      table: positions.table,
    });
    setPrediction(result);
    setLoading(false);
  };

  const reset = () => {
    setPositions({ hand: null, pocket: null, table: null });
    setPrediction(null);
  };

  const isComplete = positions.hand && positions.pocket && positions.table;

  return (
    <div className="flex flex-col items-center gap-8 p-6 text-center">
      <h2 className="text-3xl gold-text mb-2">The Oracle's Decree</h2>
      <p className="text-gray-400 mb-6 italic">Place the artifacts where your intuition guides you.</p>

      {!prediction ? (
        <div className="w-full max-w-md space-y-10">
          <div className="flex justify-center gap-6">
            {ITEMS.filter(i => !Object.values(positions).includes(i)).map(item => (
              <div
                key={item}
                className="w-16 h-16 rounded-full glass-card border-dashed border-gray-600 border flex items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors"
                onClick={() => {
                  const empty = Object.keys(positions).find(k => !positions[k]);
                  if (empty) handleDrag(item, empty);
                }}
              >
                {item === 'Coin' ? '🪙' : item === 'Key' ? '🔑' : '🖋️'}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(positions).map(spot => (
              <div
                key={spot}
                className="h-32 flex flex-col items-center justify-center glass-card rounded-xl border-2 border-transparent hover:border-indigo-500 transition-all p-2"
                onClick={() => setPositions(prev => ({ ...prev, [spot]: null }))}
              >
                <span className="text-xs uppercase tracking-widest text-indigo-400 mb-2">{spot}</span>
                <div className="text-3xl">
                  {positions[spot] === 'Coin' ? '🪙' : positions[spot] === 'Key' ? '🔑' : positions[spot] === 'Pen' ? '🖋️' : '...'}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={reveal}
            disabled={!isComplete || loading}
            className="w-full py-4 bg-indigo-600 rounded-lg font-bold shadow-lg shadow-indigo-900/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Gazing into the future..." : "Open the Sealed Prediction"}
          </button>
        </div>
      ) : (
        <div className="max-w-md p-8 glass-card border-yellow-500/30 rounded-2xl animate-in fade-in zoom-in duration-1000">
          <p className="text-xl leading-relaxed text-yellow-100 italic">"{prediction}"</p>
          <button
            onClick={reset}
            className="mt-10 text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Test destiny again
          </button>
        </div>
      )}
    </div>
  );
};

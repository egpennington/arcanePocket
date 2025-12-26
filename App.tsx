
import React, { useState } from 'react';
import { TrickType, Trick } from './types';
import { HauntedGallery } from './components/Tricks/HauntedGallery';
import { ArtifactRitual } from './components/Tricks/ArtifactRitual';
import { SelfWorkingCard } from './components/Tricks/SelfWorkingCard';
import { ChaosProtocol } from './components/Tricks/ChaosProtocol';
import { Sparkles, Brain, LayoutGrid, ScrollText, ArrowLeft, Lock, Zap } from 'lucide-react';

const TRICKS: Trick[] = [
  {
    id: TrickType.GALLERY,
    title: "Haunted Gallery",
    description: "Your movement is predicted by the ghosts of the grid.",
    icon: "LayoutGrid",
    category: "Digital"
  },
  {
    id: TrickType.CHAOS_PROTOCOL,
    title: "The Chaos Protocol",
    description: "A self-working miracle where order is born from total entropy.",
    icon: "Zap",
    category: "Physical"
  },
  {
    id: TrickType.ARTIFACTS,
    title: "The Artifact Ritual",
    description: "The universe knows exactly where your items are.",
    icon: "Brain",
    category: "Mentalism"
  },
  {
    id: TrickType.CARD_MASTER,
    title: "The Automaton's Deck",
    description: "An impossible card miracle with your own physical deck.",
    icon: "ScrollText",
    category: "Physical"
  }
];

const App: React.FC = () => {
  const [activeTrick, setActiveTrick] = useState<TrickType | null>(null);

  const renderActiveTrick = () => {
    switch (activeTrick) {
      case TrickType.GALLERY: return <HauntedGallery />;
      case TrickType.ARTIFACTS: return <ArtifactRitual />;
      case TrickType.CARD_MASTER: return <SelfWorkingCard />;
      case TrickType.CHAOS_PROTOCOL: return <ChaosProtocol />;
      default: return null;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutGrid": return <LayoutGrid className="w-8 h-8 text-indigo-400" />;
      case "Lock": return <Lock className="w-8 h-8 text-yellow-400" />;
      case "Brain": return <Brain className="w-8 h-8 text-pink-400" />;
      case "ScrollText": return <ScrollText className="w-8 h-8 text-amber-400" />;
      case "Zap": return <Zap className="w-8 h-8 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative z-10 px-6 py-12 text-center">
        {!activeTrick ? (
          <>
            <h1 className="text-5xl md:text-7xl gold-text font-bold tracking-tighter mb-4 drop-shadow-2xl">
              ARCANE POCKET
            </h1>
            <p className="text-indigo-300 tracking-[0.3em] uppercase text-sm font-semibold">
              The Digital Grimoire of Wonders
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button 
              onClick={() => setActiveTrick(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} /> Library
            </button>
            <div className="text-right">
              <span className="text-xs uppercase tracking-widest text-indigo-400">Current Ritual</span>
              <p className="text-xl font-bold mystical-font">{TRICKS.find(t => t.id === activeTrick)?.title}</p>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        {!activeTrick ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRICKS.map((trick) => (
              <button
                key={trick.id}
                onClick={() => setActiveTrick(trick.id)}
                className="group relative glass-card p-8 rounded-3xl border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all text-left flex flex-col items-start gap-4 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  {getIcon(trick.icon)}
                </div>
                <div className="mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded-full">
                    {trick.category}
                  </span>
                </div>
                {getIcon(trick.icon)}
                <h3 className="text-2xl font-bold mystical-font text-white">{trick.title}</h3>
                <p className="text-gray-400 leading-relaxed">{trick.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            {renderActiveTrick()}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

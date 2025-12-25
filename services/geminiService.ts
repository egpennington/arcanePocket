
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Fetches a short, atmospheric dialogue for a given trick and context
export const getMagicalPatter = async (trickName: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a mysterious and charismatic master magician. For the trick "${trickName}", provide a short, atmospheric 1-2 sentence dialogue for: ${context}. Keep it mystical.`,
    });
    return response.text || "The spirits are whispering...";
  } catch (error) {
    return "The spirits are whispering...";
  }
};

// Generates a mystical revelation for the Thought-Lock trick
export const getThoughtLockRevelation = async (object: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a master psychic reading a user's mind. The user is thinking of: ${object}. Do NOT simply say the object. Build a 2-sentence mysterious narrative that builds tension and finally reveals that you know they are thinking of that specific item. For example: "I see metal teeth biting into a lock... a cold jingle in your pocket... you are holding a Key in your mind."`,
    });
    return response.text || `The fog clears... I see a ${object} in your mind.`;
  } catch (error) {
    return `The spirits are hazy, but I clearly see a ${object} in your thoughts.`;
  }
};

// Generates a mystical confirmation for the Free Will trick based on item placement
export const getFreeWillPrediction = async (positions: { hand: string | null; pocket: string | null; table: string | null }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an ancient oracle. A seeker has placed three artifacts: a ${positions.hand} in their hand, a ${positions.pocket} in their pocket, and a ${positions.table} on the table. Reveal that this was exactly as written in the scrolls of fate. Provide a short, mystical 1-2 sentence confirmation of their choices.`,
    });
    return response.text || "The threads of destiny were woven exactly as I saw them.";
  } catch (error) {
    return "The threads of fate are tangled, but the outcome was foreseen.";
  }
};

/**
 * Performs Text-to-Speech using the browser's native SpeechSynthesis API.
 * Optimized for mobile
 */
export const speak = (text: string): Promise<void> => {
  return new Promise((resolve) => {

    // 1. Safety Timeout: If the voice hangs for > 12s, resolve anyway to unlock the UI.
    const safetyTimer = setTimeout(() => {
      console.warn("Speech synthesis safety timeout reached.");
      window.speechSynthesis.cancel();
      resolve();
    }, 12000);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Try to find a premium/natural sounding voice
    const preferredVoice = voices.find(v => 
      v.name.includes('Google UK English Male') || 
      v.name.includes('Daniel') ||
      v.name.includes('Arthur') ||
      v.lang === 'en-GB'
    );
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 0.85;
    utterance.rate = 0.95;
    utterance.volume = 1;

    utterance.onend = () => {
      clearTimeout(safetyTimer);
      resolve();
    };

    utterance.onerror = () => {
      clearTimeout(safetyTimer);
      resolve();
    };

    window.speechSynthesis.speak(utterance);

     // 2. Mobile "Heartbeat": iOS/Android often pause speech after 5-10 seconds of no interaction.
    // We pulse the resume command to keep the audio channel open.    
    const interval = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(interval);
      } else {
        window.speechSynthesis.resume();
      }
    }, 2000);
  });
};

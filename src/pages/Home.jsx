import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, DIFFICULTIES } from "../api/trivia";

export default function Home() {
  const navigate = useNavigate();

  const [amount,     setAmount]     = useState(5);
  const [category,   setCategory]   = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleStart = () => {
    navigate("/quiz", { state: { amount, category, difficulty } });
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-12 font-serif">

      {/* Background decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="mb-10 text-center">
          <span className="text-amber-400 text-5xl font-black tracking-tighter">trivia</span>
          <span className="text-stone-500 text-5xl font-black">.</span>
          <p className="mt-2 text-stone-500 text-sm italic tracking-wide">
            How much do you really know?
          </p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl">

          {/* Amount */}
          <div className="mb-7">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-3 font-sans">
              Questions
            </label>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setAmount(a => Math.max(1, a - 1))}
                className="w-9 h-9 rounded-full border border-stone-700 text-stone-300 text-lg flex items-center justify-center hover:border-amber-500 hover:text-amber-400 transition-colors font-sans"
              >
                −
              </button>
              <span className="text-4xl font-black text-white w-10 text-center">{amount}</span>
              <button
                onClick={() => setAmount(a => Math.min(15, a + 1))}
                className="w-9 h-9 rounded-full border border-stone-700 text-stone-300 text-lg flex items-center justify-center hover:border-amber-500 hover:text-amber-400 transition-colors font-sans"
              >
                +
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="mb-7">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-3 font-sans">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCategory(opt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all border ${
                    category === opt.id
                      ? "bg-amber-400 text-stone-950 border-amber-400"
                      : "bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-3 font-sans">
              Difficulty
            </label>
            <div className="flex gap-2">
              {DIFFICULTIES.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDifficulty(opt.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-sans font-semibold transition-all border ${
                    difficulty === opt.id
                      ? "bg-amber-400 text-stone-950 border-amber-400"
                      : "bg-transparent text-stone-400 border-stone-700 hover:border-stone-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-sans font-bold text-sm rounded-xl tracking-wide transition-colors"
          >
            Start Quiz →
          </button>
        </div>

      </div>
    </div>
  );
}
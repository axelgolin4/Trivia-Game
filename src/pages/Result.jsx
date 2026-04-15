import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { decodeHTML } from "../api/trivia";

export default function Result() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  // Redirect if accessed directly
  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, []);

  if (!state) return null;

  const { score, total, questions, answers } = state;
  const pct    = Math.round((score / total) * 100);
  const emoji  = pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "😅";
  const remark = pct >= 80 ? "Excellent!" : pct >= 50 ? "Not bad!" : "Keep practicing!";

  return (
    <div className="min-h-screen bg-stone-950 font-serif pb-16">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-700/10 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 pt-12">

        {/* Hero score */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">{emoji}</div>
          <div className="flex items-end justify-center gap-1 mb-1">
            <span className="text-7xl font-black text-white leading-none">{score}</span>
            <span className="text-3xl font-black text-stone-600 mb-2">/{total}</span>
          </div>
          <p className="text-amber-400 font-bold font-sans text-sm tracking-widest uppercase mb-1">
            {pct}% correct
          </p>
          <p className="text-stone-500 italic text-base">{remark}</p>
        </div>

        {/* Review */}
        <div className="space-y-4 mb-10">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-stone-600 font-sans mb-5">
            Review
          </h2>
          {questions.map((q, qi) => {
            const chosen  = answers[qi];
            const correct = q.correct_answer;
            const isRight = chosen === correct;

            return (
              <div
                key={qi}
                className={`rounded-xl p-4 border-l-2 ${
                  isRight
                    ? "bg-emerald-950/30 border-emerald-500"
                    : "bg-red-950/20 border-red-500"
                }`}
              >
                <p className="text-stone-200 text-sm font-semibold leading-snug mb-3">
                  {decodeHTML(q.question)}
                </p>
                <div className="flex flex-col gap-1 font-sans text-xs">
                  {!isRight && chosen && (
                    <span className="text-red-400 flex items-center gap-1.5">
                      <span className="text-base leading-none">✗</span>
                      {decodeHTML(chosen)}
                    </span>
                  )}
                  <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <span className="text-base leading-none">✓</span>
                    {decodeHTML(correct)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 rounded-xl font-sans font-semibold text-sm transition-colors"
          >
            Change Settings
          </button>
          <button
            onClick={() =>
              navigate("/quiz", {
                state: {
                  amount:     total,
                  category:   "",
                  difficulty: "",
                },
              })
            }
            className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-sans font-bold text-sm transition-colors"
          >
            Play Again →
          </button>
        </div>

      </div>
    </div>
  );
}
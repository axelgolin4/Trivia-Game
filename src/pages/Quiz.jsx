import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuestions, decodeHTML, shuffle } from "../api/trivia";

export default function Quiz() {
  const { state } = useLocation();
  const navigate   = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({}); // { questionIndex: selectedOption }
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Redirect home if navigated here without config
  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
      return;
    }

    fetchQuestions(state)
      .then(setQuestions)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Shuffle options once per question list (not on every render)
  const questionsWithOptions = useMemo(
    () => questions.map(q => ({
      ...q,
      options: shuffle([...q.incorrect_answers, q.correct_answer]),
    })),
    [questions]
  );

  const answered  = Object.keys(answers).length;
  const total     = questions.length;
  const progress  = total > 0 ? (answered / total) * 100 : 0;
  const allDone   = answered === total && total > 0;

  const handleSelect = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    const score = questionsWithOptions.reduce((acc, q, i) => {
      return answers[i] === q.correct_answer ? acc + 1 : acc;
    }, 0);

    navigate("/result", {
      state: {
        score,
        total,
        questions: questionsWithOptions,
        answers,
      },
    });
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-stone-700 border-t-amber-400 animate-spin" />
        <p className="text-stone-500 text-sm italic font-serif">Loading questions…</p>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-red-400 font-sans text-sm">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-amber-400 text-stone-950 rounded-xl font-sans font-bold text-sm"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  // ── QUIZ ──
  return (
    <div className="min-h-screen bg-stone-950 font-serif pb-32">

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-stone-950/90 backdrop-blur border-b border-stone-800">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-stone-500 hover:text-stone-300 text-sm font-sans transition-colors"
          >
            ← Back
          </button>
          <span className="text-amber-400 font-black text-lg tracking-tighter">trivia.</span>
          <span className="text-stone-500 font-sans text-sm tabular-nums">
            {answered}<span className="text-stone-700">/{total}</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-stone-800">
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Questions */}
      <main className="max-w-2xl mx-auto px-6 pt-10 space-y-10">
        {questionsWithOptions.map((q, qi) => {
          const diffColor = {
            easy:   "text-emerald-400 bg-emerald-400/10",
            medium: "text-amber-400  bg-amber-400/10",
            hard:   "text-red-400    bg-red-400/10",
          }[q.difficulty] ?? "text-stone-400 bg-stone-700/30";

          return (
            <div key={qi} className="group">
              {/* Question header */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-500/70 font-sans">
                  Q{qi + 1}
                </span>
                <span className={`text-[10px] font-bold tracking-widest uppercase font-sans px-2 py-0.5 rounded-full ${diffColor}`}>
                  {q.difficulty}
                </span>
                <span className="text-[10px] font-sans text-stone-600 truncate">
                  {decodeHTML(q.category)}
                </span>
              </div>

              {/* Question text */}
              <p className="text-white text-lg font-semibold leading-snug mb-4">
                {decodeHTML(q.question)}
              </p>

              {/* Options */}
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === opt;
                  return (
                    <button
                      key={oi}
                      onClick={() => handleSelect(qi, opt)}
                      className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all border ${
                        selected
                          ? "bg-amber-400 text-stone-950 border-amber-400"
                          : "bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200"
                      }`}
                    >
                      {decodeHTML(opt)}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              {qi < total - 1 && (
                <div className="mt-10 h-px bg-stone-800/60" />
              )}
            </div>
          );
        })}
      </main>

      {/* Floating submit bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-950/95 backdrop-blur border-t border-stone-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allDone}
            className={`px-6 py-2.5 rounded-xl font-sans font-bold text-sm transition-all ${
              allDone
                ? "bg-amber-400 hover:bg-amber-300 text-stone-950"
                : "bg-stone-800 text-stone-600 cursor-not-allowed"
            }`}
          >
            Check Answers →
          </button>
        </div>
      </div>

    </div>
  );
}
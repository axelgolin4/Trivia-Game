const BASE_URL = "https://opentdb.com/api.php";

export const CATEGORIES = [
  { id: "", label: "Any Category" },
  { id: "9",  label: "General Knowledge" },
  { id: "11", label: "Film" },
  { id: "12", label: "Music" },
  { id: "17", label: "Science & Nature" },
  { id: "18", label: "Computers" },
  { id: "21", label: "Sports" },
  { id: "23", label: "History" },
  { id: "27", label: "Animals" },
];

export const DIFFICULTIES = [
  { id: "",       label: "Any" },
  { id: "easy",   label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard",   label: "Hard" },
];


export async function fetchQuestions({ amount = 5, category = "", difficulty = "" }) {
  const params = new URLSearchParams({ amount, type: "multiple" });
  if (category)   params.append("category",   category);
  if (difficulty) params.append("difficulty",  difficulty);

  const res = await fetch(`${BASE_URL}?${params}`);

  if (!res.ok) throw new Error("Network error. Please try again.");

  const data = await res.json();

  if (data.response_code === 5) throw new Error("Too many requests. Please wait a moment.");
  if (data.response_code !== 0 || !data.results.length)
    throw new Error("No questions found for this combination. Try different settings.");

  return data.results;
}


export function decodeHTML(str) {
  const ta = document.createElement("textarea");
  ta.innerHTML = str;
  return ta.value;
}


export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
import { useState } from "react";

const SYSTEM_PROMPT = `You are a senior brand strategist and creative director. 
When given a brand description, generate exactly 3 distinct brand directions in JSON format.
Each direction must feel like a real, deployable brand — not a concept.

Return ONLY a JSON array with this structure (no markdown, no explanation):
[
  {
    "id": 1,
    "name": "Brand Name",
    "tagline": "Short memorable tagline",
    "concept": "2-3 sentences describing the brand positioning and personality.",
    "visualRules": ["Rule 1", "Rule 2", "Rule 3", "Rule 4"],
    "typography": {
      "display": "Font name + why (e.g. Freight Display — classical authority)",
      "body": "Font name + why",
      "accent": "Font name + why"
    },
    "colorLogic": {
      "primary": "#hex",
      "secondary": "#hex",
      "accent": "#hex",
      "background": "#hex",
      "rationale": "1-2 sentences explaining the color story."
    },
    "dos": ["Do 1", "Do 2", "Do 3"],
    "donts": ["Don't 1", "Don't 2", "Don't 3"],
    "applications": ["Application 1", "Application 2", "Application 3", "Application 4"]
  }
]

Make each direction dramatically different in tone, aesthetic, and strategy. 
Be specific and professional. No placeholders. Real brand thinking.`;

async function generateBrands(description) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Brand description: ${description}` }],
    }),
  });
  const data = await response.json();
  const text = data.content?.find((b) => b.type === "text")?.text || "[]";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function ColorSwatch({ hex, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0"
        style={{ backgroundColor: hex }}
      />
      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-xs font-mono text-neutral-600">{hex}</span>
    </div>
  );
}

function BrandCard({ brand, index }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "visual", "rules", "apply"];

  return (
    <div
      className="brand-card bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Header */}
      <div className="p-8 pb-6 border-b border-neutral-800">
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="text-[11px] font-mono text-neutral-600 uppercase tracking-[0.15em]">
            Direction {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            {["primary", "secondary", "accent"].map((k) => (
              <div
                key={k}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: brand.colorLogic[k] }}
                title={`${k}: ${brand.colorLogic[k]}`}
              />
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight leading-tight mb-1">
          {brand.name}
        </h2>
        <p className="text-sm text-neutral-500 italic">{brand.tagline}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-3 py-3 text-[11px] font-mono uppercase tracking-wider transition-colors ${
              tab === t
                ? "text-white border-b-2 border-white"
                : "text-neutral-600 hover:text-neutral-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-8 flex-1 flex flex-col gap-6 text-sm">
        {tab === "overview" && (
          <>
            <div>
              <p className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest mb-3">
                Concept
              </p>
              <p className="text-neutral-300 leading-relaxed">{brand.concept}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest mb-3">
                Typography
              </p>
              <div className="space-y-2">
                {Object.entries(brand.typography).map(([role, desc]) => (
                  <div key={role} className="flex gap-3">
                    <span className="text-neutral-600 w-14 flex-shrink-0 capitalize">
                      {role}
                    </span>
                    <span className="text-neutral-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "visual" && (
          <>
            <div>
              <p className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest mb-3">
                Color Logic
              </p>
              <div className="space-y-2 mb-4">
                {["primary", "secondary", "accent", "background"].map((k) => (
                  <ColorSwatch key={k} hex={brand.colorLogic[k]} label={k} />
                ))}
              </div>
              <p className="text-neutral-500 text-xs leading-relaxed">
                {brand.colorLogic.rationale}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest mb-3">
                Visual Rules
              </p>
              <ul className="space-y-2">
                {brand.visualRules.map((r, i) => (
                  <li key={i} className="flex gap-3 text-neutral-400">
                    <span className="text-neutral-700 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {tab === "rules" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-mono text-emerald-600 uppercase tracking-widest mb-3">
                Do
              </p>
              <ul className="space-y-3">
                {brand.dos.map((d, i) => (
                  <li key={i} className="flex gap-2 text-neutral-300">
                    <span className="text-emerald-600 mt-0.5 flex-shrink-0">↑</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-mono text-rose-600 uppercase tracking-widest mb-3">
                Don't
              </p>
              <ul className="space-y-3">
                {brand.donts.map((d, i) => (
                  <li key={i} className="flex gap-2 text-neutral-400">
                    <span className="text-rose-600 mt-0.5 flex-shrink-0">↓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "apply" && (
          <div>
            <p className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest mb-3">
              Example Applications
            </p>
            <ul className="space-y-3">
              {brand.applications.map((a, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-neutral-700 font-mono text-[11px] mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-neutral-300">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-neutral-800 space-y-3">
            <div
              className="h-3 w-16 bg-neutral-800 rounded animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
            <div
              className="h-6 w-40 bg-neutral-800 rounded animate-pulse"
              style={{ animationDelay: `${i * 150 + 50}ms` }}
            />
            <div
              className="h-3 w-28 bg-neutral-800 rounded animate-pulse"
              style={{ animationDelay: `${i * 150 + 100}ms` }}
            />
          </div>
          <div className="p-8 space-y-4">
            {[100, 80, 90, 70].map((w, j) => (
              <div
                key={j}
                className="h-3 bg-neutral-800 rounded animate-pulse"
                style={{ width: `${w}%`, animationDelay: `${j * 100}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const EXAMPLE_PROMPTS = [
  "A luxury menswear brand rooted in Japanese craft and European tailoring. Silent, confident, anti-trend.",
  "A fintech app helping Gen Z build emergency savings. Should feel like a calming habit, not a stressful task.",
  "A clinical-grade skincare line backed by dermatologists. Premium but not cold — science meets self-care.",
];

export default function App() {
  const [input, setInput] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setBrands([]);
    try {
      const result = await generateBrands(input.trim());
      setBrands(result);
      setGenerated(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBrands([]);
    setGenerated(false);
    setInput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-900 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black text-[10px] font-bold leading-none">B</span>
          </div>
          <span className="text-sm font-medium tracking-tight">Brand in a Click</span>
        </div>
        <span className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest">
          Beta
        </span>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="mb-16 fade-in">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.05] mb-5">
            Three brand directions,
            <br />
            <em className="text-neutral-500 font-light">instantly.</em>
          </h1>
          <p className="text-neutral-500 text-lg max-w-xl leading-relaxed">
            Describe your brand and get three fully-formed creative directions — concept, color,
            type, and rules — ready to brief a designer or test with users.
          </p>
        </div>

        {/* Input */}
        <div
          className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 mb-6 fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <label className="block text-[11px] font-mono text-neutral-600 uppercase tracking-widest mb-4">
            Describe your brand
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.metaKey && handleGenerate()}
            placeholder="e.g. A sustainable pet food company targeting health-conscious urban millennials. We use human-grade ingredients and want to feel premium but approachable, not clinical."
            rows={4}
            className="w-full bg-transparent text-white placeholder-neutral-700 text-base leading-relaxed resize-none border-none"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
            <span className="text-[11px] font-mono text-neutral-700">⌘ + Enter to generate</span>
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="generate-btn px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Generating...
                </>
              ) : (
                "Generate directions →"
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-rose-400 text-sm mb-8 px-1">{error}</p>}

        {/* Loading skeleton */}
        {loading && <LoadingState />}

        {/* Results */}
        {!loading && brands.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8 fade-in">
              <p className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest">
                3 directions generated
              </p>
              <button
                onClick={handleReset}
                className="text-[11px] font-mono text-neutral-600 hover:text-neutral-400 uppercase tracking-widest transition-colors"
              >
                Start over
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {brands.map((brand, i) => (
                <BrandCard key={brand.id} brand={brand} index={i} />
              ))}
            </div>
          </>
        )}

        {/* Example prompts */}
        {!loading && !generated && (
          <div className="mt-20 fade-in" style={{ animationDelay: "200ms" }}>
            <p className="text-[11px] font-mono text-neutral-800 uppercase tracking-widest mb-6">
              Try these prompts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EXAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="text-left p-4 bg-neutral-950 border border-neutral-900 rounded-xl text-neutral-600 text-xs leading-relaxed hover:border-neutral-700 hover:text-neutral-400 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

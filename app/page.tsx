"use client";

import { useState } from "react";

export default function Home() {
  const [parent1, setParent1] = useState("");
  const [parent2, setParent2] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [culturalBackground, setCulturalBackground] = useState("");
  const [gender, setGender] = useState("");
  const [babyNames, setBabyNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const generateBabyNames = async () => {
    setError("");
    setIsDetailsOpen(false);

    if (!parent1 && !parent2) {
      setError("Please enter both parent names");
      return;
    } else if (!parent1) {
      setError("Please enter Parent 1's name");
      return;
    } else if (!parent2) {
      setError("Please enter Parent 2's name");
      return;
    }

    const response = await fetch("/api/generate-baby-names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent1,
        parent2,
        firstLetter: firstLetter || undefined,
        culturalBackground: culturalBackground || undefined,
        gender: gender || undefined
      }),
    });

    const data = await response.json();
    setBabyNames(data.names);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-center">Baby Name Generator</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateBabyNames();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Parent 1's Name"
              value={parent1}
              onChange={(e) => {
                setParent1(e.target.value);
                setError("");
              }}
              className="border rounded p-2 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Parent 2's Name"
              value={parent2}
              onChange={(e) => {
                setParent2(e.target.value);
                setError("");
              }}
              className="border rounded p-2 dark:bg-gray-800 dark:text-white"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <details
            className="w-full"
            open={isDetailsOpen}
          >
            <summary
              className="cursor-pointer mb-4 text-sm text-gray-600 dark:text-gray-400"
              onClick={(e) => {
                e.preventDefault();
                setIsDetailsOpen(!isDetailsOpen);
              }}
            >
              Additional preferences
            </summary>
            <div className="flex flex-col gap-4">
              <div className="w-64">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Gender Preference (Optional)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border rounded p-2 dark:bg-gray-800 dark:text-white w-full"
                >
                  <option value="">Any</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                  <option value="neutral">Gender Neutral</option>
                </select>
              </div>
              <div className="w-64">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  First Letter (Optional)
                </label>
                <select
                  value={firstLetter}
                  onChange={(e) => setFirstLetter(e.target.value)}
                  className="border rounded p-2 dark:bg-gray-800 dark:text-white w-full"
                >
                  <option value="">--</option>
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => (
                    <option key={letter} value={letter}>
                      {letter}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-64">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Cultural Background (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian and Vietnamese"
                  value={culturalBackground}
                  onChange={(e) => setCulturalBackground(e.target.value)}
                  className="border rounded p-2 dark:bg-gray-800 dark:text-white w-full"
                />
              </div>
            </div>
          </details>
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            {babyNames.length > 0 ? "Re-generate Baby Names" : "Generate Baby Names"}
          </button>
        </form>
        {babyNames.length > 0 && (
          <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
            {babyNames.map((name, index) => (
              <div
                key={index}
                className={`text-sm font-[family-name:var(--font-geist-mono)] ${index % 2 === 0 ? 'text-left' : 'text-right'
                  }`}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

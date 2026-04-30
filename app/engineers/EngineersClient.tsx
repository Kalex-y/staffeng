"use client";

import { useState, useMemo } from "react";
import { Engineer, Skill, engineers } from "@/lib/data";
import EngineerCard from "@/components/EngineerCard";

const ALL_SKILLS: Skill[] = [
  "Agentic Systems",
  "Platform Engineering",
  "API Design",
  "Distributed Systems",
  "ML Infrastructure",
  "Developer Experience",
  "System Design",
  "Data Engineering",
  "Security",
  "Cloud Infrastructure",
  "Frontend Architecture",
  "Mobile",
];

const AVAILABILITY_OPTIONS: Engineer["availability"][] = [
  "Available now",
  "Available in 2–4 weeks",
  "Available in 1–2 months",
];

export default function EngineersClient() {
  const [query, setQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<Engineer["availability"] | "">("");

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const filtered = useMemo(() => {
    return engineers.filter((eng) => {
      const matchesQuery =
        query === "" ||
        eng.name.toLowerCase().includes(query.toLowerCase()) ||
        eng.title.toLowerCase().includes(query.toLowerCase()) ||
        eng.bio.toLowerCase().includes(query.toLowerCase()) ||
        eng.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((s) => eng.skills.includes(s));

      const matchesAvailability =
        selectedAvailability === "" || eng.availability === selectedAvailability;

      return matchesQuery && matchesSkills && matchesAvailability;
    });
  }, [query, selectedSkills, selectedAvailability]);

  const clearFilters = () => {
    setQuery("");
    setSelectedSkills([]);
    setSelectedAvailability("");
  };

  const hasFilters = query !== "" || selectedSkills.length > 0 || selectedAvailability !== "";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Browse engineers</h1>
        <p className="text-gray-500 mt-2">
          {engineers.length} vetted staff engineers available for contract and full-time work.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Name, skill, keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="space-y-2">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === opt}
                      onChange={() =>
                        setSelectedAvailability(
                          selectedAvailability === opt ? "" : opt
                        )
                      }
                      className="text-indigo-600"
                    />
                    <span className="text-sm text-gray-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedSkills.includes(skill)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-gray-600">No engineers match your filters</p>
              <p className="text-sm mt-1">Try adjusting your search or clearing filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-5">
                Showing {filtered.length} engineer{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                {filtered.map((eng) => (
                  <EngineerCard key={eng.slug} engineer={eng} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

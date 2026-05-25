"use client";

import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

const EXAMPLES = ["torvalds", "gaearon", "addyosmani"];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="page-center">
      <div className="page-inner">
        <h1 className="hero-title anim-fade-up">
          Git<span>Peekr</span>
        </h1>

        <p className="hero-sub anim-fade-up-1">
          Instantly explore any public GitHub profile
          <br />
          and their top repositories.
        </p>

        <div className="anim-fade-up-1" style={{ width: "100%" }}>
          <SearchBar />
        </div>

        <div className="examples anim-fade-up-2">
          <span className="examples-label">Try:</span>
          {EXAMPLES.map((u) => (
            <button
              key={u}
              className="example-btn"
              onClick={() => router.push(`/u/${u}`)}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <span className="page-footer">Built with Next.js & the GitHub API</span>
    </main>
  );
}

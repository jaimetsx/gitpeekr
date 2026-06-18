"use client";

import { useRouter } from "next/navigation";
import Grainient from "@/components/Grainient";
import SearchBar from "@/components/SearchBar";

const EXAMPLES = ["torvalds", "gaearon", "addyosmani"];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="home-page">
      <div className="grainient-container">
        <Grainient
          color1="#282828"
          color2="#808080"
          color3="#282828"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="home-content">
        <div className="hero-accent anim-fade-up" />
        
        <div className="hero-wrapper">
          <h1 className="home-title anim-fade-up">
            Discover<br />
            <span className="title-highlight">GitHub Profiles</span>
          </h1>

          <p className="home-subtitle anim-fade-up-1">
            Instantly explore any public GitHub profile and their top repositories.
            Search, discover, and get inspired by developers worldwide.
          </p>

          <div className="search-container anim-fade-up-1">
            <SearchBar />
          </div>

          <div className="examples-section anim-fade-up-2">
            <span className="examples-label">Quick start:</span>
            <div className="examples-buttons">
              {EXAMPLES.map((u) => (
                <button
                  key={u}
                  className="example-btn-new"
                  onClick={() => router.push(`/u/${u}`)}
                >
                  <span className="example-icon">@</span>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useRef, useCallback } from "react";
import Snake from "@/components/Snake";
import ParticleText from "@/components/ParticleText";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <main className="home-page">
      <div className="snake-bg">
        <Snake
          snakeColor="#FFFFFF"
          foodColor="#F9731A"
          boardColor="rgba(255, 255, 255, 0.04)"
          cellSize={34}
          speed={10}
          fade={32}
        />
      </div>

      <div className="home-content">
        <div
          ref={cardRef}
          className="hero-card"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="particle-text-container">
<ParticleText
              text="Discover GitHub Profiles"
              colors={["#FFFFFF", "#F9731A", "#FF6B08"]}
              mode="onEnter"
              replay={true}
              position="above"
              particleSize={8}
              particleCount={40}
              mouseEnabled={true}
              mouseRadius={50}
              mouseForce={30}
              fontSize={65}
              autoFit={false}
              transition={{ type: "tween", duration: 1.5, ease: "easeOut" }}
              style={{ minWidth: 0, minHeight: 0 }}
            />
          </div>

          <div className="hero-card-body">
            <p className="home-subtitle">
              Instantly explore any public GitHub profile and their top repositories.
              Search, discover, and get inspired by developers worldwide.
            </p>

            <div className="search-container">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

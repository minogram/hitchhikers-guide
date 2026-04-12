"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    subtitle: "Curating · Connecting · Creating",
    titleLines: ["The Hitchhiker's", "Guide to", "Fashion AI"],
    accentIndex: 1, // "Guide to" line gets accent on "Guide"
    description:
      "패션 산업에 특화된 AI 도구를 탐색하고, 전문가들과 연결되며, 새로운 기술적 가치를 함께 창조하세요.",
    bgText: "AI",
  },
  {
    subtitle: "Discover · Explore · Innovate",
    titleLines: ["AI Tools", "Curated for", "Fashion Industry"],
    accentIndex: 0,
    description:
      "Design, Manufacturing, Commerce — 패션 공정 전반에 걸친 AI 도구를 한눈에 비교하고 바로 체험하세요.",
    bgText: "FASHION",
  },
  {
    subtitle: "Share · Learn · Grow",
    titleLines: ["Join the", "Expert", "Community"],
    accentIndex: 1,
    description:
      "패션 테크 전문가들의 인사이트와 트렌드를 공유하고, 포럼과 아티클로 함께 성장하세요.",
    bgText: "TECH",
  },
  {
    subtitle: "Tailored · Intensive · Transformative",
    titleLines: ["AI Literacy", "Program for", "Your Organization"],
    accentIndex: 0,
    description:
      "조직의 고유한 맥락에 맞춘 AI 리터러시 프로그램으로, 팀의 잠재력을 새로운 차원으로 이끕니다.",
    bgText: "LEARN",
  },
];

interface HeroSliderProps {
  isLoggedIn: boolean;
}

export function HeroSlider({ isLoggedIn }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return;
      setDirection(index > current ? "next" : "prev");
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 800);
    },
    [current, isAnimating]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection("next");
      setIsAnimating(true);
      setCurrent((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 800);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden min-h-[520px] sm:min-h-[600px]">
      {/* Animated background text */}
      <div
        key={`bg-${current}`}
        className="absolute -top-10 right-0 hidden lg:block pointer-events-none select-none hero-bg-text"
        aria-hidden="true"
      >
        <div className="text-[18rem] xl:text-[22rem] font-serif font-black text-foreground/[0.04] leading-none whitespace-nowrap">
          {slide.bgText}
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hero-particle hero-particle-1" />
        <div className="hero-particle hero-particle-2" />
        <div className="hero-particle hero-particle-3" />
        <div className="hero-particle hero-particle-4" />
        <div className="hero-particle hero-particle-5" />
        <div className="hero-particle hero-particle-6" />
        <div className="hero-particle hero-particle-7" />
        <div className="hero-particle hero-particle-8" />
        <div className="hero-particle hero-particle-9" />
        <div className="hero-particle hero-particle-10" />
        <div className="hero-particle hero-particle-11" />
        <div className="hero-particle hero-particle-12" />
      </div>

      {/* Slide content */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40 relative z-10">
        <div className="max-w-2xl">
          {/* Subtitle */}
          <p
            key={`sub-${current}`}
            className={`text-sm font-medium text-accent uppercase tracking-widest mb-4 hero-slide-in ${
              direction === "next" ? "hero-from-right" : "hero-from-left"
            }`}
          >
            {slide.subtitle}
          </p>

          {/* Title */}
          <h1 className="font-serif text-5xl font-black leading-tight tracking-tight sm:text-7xl">
            {slide.titleLines.map((line, i) => (
              <span
                key={`title-${current}-${i}`}
                className={`block hero-slide-in ${
                  direction === "next" ? "hero-from-right" : "hero-from-left"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {i === slide.accentIndex ? (
                  <>
                    <span className="text-accent">{line.split(" ")[0]}</span>
                    {line.includes(" ") && ` ${line.split(" ").slice(1).join(" ")}`}
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p
            key={`desc-${current}`}
            className={`mt-8 text-lg leading-relaxed text-muted max-w-lg hero-slide-in hero-fade-up`}
            style={{ animationDelay: "300ms" }}
          >
            {slide.description}
          </p>

          {/* CTA */}
          <div
            key={`cta-${current}`}
            className="mt-10 flex items-center gap-4 hero-slide-in hero-fade-up"
            style={{ animationDelay: "450ms" }}
          >
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
            >
              앱 탐색
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!isLoggedIn && (
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-card-hover transition-colors"
              >
                무료 가입
              </Link>
            )}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-6 lg:left-8 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative h-2 rounded-full transition-all duration-500 ${
                i === current
                  ? "w-8 bg-accent"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`슬라이드 ${i + 1}`}
            >
              {i === current && (
                <span className="absolute inset-0 rounded-full bg-accent hero-indicator-progress" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

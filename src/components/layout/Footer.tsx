import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg font-bold">FALAB</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              AI 리터러시 연구소
              <br />
              패션과 AI의 교차점에서 새로운 가치를 창조합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/catalog" className="hover:text-foreground transition-colors">
                  AI APPS
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-foreground transition-colors">
                  COMMUNITY
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  ABOUT
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-sm font-semibold mb-4">파트너</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a
                  href="https://www.instagram.com/stories/openfashion.datarunway"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  OpenFashion DataRunway
                </a>
              </li>
              <li>
                <a
                  href="https://openfashion.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  OpenFashion.me
                </a>
              </li>
              <li>
                <a
                  href="https://uttu.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Uttu.me
                </a>
              </li>
              <li>
                <a
                  href="https://dito.fashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  dito.fashion
                </a>
              </li>
              <li>
                <a
                  href="https://d3dfashion.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  d3dfashion.com
                </a>
              </li>
              <li>
                <a
                  href="https://cafe.naver.com/misinggo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  cafe.naver.com/misinggo
                </a>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="flex items-end">
            <p className="text-xs text-muted">
              © 2026 AI 리터러시 연구소.
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

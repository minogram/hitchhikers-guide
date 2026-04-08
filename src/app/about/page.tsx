import { BookOpen, GraduationCap, Lightbulb, Target, Users, Sparkles, Brain, Palette } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      {/* Page Header */}
      <div className="mb-16 text-center">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
          About
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          AI Literacy Lab
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          패션 산업의 미래를 이끌 AI 리터러시를 연구하고 교육합니다.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-20">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-accent" />
            <h2 className="font-serif text-2xl font-bold">미션</h2>
          </div>
          <p className="text-muted leading-relaxed text-lg">
            AI Literacy Lab은 패션 산업 종사자와 학생들이 AI 기술을 올바르게 이해하고
            실무에 활용할 수 있도록 돕는 연구·교육 프로젝트입니다.
            빠르게 변화하는 AI 기술 환경 속에서 패션 전문가들이 새로운 도구를
            탐색하고, 창의적으로 적용하며, 산업의 혁신을 주도할 수 있는
            역량을 키우는 것을 목표로 합니다.
          </p>
        </div>
      </section>

      {/* Professor Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="h-6 w-6 text-accent" />
          <h2 className="font-serif text-2xl font-bold">연구자 소개</h2>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="shrink-0 flex justify-center">
                <div className="h-36 w-36 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Users className="h-16 w-16 text-accent/40" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-1">PhD Shin Yong Nam · 신용남</h3>
                <p className="text-accent font-medium mb-4">교수 · AI Literacy Lab 디렉터</p>
                <p className="text-muted leading-relaxed mb-4">
                  패션 테크놀로지와 AI 응용 분야를 연구하며, 패션 산업에서의
                  인공지능 활용 가능성을 탐구하고 있습니다.
                  디자인 프로세스의 혁신부터 공급망 최적화, 소비자 경험 개인화까지
                  폭넓은 영역에서 AI와 패션의 접점을 연구하고 교육합니다.
                </p>
                <div className="flex flex-col gap-1 text-sm text-muted mb-6">
                  <span>✉ 386com@hanmail.net</span>
                  <span>✆ +82-10-3736-3064</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Fashion Technology", "AI/ML Application", "Design Innovation", "Digital Transformation"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-6 w-6 text-accent" />
          <h2 className="font-serif text-2xl font-bold">강의 내용</h2>
        </div>
        <p className="text-muted leading-relaxed mb-10 max-w-3xl">
          AI Literacy Lab의 커리큘럼은 이론과 실습을 균형 있게 구성하여,
          수강생이 AI 도구를 직접 활용해볼 수 있는 실전 중심 교육을 제공합니다.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              icon: Brain,
              title: "AI 기초 리터러시",
              description:
                "인공지능의 핵심 개념, 머신러닝과 딥러닝의 원리, 생성형 AI의 동작 방식을 패션 산업 맥락에서 이해합니다.",
              topics: ["AI/ML 기본 개념", "생성형 AI 원리", "프롬프트 엔지니어링"],
            },
            {
              icon: Palette,
              title: "AI 기반 디자인",
              description:
                "이미지 생성, 스타일 트랜스퍼, 패턴 디자인 등 AI를 활용한 창의적 디자인 워크플로를 실습합니다.",
              topics: ["이미지 생성 AI", "스타일 트랜스퍼", "AI 디자인 워크플로"],
            },
            {
              icon: Lightbulb,
              title: "트렌드 분석과 예측",
              description:
                "데이터 기반의 트렌드 분석 방법론과 AI를 활용한 소비자 수요 예측, 시장 인사이트 도출을 학습합니다.",
              topics: ["데이터 분석", "트렌드 예측 모델", "소비자 인사이트"],
            },
            {
              icon: Sparkles,
              title: "AI 도구 실전 활용",
              description:
                "현업에서 활용 가능한 AI 도구를 직접 체험하고, 패션 비즈니스 시나리오에 맞는 활용 전략을 수립합니다.",
              topics: ["AI 도구 큐레이션", "비즈니스 적용 전략", "케이스 스터디"],
            },
          ].map((module) => (
            <div
              key={module.title}
              className="rounded-2xl border border-border bg-card p-6 hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <module.icon className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-bold">{module.title}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {module.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {module.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-block rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center rounded-2xl border border-border bg-card p-12">
        <h2 className="font-serif text-2xl font-bold mb-4">
          함께 만들어가는 패션 AI의 미래
        </h2>
        <p className="text-muted max-w-lg mx-auto mb-8">
          AI Literacy Lab과 함께 패션 산업의 새로운 가능성을 탐색하세요.
          커뮤니티에서 전문가들과 소통하고 최신 AI 도구를 경험해보세요.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
          >
            AI APPS 탐색
          </a>
          <a
            href="/community"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-card-hover transition-colors"
          >
            커뮤니티 참여
          </a>
        </div>
      </section>
    </div>
  );
}

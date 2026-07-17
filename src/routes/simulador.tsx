import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { MessageCircle, Route as RouteIcon, TrendingUp, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/simulador")({
  component: SimuladorPage,
  head: () => ({
    meta: [
      { title: "Simulador de Jornada — Método Acelera!" },
      {
        name: "description",
        content:
          "Veja como é a jornada real de transformação com o Método Acelera! — sem promessas milagrosas, passo a passo honesto.",
      },
    ],
  }),
});

const WHATSAPP_NUMBER = "5519991236207";

const MILESTONES = [
  {
    id: "semana-1",
    label: "Semana 1",
    title: "O ajuste de rota",
    icon: RouteIcon,
    lines: [
      "Primeiros treinos, novo ritmo e a sensação de que finalmente existe um plano.",
      "A balança ainda não se mexeu — e tudo bem. O corpo está aprendendo a nova rotina.",
      "Você percebe que não precisa fazer tudo perfeito, só precisa começar.",
    ],
  },
  {
    id: "mes-1",
    label: "Mês 1",
    title: "Primeiros sinais",
    icon: TrendingUp,
    lines: [
      "Resultados começam a aparecer na balança e nas roupas.",
      "A energia do dia a dia já mudou: menos peso, mais disposição.",
      "O primeiro check-in com o Ale ajusta o que precisa e reforça o que já funciona.",
    ],
  },
  {
    id: "mes-2",
    label: "Mês 2",
    title: "Consistência vira hábito",
    icon: Target,
    lines: [
      "O treino e a alimentação deixam de ser esforço e viram parte da rotina.",
      "Progresso visível: mais resistência, mais firmeza, mais confiança.",
      "Quando a vida aperta, o plano se adapta — você não desanda.",
    ],
  },
  {
    id: "mes-3",
    label: "Mês 3",
    title: "Shape diferente, vida diferente",
    icon: Sparkles,
    lines: [
      "O espelho já conta outra história: shape visivelmente diferente.",
      "Novos hábitos estão consolidados — você não precisa mais forçar a barra.",
      "Você entendeu que resultado inteligente não é sorte: é método e acompanhamento.",
    ],
  },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="text-lg md:text-xl font-black tracking-tight text-navy">
          Método Acelera<span className="text-orange">!</span>
        </Link>
        <Link
          to="/"
          className="text-sm font-semibold text-navy/60 hover:text-navy transition-colors"
        >
          Voltar ao site
        </Link>
      </div>
    </header>
  );
}

function TimelineItem({
  milestone,
  index,
  isLast,
}: {
  milestone: (typeof MILESTONES)[number];
  index: number;
  isLast: boolean;
}) {
  const Icon = milestone.icon;
  const isEven = index % 2 === 0;

  return (
    <div className="relative flex gap-4 md:gap-0">
      {/* Linha central */}
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-orange text-white shadow-lg shadow-orange/25 z-10">
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-orange via-orange/50 to-navy/10" />
        )}
      </div>

      {/* Conteúdo */}
      <div
        className={`pb-12 md:pb-16 md:absolute md:w-[calc(50%-2.5rem)] ${
          isEven ? "md:left-0 md:text-right md:pr-8" : "md:right-0 md:pl-8"
        }`}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange">
          {milestone.label}
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-black leading-tight text-navy">
          {milestone.title}
        </h2>
        <ul className="mt-4 space-y-3">
          {milestone.lines.map((line, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 text-navy/75 leading-relaxed ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-green" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Espaçador no desktop para alinhar a linha central */}
      <div className="hidden md:block md:flex-1" />
    </div>
  );
}

function SimuladorPage() {
  const whatsappUrl = useMemo(() => {
    const msg = `Olá, Ale! Vi o simulador de jornada do Método Acelera! e quero saber mais sobre a consultoria.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, []);

  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 md:py-14">
        {/* Intro */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange">
            <RouteIcon className="h-3.5 w-3.5" />
            Simulador de jornada
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight text-navy">
            Como é a transformação de verdade?
          </h1>
          <p className="mt-4 text-lg text-navy/70 max-w-2xl mx-auto">
            Sem mágica, sem promessa milagrosa. Só o processo honesto do Método
            Acelera! — com acompanhamento próximo do início ao fim.
          </p>
        </div>

        {/* Timeline */}
        <section className="relative">
          {/* Linha central de referência no mobile fica no componente do item */}
          <div className="relative md:mx-auto md:max-w-2xl">
            {MILESTONES.map((milestone, index) => (
              <TimelineItem
                key={milestone.id}
                milestone={milestone}
                index={index}
                isLast={index === MILESTONES.length - 1}
              />
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-4 rounded-3xl bg-navy p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-4xl font-black leading-tight !text-white">
            Pronto pra começar sua jornada?
          </h2>
          <p className="mt-4 text-white/75 max-w-xl mx-auto">
            Esse caminho é realista — e fica muito mais fácil quando você tem um
            GPS do seu lado. Fale com o Ale no WhatsApp.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-orange px-8 py-4 text-lg font-black text-white shadow-2xl shadow-orange/30 transition-all hover:bg-orange-hover hover:-translate-y-0.5"
            >
              <MessageCircle className="h-6 w-6" />
              Falar com o Ale no WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-white/50">
            (19) 99123-6207 · Resposta rápida em horário comercial
          </p>
        </section>
      </main>
    </div>
  );
}

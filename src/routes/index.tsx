import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Instagram,
  MessageCircle,
  Check,
  ClipboardList,
  Target,
  CalendarCheck,
  Quote,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Método Acelera! — Emagrecimento com acompanhamento próximo" },
      {
        name: "description",
        content:
          "Consultoria esportiva online com Ale Mancilha. Emagrecimento inteligente, plano personalizado e check-ins mensais. Resultado inteligente. Não resultado sofrido.",
      },
    ],
  }),
});

const WHATSAPP_NUMBER = "5519991236207";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá, Ale! Vi o site do Método Acelera! e quero saber mais sobre a consultoria.",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
const INSTAGRAM_URL = "https://instagram.com/alemancilha.personal";

function CTAButton({
  children,
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-orange font-bold text-white shadow-lg shadow-orange/25 transition-all hover:bg-orange-hover hover:-translate-y-0.5 active:translate-y-0 ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/quiz", label: "Quiz" },
    { to: "/calculadora", label: "Calculadora" },
    { to: "/simulador", label: "Simulador" },
  ] as const;
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="text-lg md:text-xl font-black tracking-tight text-navy truncate">
            Método Acelera<span className="text-orange">!</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-navy/70">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-orange" }}
              className="hover:text-orange transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange/20 transition-colors hover:bg-orange-hover"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-navy shadow-sm"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-cream">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-orange" }}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-bold text-navy border-b border-border/60 last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange/20"
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-navy/5 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            Consultoria esportiva online
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-navy">
            Emagreça de vez — <span className="text-orange">com um GPS</span> do seu lado.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-navy/70 leading-relaxed max-w-2xl">
            Chega de planilha genérica e sumiço. Método Acelera! é acompanhamento
            próximo, plano feito pra sua rotina e ajuste constante até você
            chegar onde quer.
          </p>
          <p className="mt-4 text-lg md:text-xl font-bold text-navy italic">
            "Resultado inteligente. Não resultado sofrido."
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <CTAButton size="lg">
              Quero minha consultoria
              <ArrowRight className="h-5 w-5" />
            </CTAButton>
            <span className="text-sm text-navy/60">
              Resposta direta no WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AleStory() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <span className="text-sm font-bold uppercase tracking-wider text-orange">
            Quem é o Ale
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-black text-navy leading-tight">
            De obeso a atleta —<br />depois dos 30.
          </h2>
          <div className="mt-6 space-y-4 text-navy/75 text-lg leading-relaxed">
            <p>
              Ale Mancilha foi obeso. Passou pelo que você provavelmente já passou:
              dietas que não colaram, academia sem plano, resultado que não vinha.
            </p>
            <p>
              Depois dos 30, virou a chave. Emagreceu, ganhou físico de atleta e
              hoje é empresário, pai de família e a prova viva de que dá pra
              conciliar rotina corrida com a melhor forma da sua vida.
            </p>
            <p className="font-semibold text-navy">
              É essa experiência que ele coloca no seu processo — sem mágica, sem
              promessa milagrosa. Método e presença.
            </p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-3xl bg-cream shadow-xl">
            <img
              src="/ale-mancilha.jpg"
              alt="Ale Mancilha, personal trainer e fundador do Método Acelera!"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const pains = [
    "Você já tentou emagrecer sozinho e sempre volta pra estaca zero.",
    "Rotina corrida — trabalho, família, viagens — e o treino nunca cabe.",
    "Cansou de planilha genérica de personal que some depois do PIX.",
    "Sente que precisa de método, não de mais uma dieta milagrosa.",
  ];
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wider text-orange">
            Se identifica?
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-black text-navy leading-tight">
            Você não precisa de mais força de vontade. Precisa de método.
          </h2>
        </div>
        <ul className="mt-10 grid md:grid-cols-2 gap-4">
          {pains.map((p) => (
            <li
              key={p}
              className="flex gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange/15 text-orange font-black text-sm">
                ✕
              </span>
              <p className="text-navy/80 text-lg leading-relaxed">{p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-orange">
            A solução
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-black !text-white leading-tight">
            Um GPS pro seu emagrecimento.
          </h2>
          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            Não é planilha e sumiço. É acompanhamento próximo — Ale pilota o
            processo com você, ajusta a rota quando a vida aperta e mantém a
            direção quando o resultado começa a aparecer.
          </p>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            Tudo organizado dentro do app <span className="font-bold text-white">Kinea</span>:
            treinos, cardápio, evolução, mensagens. Você abre e sabe exatamente o
            que fazer hoje.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { t: "Acompanhamento próximo", d: "Ale presente no processo, não só no PIX." },
            { t: "Plano sob medida", d: "Feito pra sua rotina real — não a ideal." },
            { t: "App Kinea", d: "Treino, dieta e progresso num só lugar." },
            { t: "Ajuste contínuo", d: "Mudou a rota? A gente recalcula." },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <Check className="h-5 w-5 text-orange" />
              <div className="mt-3 font-bold text-white">{item.t}</div>
              <div className="mt-1 text-sm text-white/70">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      n: "01",
      t: "Avaliação inicial",
      d: "Conversa a fundo: histórico, rotina, objetivos, o que já tentou. Base pra construir o plano certo.",
    },
    {
      icon: Target,
      n: "02",
      t: "Plano personalizado",
      d: "Treino e alimentação desenhados pra você, entregues no app Kinea. Simples de seguir no dia a dia.",
    },
    {
      icon: CalendarCheck,
      n: "03",
      t: "Check-ins mensais",
      d: "Todo mês a gente revisa, ajusta e recalibra. Você não fica sozinho no processo — nunca.",
    },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-wider text-orange">
            Como funciona
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-black text-navy leading-tight">
            Três passos. Sem enrolação.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map(({ icon: Icon, n, t, d }) => (
            <div
              key={n}
              className="relative rounded-3xl border border-border bg-cream p-8 transition-transform hover:-translate-y-1"
            >
              <div className="absolute -top-4 left-8 rounded-full bg-orange px-4 py-1 text-sm font-black text-white shadow-md">
                {n}
              </div>
              <Icon className="mt-2 h-10 w-10 text-navy" strokeWidth={2} />
              <h3 className="mt-5 text-2xl font-black text-navy">{t}</h3>
              <p className="mt-3 text-navy/70 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const includes = [
    "Avaliação inicial completa",
    "Plano de treino personalizado no app Kinea",
    "Orientação alimentar prática",
    "Check-ins mensais com o Ale",
    "Ajustes contínuos ao longo do trimestre",
    "Suporte pelo WhatsApp para dúvidas",
  ];
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold uppercase tracking-wider text-orange">
            Plano trimestral
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-black text-navy leading-tight">
            Compromisso de 3 meses. Resultado que fica.
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Emagrecer de verdade leva tempo. Por isso o Método Acelera! trabalha
            em ciclos de 3 meses — o suficiente pra virar hábito, não modinha.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-white shadow-xl">
          <div className="bg-navy px-8 py-8 text-center text-white">
            <div className="text-sm uppercase tracking-widest text-white/60">
              Plano trimestral
            </div>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-lg text-white/70">R$</span>
              <span className="text-6xl md:text-7xl font-black !text-white">247</span>
              <span className="text-lg text-white/70">/mês</span>
            </div>
            <div className="mt-2 text-sm text-white/60">
              Cobrado em ciclos trimestrais
            </div>
          </div>
          <div className="p-8">
            <div className="text-sm font-bold uppercase tracking-wider text-navy/60">
              O que está incluso
            </div>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3">
              {includes.map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green/15">
                    <Check className="h-4 w-4 text-green" strokeWidth={3} />
                  </span>
                  <span className="text-navy/80">{i}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
              <CTAButton size="lg">
                Quero minha consultoria
                <ArrowRight className="h-5 w-5" />
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Nome do Cliente",
      result: "Perdeu 12kg em 4 meses",
      quote:
        "Depoimento aqui — placeholder editável. Troque pelo texto real do cliente contando a experiência com o Método Acelera!.",
    },
    {
      name: "Nome do Cliente",
      result: "Voltou a treinar aos 42",
      quote:
        "Depoimento aqui — placeholder editável. Troque pelo texto real do cliente contando a experiência com o Método Acelera!.",
    },
    {
      name: "Nome do Cliente",
      result: "-8kg e mais energia",
      quote:
        "Depoimento aqui — placeholder editável. Troque pelo texto real do cliente contando a experiência com o Método Acelera!.",
    },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-wider text-orange">
            Quem já acelerou
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-black text-navy leading-tight">
            Resultado de gente de verdade.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-3xl border border-border bg-cream p-6"
            >
              <Quote className="h-8 w-8 text-orange" />
              <blockquote className="mt-4 flex-1 text-navy/80 leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4 border-t border-border pt-5">
                <div className="h-12 w-12 flex-none rounded-full bg-navy/10 flex items-center justify-center text-navy/40 text-xs">
                  foto
                </div>
                <div>
                  <div className="font-bold text-navy">{t.name}</div>
                  <div className="text-sm text-green font-semibold">
                    {t.result}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight !text-white">
          Pronto pra parar de <span className="text-orange">recomeçar</span>?
        </h2>
        <p className="mt-6 text-lg md:text-xl text-white/75 max-w-2xl mx-auto">
          Fale direto com o Ale no WhatsApp. Em poucos minutos você entende se o
          Método Acelera! é pra você.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-orange px-10 py-5 text-lg md:text-xl font-black text-white shadow-2xl shadow-orange/30 transition-all hover:bg-orange-hover hover:-translate-y-0.5"
          >
            <MessageCircle className="h-6 w-6" />
            Falar com o Ale no WhatsApp
          </a>
        </div>
        <p className="mt-6 text-sm text-white/50">
          (19) 99123-6207 · Resposta rápida em horário comercial
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-cream border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="text-xl font-black text-navy">
            Método Acelera<span className="text-orange">!</span>
          </div>
          <p className="mt-2 text-sm text-navy/60 italic">
            Resultado inteligente. Não resultado sofrido.
          </p>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-navy/60">
            Contato
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-navy hover:text-orange transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp (19) 99123-6207
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-navy hover:text-orange transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @alemancilha.personal
            </a>
          </div>
        </div>
        <div className="md:text-right">
          <div className="text-sm text-navy/60">
            © {new Date().getFullYear()} Método Acelera!<br />
            Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header />
      <main>
        <Hero />
        <AleStory />
        <Problem />
        <Solution />
        <HowItWorks />
        <Offer />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

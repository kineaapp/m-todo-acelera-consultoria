import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, Check } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Quiz — Método Acelera!" },
      {
        name: "description",
        content:
          "Responda 6 perguntas rápidas e descubra por que o Método Acelera! é o caminho pra você.",
      },
    ],
  }),
});

const WHATSAPP_NUMBER = "5519991236207";

type Answers = {
  objetivo?: string;
  rotina?: string;
  tentou?: string;
  atrapalhou?: string;
  frequencia?: string;
};

type Question = {
  key: keyof Answers;
  label: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    key: "objetivo",
    label: "Qual seu principal objetivo?",
    options: ["Emagrecer", "Ganhar massa muscular", "Definição", "Saúde geral"],
  },
  {
    key: "rotina",
    label: "Como está sua rotina hoje?",
    options: ["Muito corrida", "Corrida mas organizada", "Bastante tempo livre"],
  },
  {
    key: "tentou",
    label: "Já tentou emagrecer/treinar sozinho antes?",
    options: ["Sim, várias vezes", "Sim, uma vez", "Nunca tentei sério"],
  },
  {
    key: "atrapalhou",
    label: "O que mais te atrapalhou até hoje?",
    options: [
      "Falta de consistência",
      "Não saber o que fazer",
      "Falta de acompanhamento",
      "Ansiedade com comida",
    ],
  },
  {
    key: "frequencia",
    label: "Quantas vezes por semana você consegue treinar?",
    options: ["1-2x", "3-4x", "5x ou mais"],
  },
];

const contactSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, { message: "Digite seu nome completo" })
    .max(80, { message: "Nome muito longo" }),
  whatsapp: z
    .string()
    .trim()
    .min(10, { message: "Digite um WhatsApp válido com DDD" })
    .max(20, { message: "WhatsApp muito longo" })
    .regex(/^[\d\s()+-]+$/, { message: "Use apenas números e ( ) + -" }),
});

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-navy/60 mb-2">
        <span>
          Passo {Math.min(current, total)} de {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-navy/10">
        <div
          className="h-full rounded-full bg-orange transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-4 rounded-2xl border-2 px-5 py-4 text-left text-base md:text-lg font-semibold transition-all ${
        selected
          ? "border-orange bg-orange/5 text-navy shadow-md shadow-orange/10"
          : "border-border bg-white text-navy hover:border-orange/50 hover:-translate-y-0.5"
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-orange bg-orange text-white" : "border-navy/20"
        }`}
      >
        {selected && <Check className="h-4 w-4" strokeWidth={3} />}
      </span>
    </button>
  );
}

function buildResultMessage(a: Answers, nome: string) {
  const parts: string[] = [];

  const primeiroNome = nome.split(" ")[0] || nome;

  parts.push(
    `${primeiroNome}, com base nas suas respostas, o Método Acelera! foi feito pra alguém no seu momento — e eis o porquê:`,
  );

  // Objetivo + rotina
  if (a.objetivo === "Emagrecer" && a.rotina?.includes("corrida")) {
    parts.push(
      "Seu objetivo é emagrecer, mas sua rotina não perdoa. É exatamente aí que a maioria dos planos genéricos quebra — e onde o acompanhamento próximo faz a diferença: plano ajustado à vida real, não à vida ideal.",
    );
  } else if (a.objetivo === "Ganhar massa muscular") {
    parts.push(
      "Ganhar massa exige constância e progressão — não é planilha aleatória. Com check-ins mensais a gente garante que o treino evolua com você, e não estacione.",
    );
  } else if (a.objetivo === "Definição") {
    parts.push(
      "Definição não vem de mágica: vem de ajuste fino entre treino, dieta e recuperação. É esse ajuste contínuo que o Método entrega.",
    );
  } else {
    parts.push(
      "Buscar saúde geral é a decisão mais inteligente — e a que exige método mais do que motivação. É aqui que a gente entra.",
    );
  }

  // Tentativas anteriores
  if (a.tentou?.startsWith("Sim, várias")) {
    parts.push(
      "Você já tentou sozinho várias vezes. Isso não é fracasso — é sinal de que faltava o que o Ale entrega: um GPS pra manter a rota mesmo quando a vida aperta.",
    );
  } else if (a.tentou?.startsWith("Sim, uma")) {
    parts.push(
      "Você já tentou antes e sabe o quanto é difícil sozinho. Com acompanhamento, a diferença aparece nas primeiras semanas.",
    );
  }

  // Bloqueio principal
  if (a.atrapalhou === "Falta de consistência") {
    parts.push(
      "Consistência não é força de vontade — é sistema. Check-ins mensais + plano simples de seguir = consistência que dura.",
    );
  } else if (a.atrapalhou === "Não saber o que fazer") {
    parts.push(
      "Você não precisa descobrir sozinho. O plano personalizado tira essa dúvida de cima de você a cada semana.",
    );
  } else if (a.atrapalhou === "Falta de acompanhamento") {
    parts.push(
      "Acompanhamento é literalmente o núcleo do método. Nada de planilha e sumiço — Ale presente do início ao fim do ciclo.",
    );
  } else if (a.atrapalhou === "Ansiedade com comida") {
    parts.push(
      "Comida não pode ser inimigo. A orientação alimentar prática trabalha isso sem dieta maluca — é ajuste de relação, não de calorias.",
    );
  }

  // Frequência
  if (a.frequencia === "1-2x") {
    parts.push(
      "Treinar 1-2x por semana já é ponto de partida. A gente monta um plano que caiba nisso — e evolui a frequência quando fizer sentido.",
    );
  } else if (a.frequencia === "3-4x") {
    parts.push(
      "3-4x por semana é o volume ideal pra quem quer resultado real sem pirar a rotina.",
    );
  } else if (a.frequencia === "5x ou mais") {
    parts.push(
      "Com 5x+ por semana o teto é alto — o que falta é direcionamento certo, e é aí que o método faz o resultado acelerar.",
    );
  }

  parts.push(
    "Resultado inteligente. Não resultado sofrido. Quando você quiser, chama o Ale no WhatsApp — a conversa inicial é sem compromisso.",
  );

  return parts.join("\n\n");
}

function saveToLocalStorage(payload: unknown) {
  try {
    const key = "metodo-acelera:quiz-leads";
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...(payload as object), at: new Date().toISOString() });
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* localStorage indisponível — silencioso */
  }
}

function QuizPage() {
  const total = QUESTIONS.length + 1; // 5 múltipla escolha + contato
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<{ nome?: string; whatsapp?: string }>({});
  const [done, setDone] = useState<null | { nome: string; whatsapp: string; answers: Answers }>(
    null,
  );

  const currentQuestion = step < QUESTIONS.length ? QUESTIONS[step] : null;

  const isContactStep = step === QUESTIONS.length;
  const canContinue = currentQuestion
    ? Boolean(answers[currentQuestion.key])
    : false;

  function select(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (currentQuestion && canContinue) {
      setStep((s) => s + 1);
    }
  }

  function prev() {
    if (step > 0 && !done) setStep((s) => s - 1);
  }

  function submitContact(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse({ nome, whatsapp });
    if (!parsed.success) {
      const fieldErrors: { nome?: string; whatsapp?: string } = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as "nome" | "whatsapp";
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const payload = { nome: parsed.data.nome, whatsapp: parsed.data.whatsapp, answers };
    saveToLocalStorage(payload);
    setDone(payload);
  }

  const resultMessage = useMemo(
    () => (done ? buildResultMessage(done.answers, done.nome) : ""),
    [done],
  );

  const whatsappUrl = useMemo(() => {
    if (!done) return "#";
    const primeiroNome = done.nome.split(" ")[0] || done.nome;
    const msg = `Olá, Ale! Sou ${primeiroNome}. Acabei de fazer o quiz do Método Acelera! e quero saber mais sobre a consultoria. Meu objetivo: ${done.answers.objetivo}. Meu WhatsApp: ${done.whatsapp}.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [done]);

  const currentStepForBar = done ? total : step + 1;

  return (
    <div className="min-h-screen bg-cream text-navy">
      {/* Header simplificado do quiz */}
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

      <main className="mx-auto max-w-2xl px-4 py-8 md:py-14">
        <ProgressBar current={currentStepForBar} total={total} />

        <div className="mt-8">
          {!done && currentQuestion && (
            <section>
              <span className="text-xs font-bold uppercase tracking-wider text-orange">
                Pergunta {step + 1}
              </span>
              <h1 className="mt-2 text-2xl md:text-4xl font-black leading-tight text-navy">
                {currentQuestion.label}
              </h1>

              <div className="mt-8 space-y-3">
                {currentQuestion.options.map((opt) => (
                  <OptionButton
                    key={opt}
                    label={opt}
                    selected={answers[currentQuestion.key] === opt}
                    onClick={() => select(currentQuestion.key, opt)}
                  />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-navy/70 transition-colors hover:text-navy disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange/25 transition-all hover:bg-orange-hover hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                >
                  Continuar
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </section>
          )}

          {!done && isContactStep && (
            <section>
              <span className="text-xs font-bold uppercase tracking-wider text-orange">
                Última etapa
              </span>
              <h1 className="mt-2 text-2xl md:text-4xl font-black leading-tight text-navy">
                Onde a gente te envia seu resultado?
              </h1>
              <p className="mt-3 text-navy/70">
                Seu contato fica só com o Ale. Sem spam, sem lista de e-mail.
              </p>

              <form onSubmit={submitContact} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="nome" className="block text-sm font-bold text-navy">
                    Seu nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    required
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-base text-navy outline-none transition-colors focus:border-orange"
                    placeholder="Ex: Ana Souza"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm font-medium text-destructive">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-bold text-navy">
                    WhatsApp (com DDD)
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    maxLength={20}
                    autoComplete="tel"
                    required
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-base text-navy outline-none transition-colors focus:border-orange"
                    placeholder="(19) 99123-6207"
                  />
                  {errors.whatsapp && (
                    <p className="mt-1 text-sm font-medium text-destructive">
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-navy/70 transition-colors hover:text-navy"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange/25 transition-all hover:bg-orange-hover hover:-translate-y-0.5"
                  >
                    Ver meu resultado
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </section>
          )}

          {done && (
            <section>
              <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                Seu resultado
              </span>
              <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight text-navy">
                {done.nome.split(" ")[0]}, seu perfil bate com o Método.
              </h1>

              <div className="mt-6 rounded-3xl border border-border bg-white p-6 md:p-8 shadow-md">
                <div className="space-y-4 text-navy/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {resultMessage}
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-navy/50">
                    Resumo das suas respostas
                  </div>
                  <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                    {QUESTIONS.map((q) => (
                      <li key={q.key} className="flex gap-2">
                        <span className="text-navy/50">{q.label}</span>
                        <span className="font-semibold text-navy">
                          {done.answers[q.key]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-3xl bg-navy p-6 md:p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-black !text-white leading-tight">
                  Bora conversar?
                </h2>
                <p className="mt-2 text-white/70">
                  O Ale já vai receber seu contato com o resultado do quiz.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-orange px-8 py-4 text-lg font-black text-white shadow-2xl shadow-orange/30 transition-all hover:bg-orange-hover hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar com o Ale no WhatsApp
                </a>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-sm font-semibold text-navy/60 hover:text-navy transition-colors"
                >
                  ← Voltar para o site
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

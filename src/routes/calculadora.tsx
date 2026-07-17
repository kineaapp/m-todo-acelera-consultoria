import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, Calculator } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/calculadora")({
  component: CalculadoraPage,
  head: () => ({
    meta: [
      { title: "Calculadora de Calorias — Método Acelera!" },
      {
        name: "description",
        content:
          "Calcule suas calorias de manutenção e meta sugerida com a fórmula de Mifflin-St Jeor. Descubra como o Método Acelera! pode acelerar seu resultado.",
      },
    ],
  }),
});

const WHATSAPP_NUMBER = "5519991236207";

type ActivityLevel = "sedentario" | "leve" | "moderado" | "intenso";
type Goal = "emagrecer" | "manter" | "ganhar";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
};

const GOAL_LABELS: Record<Goal, string> = {
  emagrecer: "Emagrecer",
  manter: "Manter peso",
  ganhar: "Ganhar massa muscular",
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentario: "Sedentário (pouco ou nenhum exercício)",
  leve: "Leve (exercício leve 1-3 dias/semana)",
  moderado: "Moderado (exercício moderado 3-5 dias/semana)",
  intenso: "Intenso (exercício pesado 6-7 dias/semana)",
};

const calculatorSchema = z.object({
  sexo: z.enum(["masculino", "feminino"], { message: "Selecione o sexo" }),
  idade: z.coerce
    .number()
    .int({ message: "Idade deve ser um número inteiro" })
    .min(10, { message: "Idade mínima de 10 anos" })
    .max(120, { message: "Idade máxima de 120 anos" }),
  peso: z.coerce
    .number()
    .positive({ message: "Peso deve ser maior que zero" })
    .max(500, { message: "Peso máximo de 500 kg" }),
  altura: z.coerce
    .number()
    .int({ message: "Altura em cm deve ser um número inteiro" })
    .min(50, { message: "Altura mínima de 50 cm" })
    .max(300, { message: "Altura máxima de 300 cm" }),
  atividade: z.enum(["sedentario", "leve", "moderado", "intenso"], {
    message: "Selecione o nível de atividade",
  }),
  objetivo: z.enum(["emagrecer", "manter", "ganhar"], {
    message: "Selecione o objetivo",
  }),
});

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

function calculateCalories(data: z.infer<typeof calculatorSchema>) {
  const { sexo, idade, peso, altura, atividade, objetivo } = data;

  const tmbBase =
    10 * peso + 6.25 * altura - 5 * idade + (sexo === "masculino" ? 5 : -161);

  const tmb = Math.round(tmbBase);
  const manutencao = Math.round(tmbBase * ACTIVITY_MULTIPLIERS[atividade]);

  let meta = manutencao;
  if (objetivo === "emagrecer") {
    meta = Math.round(manutencao * 0.8);
  } else if (objetivo === "ganhar") {
    meta = Math.round(manutencao * 1.12);
  }

  return { tmb, manutencao, meta };
}

function saveToLocalStorage(payload: unknown) {
  try {
    const key = "metodo-acelera:calculadora-leads";
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...(payload as object), at: new Date().toISOString() });
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* localStorage indisponível — silencioso */
  }
}

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

function InputField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-navy">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

function RadioCard({
  name,
  value,
  label,
  description,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 px-5 py-4 transition-all ${
        checked
          ? "border-orange bg-orange/5 shadow-md shadow-orange/10"
          : "border-border bg-white hover:border-orange/50"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 accent-orange"
      />
      <div>
        <div className="font-semibold text-navy">{label}</div>
        {description && <div className="text-sm text-navy/60">{description}</div>}
      </div>
    </label>
  );
}

function CalculadoraPage() {
  const [formData, setFormData] = useState({
    sexo: "",
    idade: "",
    peso: "",
    altura: "",
    atividade: "" as ActivityLevel | "",
    objetivo: "" as Goal | "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [contactErrors, setContactErrors] = useState<{ nome?: string; whatsapp?: string }>({});

  const [step, setStep] = useState<"form" | "contact" | "result">("form");
  const [result, setResult] = useState<{
    data: z.infer<typeof calculatorSchema>;
    tmb: number;
    manutencao: number;
    meta: number;
  } | null>(null);

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const parsed = calculatorSchema.safeParse({
      sexo: formData.sexo || undefined,
      idade: formData.idade,
      peso: formData.peso,
      altura: formData.altura,
      atividade: formData.atividade || undefined,
      objetivo: formData.objetivo || undefined,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setResult({
      data: parsed.data,
      ...calculateCalories(parsed.data),
    });
    setStep("contact");
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
      setContactErrors(fieldErrors);
      return;
    }

    setContactErrors({});
    if (result) {
      const payload = {
        nome: parsed.data.nome,
        whatsapp: parsed.data.whatsapp,
        calculo: {
          sexo: result.data.sexo,
          idade: result.data.idade,
          peso: result.data.peso,
          altura: result.data.altura,
          atividade: result.data.atividade,
          objetivo: result.data.objetivo,
          tmb: result.tmb,
          manutencao: result.manutencao,
          meta: result.meta,
        },
      };
      saveToLocalStorage(payload);
    }
    setStep("result");
  }

  const whatsappUrl = useMemo(() => {
    if (!result) return "#";
    const primeiroNome = nome.split(" ")[0] || nome || "";
    const msg = `Olá, Ale! Sou ${primeiroNome}. Usei a calculadora de calorias do Método Acelera! e quero saber mais sobre a consultoria. Meu objetivo: ${GOAL_LABELS[result.data.objetivo]}. Minha meta sugerida: ${result.meta} kcal/dia. Meu WhatsApp: ${whatsapp}.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [result, nome, whatsapp]);

  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8 md:py-14">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange">
            <Calculator className="h-3.5 w-3.5" />
            Calculadora de calorias
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight text-navy">
            Descubra sua meta calórica
          </h1>
          <p className="mt-3 text-navy/70">
            Baseado na fórmula de Mifflin-St Jeor, ajustado ao seu objetivo.
          </p>
        </div>

        {step === "form" && (
          <form onSubmit={submitForm} className="space-y-6">
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-sm space-y-6">
              <InputField label="Sexo" id="sexo" error={formErrors.sexo}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <RadioCard
                    name="sexo"
                    value="masculino"
                    label="Masculino"
                    checked={formData.sexo === "masculino"}
                    onChange={() => updateField("sexo", "masculino")}
                  />
                  <RadioCard
                    name="sexo"
                    value="feminino"
                    label="Feminino"
                    checked={formData.sexo === "feminino"}
                    onChange={() => updateField("sexo", "feminino")}
                  />
                </div>
              </InputField>

              <div className="grid sm:grid-cols-3 gap-5">
                <InputField label="Idade" id="idade" error={formErrors.idade}>
                  <input
                    id="idade"
                    type="number"
                    inputMode="numeric"
                    value={formData.idade}
                    onChange={(e) => updateField("idade", e.target.value)}
                    min={10}
                    max={120}
                    required
                    className="w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-base text-navy outline-none transition-colors focus:border-orange"
                    placeholder="35"
                  />
                </InputField>

                <InputField label="Peso (kg)" id="peso" error={formErrors.peso}>
                  <input
                    id="peso"
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={formData.peso}
                    onChange={(e) => updateField("peso", e.target.value)}
                    min={1}
                    max={500}
                    required
                    className="w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-base text-navy outline-none transition-colors focus:border-orange"
                    placeholder="75,5"
                  />
                </InputField>

                <InputField label="Altura (cm)" id="altura" error={formErrors.altura}>
                  <input
                    id="altura"
                    type="number"
                    inputMode="numeric"
                    value={formData.altura}
                    onChange={(e) => updateField("altura", e.target.value)}
                    min={50}
                    max={300}
                    required
                    className="w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-base text-navy outline-none transition-colors focus:border-orange"
                    placeholder="170"
                  />
                </InputField>
              </div>

              <InputField label="Nível de atividade" id="atividade" error={formErrors.atividade}>
                <div className="space-y-3">
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((key) => (
                    <RadioCard
                      key={key}
                      name="atividade"
                      value={key}
                      label={ACTIVITY_LABELS[key].split(" (")[0]}
                      description={key === "sedentario" ? ACTIVITY_LABELS[key] : `(${ACTIVITY_LABELS[key].split("(")[1]}`}
                      checked={formData.atividade === key}
                      onChange={() => updateField("atividade", key)}
                    />
                  ))}
                </div>
              </InputField>

              <InputField label="Objetivo" id="objetivo" error={formErrors.objetivo}>
                <div className="grid sm:grid-cols-3 gap-3">
                  {(Object.keys(GOAL_LABELS) as Goal[]).map((key) => (
                    <RadioCard
                      key={key}
                      name="objetivo"
                      value={key}
                      label={GOAL_LABELS[key]}
                      checked={formData.objetivo === key}
                      onChange={() => updateField("objetivo", key)}
                    />
                  ))}
                </div>
              </InputField>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange/25 transition-all hover:bg-orange-hover hover:-translate-y-0.5"
            >
              Calcular minha meta
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        )}

        {step === "contact" && result && (
          <section>
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-orange">
                Quase lá
              </span>
              <h2 className="mt-2 text-2xl md:text-3xl font-black leading-tight text-navy">
                Onde a gente te envia seu resultado?
              </h2>
              <p className="mt-3 text-navy/70">
                Seu contato fica só com o Ale. Sem spam, sem lista de e-mail.
              </p>

              <form onSubmit={submitContact} className="mt-8 space-y-5">
                <InputField label="Seu nome" id="nome" error={contactErrors.nome}>
                  <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-base text-navy outline-none transition-colors focus:border-orange"
                    placeholder="Ex: Ana Souza"
                  />
                </InputField>

                <InputField label="WhatsApp (com DDD)" id="whatsapp" error={contactErrors.whatsapp}>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    maxLength={20}
                    autoComplete="tel"
                    required
                    className="w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-base text-navy outline-none transition-colors focus:border-orange"
                    placeholder="(19) 99123-6207"
                  />
                </InputField>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
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
            </div>
          </section>
        )}

        {step === "result" && result && (
          <section>
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-md">
              <h2 className="text-2xl md:text-3xl font-black leading-tight text-navy">
                {nome.split(" ")[0]}, seu resultado
              </h2>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-cream p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-navy/50">
                    Manutenção
                  </div>
                  <div className="mt-1 text-3xl md:text-4xl font-black text-navy">
                    {result.manutencao}
                    <span className="text-lg font-semibold text-navy/60"> kcal/dia</span>
                  </div>
                  <p className="mt-2 text-sm text-navy/60">
                    Para manter o peso atual com seu nível de atividade.
                  </p>
                </div>

                <div className="rounded-2xl bg-orange/10 p-5 border border-orange/20">
                  <div className="text-xs font-bold uppercase tracking-wider text-orange">
                    Meta sugerida
                  </div>
                  <div className="mt-1 text-3xl md:text-4xl font-black text-orange">
                    {result.meta}
                    <span className="text-lg font-semibold text-orange/70"> kcal/dia</span>
                  </div>
                  <p className="mt-2 text-sm text-navy/70">
                    Ajustada para: {GOAL_LABELS[result.data.objetivo].toLowerCase()}.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-green/20 bg-green/10 p-4 text-sm text-navy/80 leading-relaxed">
                <strong className="text-green">Aviso importante:</strong> esse número é uma
                estimativa. Um plano completo e ajustado à sua rotina real é o que faz a diferença
                de verdade.
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <div className="text-xs font-bold uppercase tracking-wider text-navy/50">
                  Resumo do cálculo
                </div>
                <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-navy/60">TMB estimada</span>
                    <span className="font-semibold text-navy">{result.tmb} kcal</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-navy/60">Atividade</span>
                    <span className="font-semibold text-navy">
                      {ACTIVITY_LABELS[result.data.atividade].split(" (")[0]}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-navy/60">Objetivo</span>
                    <span className="font-semibold text-navy">
                      {GOAL_LABELS[result.data.objetivo]}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-navy/60">Diferencial</span>
                    <span className="font-semibold text-navy">
                      {result.meta - result.manutencao > 0
                        ? `+${result.meta - result.manutencao}`
                        : result.meta - result.manutencao}{" "}
                      kcal
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-navy p-6 md:p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-black !text-white leading-tight">
                Agora vamos transformar esse número em resultado?
              </h3>
              <p className="mt-2 text-white/70">
                Fale com o Ale e receba um plano feito pra sua rotina real.
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
      </main>
    </div>
  );
}

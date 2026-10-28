export const MATCHING_COMPONENT_IDS = [
  "sun",
  "satellite",
  "aircraft",
  "atmosphere",
  "sensor",
] as const;

export const MATCHING_FUNCTION_IDS = [
  "carrier",
  "records",
  "source",
  "air-layer",
  "orbit",
] as const;

export type MatchingComponentId = (typeof MATCHING_COMPONENT_IDS)[number];
export type MatchingFunctionId = (typeof MATCHING_FUNCTION_IDS)[number];

export type MatchingConnection = {
  component: MatchingComponentId;
  function: MatchingFunctionId;
};

export type MatchingScore = {
  correctCount: number;
  total: number;
  scorePercent: number;
  complete: boolean;
};

export const MATCHING_ANSWERS: Record<
  MatchingComponentId,
  MatchingFunctionId
> = {
  sun: "source",
  satellite: "orbit",
  aircraft: "carrier",
  atmosphere: "air-layer",
  sensor: "records",
};

export function scoreMatchingGame(
  connections: readonly MatchingConnection[]
): MatchingScore {
  const total = MATCHING_COMPONENT_IDS.length;
  const correctCount = MATCHING_COMPONENT_IDS.filter((component) =>
    connections.some(
      (connection) =>
        connection.component === component &&
        connection.function === MATCHING_ANSWERS[component]
    )
  ).length;

  return {
    correctCount,
    total,
    scorePercent: toScorePercent(correctCount, total),
    complete: connections.length === total && correctCount === total,
  };
}

export type DetectiveNotes = {
  observations: string;
  interpretation: string;
  evidence: string;
  alternative: string;
  confidence: number;
  verification: string;
  changeInterpretation: string;
};

export type DetectiveAnswerField =
  | "observations"
  | "interpretation"
  | "evidence"
  | "alternative"
  | "verification"
  | "changeInterpretation";

type AnswerConcept = {
  label: string;
  patterns: RegExp[];
};

export const DETECTIVE_ANSWER_CONCEPTS: Record<
  DetectiveAnswerField,
  AnswerConcept[]
> = {
  observations: [
    { label: "Sungai", patterns: [/\bsungai\b/, /\baliran\s+air\b/, /\bkelokan\s+sungai\b/] },
    { label: "Pertanian", patterns: [/\bpertanian\b/, /\bsawah\b/, /\bladang\b/, /\bbercocok\s+tanam\b/] },
    { label: "Permukiman", patterns: [/\bpermukiman\b/, /\bpemukiman\b/, /\bperkampungan\b/, /\bperumahan\b/, /\btempat\s+tinggal\b/] },
  ],
  interpretation: [
    { label: "Pertanian", patterns: [/\bpertanian\b/, /\bsawah\b/, /\bladang\b/, /\baktivitas\s+bertani\b/] },
    { label: "Perkebunan", patterns: [/\bperkebunan\b/, /\bkebun\b/, /\bplantasi\b/] },
    { label: "Permukiman", patterns: [/\bpermukiman\b/, /\bpemukiman\b/, /\bperkampungan\b/, /\bperumahan\b/] },
  ],
  evidence: [
    { label: "Bentuk sungai", patterns: [/\bbentuk\s+sungai\b/, /\bsungai\b/, /\baliran\s+air\b/, /\bkelokan\b/, /\bmeander\b/] },
    { label: "Petak lahan", patterns: [/\bpetak\s+lahan\b/, /\bpetak\b/, /\bbatas\s+lahan\b/, /\bbidang\s+lahan\b/, /\bpola\s+lahan\b/] },
    { label: "Vegetasi rapat", patterns: [/\bvegetasi\s+rapat\b/, /\bvegetasi\b/, /\btumbuhan\s+(?:lebat|rapat)\b/, /\bkanopi\s+rapat\b/] },
  ],
  alternative: [
    { label: "Perkebunan kelapa", patterns: [/\bperkebunan\s+kelapa\b/, /\bkebun\s+kelapa\b/, /\bkelapa\b/] },
    { label: "Sawah", patterns: [/\bsawah\b/, /\bpersawahan\b/] },
  ],
  verification: [
    { label: "Jenis tanaman", patterns: [/\bjenis\s+tanaman\b/, /\bvarietas\b/, /\bkomoditas\b/, /\btanaman\s+apa\b/] },
    { label: "Data penggunaan lahan", patterns: [/\bdata\s+penggunaan\s+lahan\b/, /\bpenggunaan\s+lahan\b/, /\bperuntukan\s+lahan\b/] },
  ],
  changeInterpretation: [
    { label: "Data baru", patterns: [/\bdata\s+baru\b/, /\binformasi\s+baru\b/, /\btemuan\s+baru\b/, /\bbukti\s+baru\b/] },
    { label: "Citra resolusi tinggi", patterns: [/\bcitra\s+(?:dengan\s+)?resolusi\s+tinggi\b/, /\bresolusi\s+tinggi\b/, /\bcitra\s+lebih\s+detail\b/] },
  ],
};

export type DetectiveEvaluation = {
  total: number;
  earned: number;
  scorePercent: number;
  feedback: Array<{
    title: string;
    matched: string[];
    missing: string[];
  }>;
};

export function countDetectiveCompletedFields(notes: DetectiveNotes): number {
  return detectiveFields(notes).filter((field) => field.trim()).length;
}

export function evaluateDetectiveAnswers(
  notes: DetectiveNotes
): DetectiveEvaluation {
  const fields = Object.keys(DETECTIVE_ANSWER_CONCEPTS) as DetectiveAnswerField[];
  const total = fields.reduce(
    (sum, field) => sum + DETECTIVE_ANSWER_CONCEPTS[field].length,
    0
  );
  let earned = 0;
  const feedback = fields.map((field, index) => {
    const text = notes[field].toLocaleLowerCase("id-ID").replace(/\s+/g, " ");
    const matched = DETECTIVE_ANSWER_CONCEPTS[field].filter((concept) =>
      concept.patterns.some((pattern) => pattern.test(text))
    );
    earned += matched.length;
    const missing = DETECTIVE_ANSWER_CONCEPTS[field].filter(
      (concept) => !matched.includes(concept)
    );
    return {
      title: index < 3 ? `Tahap ${index + 1}` : `Tahap 4 · Pertanyaan ${index - 2}`,
      matched: matched.map(({ label }) => label),
      missing: missing.map(({ label }) => label),
    };
  });

  return {
    total,
    earned,
    scorePercent: toScorePercent(earned, total),
    feedback,
  };
}

export function calculateEpisode3FinalScore(
  gameScore: number | null,
  detectiveScore: number | null
): number | null {
  if (gameScore === null || detectiveScore === null) return null;

  return Math.round(
    clampScore(gameScore) * 0.2 + clampScore(detectiveScore) * 0.8
  );
}

function detectiveFields(notes: DetectiveNotes): string[] {
  return [
    notes.observations,
    notes.interpretation,
    notes.evidence,
    notes.alternative,
    notes.verification,
    notes.changeInterpretation,
  ];
}

function toScorePercent(earned: number, total: number): number {
  if (total <= 0) return 0;
  return clampScore(Math.round((earned / total) * 100));
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value));
}

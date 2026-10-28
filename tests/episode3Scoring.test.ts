import { describe, expect, test } from "vitest";
import {
  calculateEpisode3FinalScore,
  evaluateDetectiveAnswers,
  scoreMatchingGame,
  type DetectiveNotes,
} from "../src/lib/episode3Scoring";

const correctConnections = [
  { component: "sun", function: "source" },
  { component: "satellite", function: "orbit" },
  { component: "aircraft", function: "carrier" },
  { component: "atmosphere", function: "air-layer" },
  { component: "sensor", function: "records" },
] as const;

const emptyNotes: DetectiveNotes = {
  observations: "",
  interpretation: "",
  evidence: "",
  alternative: "",
  confidence: 1,
  verification: "",
  changeInterpretation: "",
};

describe("Episode 3 scoring", () => {
  test("scores all Game 1 pairs correctly", () => {
    expect(scoreMatchingGame(correctConnections)).toEqual({
      correctCount: 5,
      total: 5,
      scorePercent: 100,
      complete: true,
    });
  });

  test("scores all Game 1 pairs incorrectly", () => {
    expect(
      scoreMatchingGame([
        { component: "sun", function: "orbit" },
        { component: "satellite", function: "carrier" },
        { component: "aircraft", function: "records" },
        { component: "atmosphere", function: "source" },
        { component: "sensor", function: "air-layer" },
      ])
    ).toMatchObject({
      correctCount: 0,
      total: 5,
      scorePercent: 0,
      complete: false,
    });
  });

  test("preserves partial credit for mixed Game 1 pairs", () => {
    expect(
      scoreMatchingGame([
        correctConnections[0],
        correctConnections[1],
        { component: "aircraft", function: "records" },
        { component: "atmosphere", function: "source" },
        { component: "sensor", function: "air-layer" },
      ])
    ).toMatchObject({
      correctCount: 2,
      total: 5,
      scorePercent: 40,
      complete: false,
    });
  });

  test("gives zero for empty Detective answers", () => {
    expect(evaluateDetectiveAnswers(emptyNotes)).toMatchObject({
      earned: 0,
      total: 15,
      scorePercent: 0,
    });
  });

  test("scores matching Detective keywords partially", () => {
    const notes: DetectiveNotes = {
      ...emptyNotes,
      observations: "Terlihat sungai, area pertanian dan permukiman.",
      interpretation: "Kemungkinan pertanian.",
      evidence: "Bentuk sungai menjadi bukti.",
      alternative: "Mungkin sawah.",
      verification: "Perlu data penggunaan lahan.",
      changeInterpretation: "Data baru dapat mengubah dugaan.",
    };

    expect(evaluateDetectiveAnswers(notes)).toMatchObject({
      earned: 8,
      total: 15,
      scorePercent: 53,
    });
  });

  test("does not include confidence in the Detective score", () => {
    const lowConfidence = evaluateDetectiveAnswers({
      ...emptyNotes,
      observations: "sungai",
      confidence: 1,
    });
    const highConfidence = evaluateDetectiveAnswers({
      ...emptyNotes,
      observations: "sungai",
      confidence: 5,
    });

    expect(highConfidence).toEqual(lowConfidence);
  });

  test("requires both activity scores before calculating the final score", () => {
    expect(calculateEpisode3FinalScore(null, 80)).toBeNull();
    expect(calculateEpisode3FinalScore(80, null)).toBeNull();
  });

  test("applies 20/80 weighting and rounds the result", () => {
    expect(calculateEpisode3FinalScore(100, 50)).toBe(60);
    expect(calculateEpisode3FinalScore(33, 66)).toBe(59);
  });

  test("clamps component scores to 0..100 before weighting", () => {
    expect(calculateEpisode3FinalScore(-20, 150)).toBe(80);
    expect(calculateEpisode3FinalScore(0, 0)).toBe(0);
  });
});

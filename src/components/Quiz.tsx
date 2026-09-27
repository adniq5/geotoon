"use client";

import { useState } from "react";
import type { Evaluation } from "@/data/evaluations";

type QuizProps = {
  evaluation: Evaluation;
};

export default function Quiz({ evaluation }: QuizProps) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = evaluation.questions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (currentQuestion < evaluation.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const optionLetters = ["A", "B", "C", "D"];

  /*
  |--------------------------------------------------------------------------
  | HALAMAN PEMBUKA
  |--------------------------------------------------------------------------
  */

  if (!started) {
    return (
      <div className="min-h-screen bg-[#eef8ee] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <a
              href="/episodes"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-md transition hover:scale-105"
            >
              ← Kembali
            </a>

            <div className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md">
              🌍 GEOTOON
            </div>
          </div>

          {/* COVER */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            <img
              src={evaluation.introImage}
              alt={evaluation.title}
              className="block h-auto w-full"
            />
          </div>

          {/* INFO */}
          <div className="mx-auto mt-6 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Evaluasi Pembelajaran
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-800 md:text-4xl">
              {evaluation.title}
            </h1>

            <p className="mt-2 text-slate-600">
              Materi:{" "}
              <span className="font-bold">{evaluation.subject}</span>
            </p>

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-slate-600">
                Yuk, uji pemahamanmu setelah mempelajari materi
                episode ini!
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                {evaluation.questions.length} soal pilihan ganda
              </p>
            </div>

            {/* START */}
            <button
              onClick={() => setStarted(true)}
              className="mt-6 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-700"
            >
              Mulai Evaluasi →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | HASIL EVALUASI
  |--------------------------------------------------------------------------
  */

  if (finished) {
    const percentage = Math.round(
      (score / evaluation.questions.length) * 100
    );

    /*
     * Mengambil nomor episode dari judul.
     *
     * Contoh:
     * "Evaluasi Episode 1" → 1
     * "Evaluasi Episode 2" → 2
     * "Evaluasi Episode 3" → 3
     */
    const episodeMatch = evaluation.title.match(/Episode\s+(\d+)/i);

    const currentEpisode = episodeMatch
      ? Number(episodeMatch[1])
      : 1;

    /*
     * Menentukan episode berikutnya.
     */
    const nextEpisode = currentEpisode + 1;

    /*
     * GEOTOON saat ini memiliki 5 episode.
     */
    const hasNextEpisode = nextEpisode <= 5;

    /*
     * Membuat URL episode berikutnya.
     *
     * 1 → /episode/episode-02
     * 2 → /episode/episode-03
     * dst.
     */
    const nextEpisodeHref = `/episode/episode-${String(
      nextEpisode
    ).padStart(2, "0")}`;

    let message = "Tetap semangat belajar!";

    if (percentage === 100) {
      message = "Luar biasa! Semua jawaban benar! 🎉";
    } else if (percentage >= 67) {
      message = "Bagus! Pemahamanmu sudah cukup baik! 👏";
    } else {
      message = "Yuk, pelajari kembali materinya! 💪";
    }

    return (
      <div className="min-h-screen bg-[#eef8ee] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">

          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <a
              href="/episodes"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-md transition hover:scale-105"
            >
              ← Episode
            </a>

            <div className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md">
              HASIL EVALUASI
            </div>
          </div>

          {/* SCORE */}
          <div className="rounded-3xl bg-white p-6 text-center shadow-xl md:p-10">

            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Evaluasi Selesai
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-800">
              {evaluation.title}
            </h1>

            {/* NILAI */}
            <div className="mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-100">
              <div>
                <p className="text-5xl font-black text-emerald-600">
                  {percentage}
                </p>

                <p className="font-bold text-slate-500">
                  NILAI
                </p>
              </div>
            </div>

            {/* JUMLAH BENAR */}
            <p className="mt-6 text-xl font-bold text-slate-800">
              {score} / {evaluation.questions.length} jawaban benar
            </p>

            {/* PESAN */}
            <p className="mt-2 text-slate-600">
              {message}
            </p>

            {/* BUTTON */}
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              {/* ULANGI EVALUASI */}
              <button
                onClick={handleRestart}
                className="rounded-full bg-slate-100 px-7 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
              >
                ↻ Ulangi Evaluasi
              </button>

              {/* NEXT EPISODE */}
              {hasNextEpisode ? (
                <a
                  href={nextEpisodeHref}
                  className="rounded-full bg-emerald-600 px-8 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-700"
                >
                  Lanjut Episode {nextEpisode} →
                </a>
              ) : (
                <a
                  href="/episodes"
                  className="rounded-full bg-blue-600 px-8 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
                >
                  🏠 Selesai — Daftar Episode
                </a>
              )}
            </div>
          </div>

          {/* KUNCI JAWABAN */}
          <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-xl">

            <div className="border-b bg-emerald-600 px-5 py-4 text-center">
              <h2 className="text-xl font-black text-white">
                Kunci Jawaban & Pembahasan
              </h2>
            </div>

            <img
              src={evaluation.answerImage}
              alt="Kunci jawaban"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | HALAMAN SOAL
  |--------------------------------------------------------------------------
  */

  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.answer;

  return (
    <div className="min-h-screen bg-[#eef8ee] px-3 py-5 md:px-6">
      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <a
            href="/episodes"
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-md transition hover:scale-105"
          >
            ← Kembali
          </a>

          <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-md">
            {evaluation.title}
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-5 rounded-2xl bg-white p-4 shadow-md">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm font-bold text-slate-600">
              Soal {currentQuestion + 1} dari{" "}
              {evaluation.questions.length}
            </span>

            <span className="text-sm font-black text-emerald-600">
              {Math.round(
                ((currentQuestion + 1) /
                  evaluation.questions.length) *
                  100
              )}
              %
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    evaluation.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* GAMBAR SOAL */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          <img
            src={question.image}
            alt={`Soal ${currentQuestion + 1}`}
            className="block h-auto w-full"
          />
        </div>

        {/* INTERACTIVE ANSWERS */}
        <div className="mx-auto mt-6 max-w-4xl">

          <div className="grid gap-3 md:grid-cols-2">

            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isAnswerCorrect = index === question.answer;

              let buttonClass =
                "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-400";

              /*
               * Jawaban benar
               */
              if (isAnswered && isAnswerCorrect) {
                buttonClass =
                  "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300";
              }

              /*
               * Jawaban user salah
               */
              if (
                isAnswered &&
                isSelected &&
                !isAnswerCorrect
              ) {
                buttonClass =
                  "border-red-500 bg-red-50 ring-2 ring-red-300";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-sm transition ${buttonClass}`}
                >

                  {/* LETTER */}
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black text-white ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-pink-500"
                        : index === 2
                        ? "bg-yellow-500 text-slate-900"
                        : "bg-emerald-500"
                    }`}
                  >
                    {optionLetters[index]}
                  </span>

                  {/* OPTION TEXT */}
                  <span className="font-semibold text-slate-700">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FEEDBACK */}
          {isAnswered && (
            <div
              className={`mt-5 rounded-2xl border-2 p-5 ${
                isCorrect
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-red-300 bg-red-50"
              }`}
            >

              <div className="flex items-start gap-3">

                <div className="text-2xl">
                  {isCorrect ? "✅" : "❌"}
                </div>

                <div>

                  <h3
                    className={`font-black ${
                      isCorrect
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {isCorrect
                      ? "Jawaban kamu benar!"
                      : `Jawaban yang benar adalah ${
                          optionLetters[question.answer]
                        }`}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {question.explanation}
                  </p>

                </div>
              </div>
            </div>
          )}

          {/* NEXT */}
          {isAnswered && (
            <div className="mt-5 flex justify-end">

              <button
                onClick={handleNext}
                className="rounded-full bg-emerald-600 px-8 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                {currentQuestion ===
                evaluation.questions.length - 1
                  ? "Lihat Hasil →"
                  : "Soal Berikutnya →"}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
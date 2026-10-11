"use client";

import Image from "next/image";
import { useState } from "react";

type Notes = {
  observations: string;
  interpretation: string;
  evidence: string;
  alternative: string;
  confidence: number;
  verification: string;
  changeInterpretation: string;
};

type Prompt = {
  title: string;
  description: string;
  field: keyof Notes;
  label: string;
  placeholder: string;
  additionalFields?: {
    field: keyof Notes;
    label: string;
    placeholder: string;
  }[];
};

const prompts: Prompt[] = [
  {
    title: "Tahap 1 — Pengamatan",
    description:
      "Catat apa yang benar-benar terlihat pada citra tanpa langsung menebak.",
    field: "observations",
    label:
      "Apa saja bentuk, warna atau rona, pola, tekstur, dan susunan objek yang kamu amati?",
    placeholder:
      "Contoh: terlihat garis berkelok, area hijau luas, dan kumpulan bentuk kecil...",
  },
  {
    title: "Tahap 2 — Interpretasi",
    description:
      "Gunakan hasil pengamatan untuk menyusun dugaan tentang kenampakan wilayah.",
    field: "interpretation",
    label:
      "Menurutmu, objek atau penggunaan lahan apa yang mungkin terlihat? Jelaskan interpretasimu.",
    placeholder: "Menurut saya, area ini kemungkinan merupakan ... karena ...",
  },
  {
    title: "Tahap 3 — Bukti dan Alasan",
    description:
      "Hubungkan dugaanmu dengan petunjuk visual yang benar-benar terlihat.",
    field: "evidence",
    label:
      "Petunjuk apa pada citra yang paling mendukung interpretasimu? Mengapa petunjuk itu relevan?",
    placeholder:
      "Bukti yang mendukung dugaan saya adalah ... Petunjuk ini menunjukkan ...",
  },
  {
    title: "Tahap 4 — Uji Dugaan",
    description:
      "Pikirkan kemungkinan lain. Satu bentuk pada citra belum tentu hanya memiliki satu arti.",
    field: "alternative",
    label:
      "Adakah interpretasi lain yang juga masuk akal? Jelaskan kemungkinan lain tersebut.",
    placeholder:
      "Interpretasi lain yang juga masuk akal adalah ... karena ...",
    additionalFields: [
      {
        field: "verification",
        label:
          "Informasi tambahan apa yang kamu perlukan untuk memastikannya?",
        placeholder:
          "Misalnya: citra dengan resolusi lebih tinggi, data lapangan, atau informasi waktu pengambilan citra...",
      },
      {
        field: "changeInterpretation",
        label: "Apa yang dapat membuatmu mengubah interpretasi?",
        placeholder:
          "Saya akan mengubah interpretasi jika menemukan ... karena ...",
      },
    ],
  },
];

const emptyNotes: Notes = {
  observations: "",
  interpretation: "",
  evidence: "",
  alternative: "",
  confidence: 3,
  verification: "",
  changeInterpretation: "",
};

function createReport(name: string, notes: Notes) {
  return [
    "GEOTOON — LAPORAN MISI DETEKTIF CITRA",
    `Nama: ${name.trim()}`,
    "",
    "1. Pengamatan",
    notes.observations.trim(),
    "",
    "2. Interpretasi",
    notes.interpretation.trim(),
    "",
    "3. Bukti dan alasan",
    `Bukti pendukung: ${notes.evidence.trim()}`,
    "",
    "4. Uji dugaan",
    `Interpretasi alternatif: ${notes.alternative.trim()}`,
    `Tingkat keyakinan: ${notes.confidence}/5`,
    `Informasi tambahan yang diperlukan: ${notes.verification.trim()}`,
    `Hal yang dapat mengubah interpretasi: ${notes.changeInterpretation.trim()}`,
  ].join("\n");
}

export default function MisiDetektifCitra() {
  const [name, setName] = useState("");
  const [step, setStep] = useState(-1);
  const [notes, setNotes] = useState<Notes>(emptyNotes);
  const [copyMessage, setCopyMessage] = useState("");

  const updateNote = (field: keyof Notes, value: string) => {
    setNotes((previous) => ({ ...previous, [field]: value }));
  };

  const canContinue = () => {
    if (step < 0) return name.trim().length > 0;
    const prompt = prompts[step];
    if (!prompt) return false;
    const primaryAnswer = notes[prompt.field];
    if (typeof primaryAnswer !== "string" || !primaryAnswer.trim())
      return false;
    if (
      prompt.additionalFields?.some(
        ({ field }) => {
          const value = notes[field];
          return typeof value !== "string" || !value.trim();
        }
      )
    ) {
      return false;
    }
    return true;
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(createReport(name, notes));
      setCopyMessage("Laporan berhasil disalin.");
    } catch {
      setCopyMessage(
        "Laporan tidak dapat disalin otomatis di browser ini. Gunakan tombol unduh laporan."
      );
    }
  };

  const downloadReport = () => {
    const report = new Blob([createReport(name, notes)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(report);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-misi-detektif-citra.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (step === prompts.length) {
    return (
      <section className="detective-game" aria-labelledby="detective-title">
        <span className="eyebrow">PENYELIDIKAN SELESAI</span>
        <h2 id="detective-title">Bagus, {name.trim()}!</h2>
        <p>
          Kamu sudah menghubungkan pengamatan dengan bukti, mempertimbangkan
          alternatif, dan mencatat batasan kesimpulan.
        </p>
        <div className="detective-report">
          <h3>Laporan penyelidikanmu</h3>
          <pre>{createReport(name, notes)}</pre>
        </div>
        <div className="detective-actions">
          <button className="button primary" onClick={downloadReport}>
            Unduh laporan
          </button>
          <button className="button secondary" onClick={copyReport}>
            Salin laporan
          </button>
          <button
            className="button secondary"
            onClick={() => {
              setNotes(emptyNotes);
              setName("");
              setCopyMessage("");
              setStep(-1);
            }}
          >
            Mulai lagi
          </button>
        </div>
        <p className="detective-status" role="status" aria-live="polite">
          {copyMessage}
        </p>
      </section>
    );
  }

  const prompt = step >= 0 ? prompts[step] : undefined;

  return (
    <section className="detective-game" aria-labelledby="detective-title">
      <div className="detective-heading">
        <span className="eyebrow">GEOTOON</span>
        <h2 id="detective-title">Misi Detektif Citra</h2>
        <p>
          Jangan buru-buru menyimpulkan. Amati petunjuk, susun alasan, lalu uji
          apakah dugaanmu masuk akal.
        </p>
      </div>

      <figure className="detective-image">
        <Image
          src="/animations/episode-03/citra-game-2.jpg"
          alt="Foto udara menampilkan sungai berkelok, petak pertanian, vegetasi, dan permukiman"
          width={1200}
          height={800}
          priority
        />
        <figcaption>
          Sumber: Pexels/Tom Fisk
        </figcaption>
      </figure>

      {step === -1 ? (
        <div className="detective-briefing">
          <h3>Briefing misi</h3>
          <p>
            Kamu menerima citra wilayah yang belum diketahui. Amati kenampakan
            yang terlihat, lalu jelaskan dugaan dan bukti yang mendukungnya.
            Interpretasi yang berbeda tetap dapat diterima jika alasannya
            didukung petunjuk citra.
          </p>
          <label className="detective-label" htmlFor="detective-name">
            Nama detektif
          </label>
          <input
            id="detective-name"
            className="detective-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            autoComplete="name"
            placeholder="Tulis namamu"
          />
        </div>
      ) : (
        <>
          <div className="detective-progress">
            <span>Tahap {step + 1}/{prompts.length}</span>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Kemajuan misi"
              aria-valuemin={0}
              aria-valuemax={prompts.length}
              aria-valuenow={step + 1}
            >
              <span
                style={{ width: `${((step + 1) / prompts.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="detective-prompt">
            <h3>{prompt?.title}</h3>
            <p>{prompt?.description}</p>
            {prompt && (
              <>
                <label className="detective-label" htmlFor={`detective-${prompt.field}`}>
                  {prompt.label}
                </label>
                <textarea
                  id={`detective-${prompt.field}`}
                  className="detective-input detective-textarea"
                  value={notes[prompt.field]}
                  onChange={(event) => updateNote(prompt.field, event.target.value)}
                  maxLength={1200}
                  rows={4}
                  placeholder={prompt.placeholder}
                />
                {prompt.additionalFields?.map(
                  ({ field, label, placeholder }) => (
                    <div key={field}>
                      <label
                        className="detective-label"
                        htmlFor={`detective-${field}`}
                      >
                        {label}
                      </label>
                      <textarea
                        id={`detective-${field}`}
                        className="detective-input detective-textarea"
                        value={notes[field]}
                        onChange={(event) =>
                          updateNote(field, event.target.value)
                        }
                        maxLength={1200}
                        rows={4}
                        placeholder={placeholder}
                      />
                    </div>
                  )
                )}
                {step === 3 && (
                  <>
                    <label
                      className="detective-label"
                      htmlFor="detective-confidence"
                    >
                      Seberapa yakin kamu dengan dugaanmu?{" "}
                      <output className="detective-confidence-value">
                        {notes.confidence}/5 —{" "}
                        {notes.confidence === 1
                          ? "Masih sangat ragu"
                          : notes.confidence === 3
                            ? "Cukup yakin"
                            : notes.confidence === 5
                              ? "Sangat yakin"
                              : "Yakin"}
                      </output>
                    </label>
                    <input
                      id="detective-confidence"
                      type="range"
                      className="detective-input"
                      min={1}
                      max={5}
                      step={1}
                      value={notes.confidence}
                      aria-valuetext={
                        notes.confidence === 1
                          ? "1 dari 5, masih sangat ragu"
                          : notes.confidence === 3
                            ? "3 dari 5, cukup yakin"
                            : notes.confidence === 5
                              ? "5 dari 5, sangat yakin"
                              : `${notes.confidence} dari 5`
                      }
                      onChange={(event) =>
                        setNotes((previous) => ({
                          ...previous,
                          confidence: Number(event.target.value),
                        }))
                      }
                    />
                    <div className="detective-confidence-scale" aria-hidden="true">
                      <span>1 — Masih sangat ragu</span>
                      <span>3 — Cukup yakin</span>
                      <span>5 — Sangat yakin</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}

      <div className="detective-actions">
        {step >= 0 && (
          <button
            className="button secondary"
            onClick={() => setStep((current) => current - 1)}
          >
            ← Kembali
          </button>
        )}
        <button
          className="button primary"
          disabled={!canContinue()}
          onClick={() => {
            setCopyMessage("");
            setStep((current) => current + 1);
          }}
        >
          {step < 0
            ? "Mulai penyelidikan"
            : step === prompts.length - 1
              ? "Selesaikan Misi"
              : "Lanjutkan →"}
        </button>
      </div>
      <p className="detective-footnote">
        Penilaian berfokus pada kualitas pengamatan dan alasanmu, bukan pada
        satu jawaban kunci. Jawaban disimpan hanya di perangkatmu selama sesi
        ini.
      </p>
    </section>
  );
}

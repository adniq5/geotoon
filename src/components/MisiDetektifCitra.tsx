"use client";

import { useState } from "react";

type Notes = {
  observations: string;
  interpretation: string;
  evidence: string;
  alternative: string;
  confidence: string;
  verification: string;
};

type Prompt = {
  title: string;
  description: string;
  field: keyof Notes;
  label: string;
  placeholder: string;
  secondField?: keyof Notes;
  secondLabel?: string;
  secondPlaceholder?: string;
};

const prompts: Prompt[] = [
  {
    title: "Amati citra",
    description:
      "Catat hal yang benar-benar terlihat. Perhatikan rona atau warna, bentuk, ukuran, tekstur, pola, bayangan, dan susunan objek. Tahan dulu kesimpulanmu.",
    field: "observations",
    label: "Apa saja ciri yang kamu amati?",
    placeholder:
      "Contoh: ada bidang memanjang berwarna biru, beberapa petak berpola teratur, dan area hijau bertekstur rapat...",
  },
  {
    title: "Susun interpretasi",
    description:
      "Buat dugaan tentang objek atau fungsi wilayah. Hubungkan dugaanmu dengan ciri yang kamu amati; tidak harus sama dengan dugaan teman.",
    field: "interpretation",
    label: "Apa dugaanmu, dan bagaimana ciri citra mendukungnya?",
    placeholder:
      "Menurut saya, area ... mungkin merupakan ... karena ciri ... menunjukkan ...",
  },
  {
    title: "Uji bukti dan kemungkinan lain",
    description:
      "Pilih bukti visual yang paling kuat untuk mendukung dugaanmu. Lalu pertimbangkan satu penjelasan alternatif yang juga mungkin.",
    field: "evidence",
    label: "Bukti apa yang paling mendukung dugaanmu?",
    placeholder: "Ciri yang paling mendukung adalah ... karena ...",
    secondField: "alternative",
    secondLabel: "Interpretasi lain apa yang mungkin?",
    secondPlaceholder:
      "Alternatif lain bisa jadi ... Saya akan membedakannya dengan melihat ...",
  },
  {
    title: "Refleksikan kesimpulan",
    description:
      "Tentukan seberapa yakin kamu—bukan untuk mencari skor benar atau salah. Sebutkan informasi tambahan yang akan membantu menguji dugaanmu.",
    field: "verification",
    label: "Informasi atau data apa yang perlu diperiksa berikutnya?",
    placeholder:
      "Saya ingin membandingkan citra dari waktu lain, melihat legenda, atau mencari data pendukung seperti ...",
  },
];

const emptyNotes: Notes = {
  observations: "",
  interpretation: "",
  evidence: "",
  alternative: "",
  confidence: "",
  verification: "",
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
    "3. Bukti dan interpretasi alternatif",
    `Bukti pendukung: ${notes.evidence.trim()}`,
    `Interpretasi alternatif: ${notes.alternative.trim()}`,
    "",
    "4. Refleksi",
    `Tingkat keyakinan: ${notes.confidence}`,
    `Informasi tambahan yang diperlukan: ${notes.verification.trim()}`,
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
    if (!prompt || !notes[prompt.field].trim()) return false;
    if (prompt.secondField && !notes[prompt.secondField].trim()) return false;
    if (step === 3 && !notes.confidence) return false;
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
  const secondField = prompt?.secondField;

  return (
    <section className="detective-game" aria-labelledby="detective-title">
      <div className="detective-heading">
        <span className="eyebrow">GEOTOON • KELAS X</span>
        <h2 id="detective-title">Misi Detektif Citra</h2>
        <p>
          Jangan buru-buru menyimpulkan. Amati petunjuk, susun alasan, lalu uji
          apakah dugaanmu masuk akal.
        </p>
      </div>

      <div className="detective-image">
        <svg
          viewBox="0 0 720 360"
          role="img"
          aria-label="Citra latihan ilustratif yang menampilkan sungai, petak lahan, vegetasi, dan permukiman"
        >
          <rect width="720" height="360" fill="#d8e5b5" />
          <path d="M0 0h280l-23 99-104 31-28 96L0 244z" fill="#a8c982" />
          <path d="M405 0h315v132l-76 32-57-46-124 16-80-71z" fill="#8cba75" />
          <path d="M0 277l95-28 58 35 115-9 56 85H0z" fill="#8ebc74" />
          <path d="M441 217l107-47 45 29 127-10v171H462l-28-71z" fill="#abc985" />
          <path d="M318-20c-36 61 30 84-3 139s-3 71-43 115 4 83-31 146" fill="none" stroke="#62a9c6" strokeWidth="38" />
          <path d="M318-20c-36 61 30 84-3 139s-3 71-43 115 4 83-31 146" fill="none" stroke="#a3d7e2" strokeWidth="21" />
          <g fill="#d8bd82" stroke="#f2dfae" strokeWidth="4">
            <path d="M30 34h77v53H30z" />
            <path d="M115 34h77v53h-77z" />
            <path d="M200 34h56v53h-56z" />
            <path d="M36 96h74v56H36z" />
            <path d="M118 96h94v56h-94z" />
            <path d="M34 161h72v49H34z" />
            <path d="M115 161h81v49h-81z" />
            <path d="M491 47h76v54h-76z" />
            <path d="M576 47h104v54H576z" />
            <path d="M502 110h91v53h-91z" />
            <path d="M602 110h78v53h-78z" />
          </g>
          <g fill="#748e5d">
            <circle cx="44" cy="251" r="11" /><circle cx="73" cy="235" r="9" />
            <circle cx="98" cy="258" r="12" /><circle cx="133" cy="237" r="10" />
            <circle cx="173" cy="267" r="12" /><circle cx="203" cy="246" r="10" />
            <circle cx="510" cy="219" r="12" /><circle cx="543" cy="202" r="10" />
            <circle cx="581" cy="231" r="12" /><circle cx="622" cy="209" r="10" />
            <circle cx="660" cy="240" r="11" /><circle cx="544" cy="285" r="11" />
            <circle cx="591" cy="300" r="12" /><circle cx="641" cy="280" r="10" />
          </g>
          <path d="M415 0l43 96-9 83 61 62 33 119M0 225l136 34 110-10 116 48 111-20 99 40" fill="none" stroke="#eee5cc" strokeWidth="8" />
          <path d="M415 0l43 96-9 83 61 62 33 119M0 225l136 34 110-10 116 48 111-20 99 40" fill="none" stroke="#b8a681" strokeWidth="2" strokeDasharray="8 7" />
        </svg>
        <p>
          Citra latihan ilustratif. Tidak mewakili lokasi nyata; buat dugaanmu
          sendiri dari petunjuk visual.
        </p>
      </div>

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
            <span>Tahap {step + 1} dari {prompts.length}</span>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Kemajuan misi"
              aria-valuemin={0}
              aria-valuemax={prompts.length}
              aria-valuenow={step + 1}
            >
              <span style={{ width: `${((step + 1) / prompts.length) * 100}%` }} />
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
                {secondField && prompt.secondLabel && prompt.secondPlaceholder && (
                  <>
                    <label
                      className="detective-label"
                      htmlFor={`detective-${secondField}`}
                    >
                      {prompt.secondLabel}
                    </label>
                    <textarea
                      id={`detective-${secondField}`}
                      className="detective-input detective-textarea"
                      value={notes[secondField]}
                      onChange={(event) =>
                        updateNote(secondField, event.target.value)
                      }
                      maxLength={1200}
                      rows={3}
                      placeholder={prompt.secondPlaceholder}
                    />
                  </>
                )}
                {step === 3 && (
                  <>
                    <label
                      className="detective-label"
                      htmlFor="detective-confidence"
                    >
                      Seberapa yakin kamu dengan dugaanmu?
                    </label>
                    <select
                      id="detective-confidence"
                      className="detective-input"
                      value={notes.confidence}
                      onChange={(event) =>
                        updateNote("confidence", event.target.value)
                      }
                    >
                      <option value="">Pilih tingkat keyakinan</option>
                      <option value="Masih menjajaki">Masih menjajaki</option>
                      <option value="Cukup yakin">Cukup yakin</option>
                      <option value="Sangat yakin">Sangat yakin</option>
                    </select>
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
              ? "Selesaikan misi"
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

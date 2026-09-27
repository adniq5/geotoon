"use client";

import { useEffect, useRef, useState } from "react";

type Scene = {
  id: string;
  title: string;
  image: string;
  voice?: string;
};

type ComicReaderProps = {
  episodeId: string;
  episodeNumber: number;
  title: string;
  cover: string;
  preview: string;
  scenes: Scene[];
  backgroundMusic?: string;
};

type Stage = "cover" | "preview" | "scene";

export default function ComicReader({
  episodeId,
  episodeNumber,
  title,
  cover,
  preview,
  scenes,
  backgroundMusic,
}: ComicReaderProps) {
  const [stage, setStage] = useState<Stage>("cover");
  const [current, setCurrent] = useState(0);

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const touchStartX = useRef<number | null>(null);

  const scene = scenes[current];

  /*
   * =========================
   * BACKGROUND MUSIC
   * =========================
   */

  useEffect(() => {
    if (!backgroundMusic) return;

    const audio = new Audio(backgroundMusic);

    audio.loop = true;
    audio.volume = 0.18;

    musicRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      musicRef.current = null;
    };
  }, [backgroundMusic]);

  /*
   * =========================
   * VOICE OVER
   * =========================
   */

  useEffect(() => {
    if (stage !== "scene") return;

    if (!scene?.voice) {
      setIsVoicePlaying(false);
      return;
    }

    voiceRef.current?.pause();

    const voice = new Audio(scene.voice);

    voice.volume = 1;

    voiceRef.current = voice;

    setIsVoicePlaying(true);

    voice.play().catch(() => {
      setIsVoicePlaying(false);
    });

    voice.onended = () => {
      setIsVoicePlaying(false);
    };

    return () => {
      voice.pause();
      voice.currentTime = 0;
    };
  }, [stage, current, scene?.voice]);

  /*
   * =========================
   * START STORY
   * =========================
   */

  const startStory = async () => {
    setStage("scene");
    setCurrent(0);

    if (musicRef.current) {
      try {
        await musicRef.current.play();
        setIsMusicPlaying(true);
      } catch {
        setIsMusicPlaying(false);
      }
    }
  };

  /*
   * =========================
   * NAVIGATION
   * =========================
   */

  const nextScene = () => {
    if (current >= scenes.length - 1) return;

    setCurrent((prev) => prev + 1);
  };

  const previousScene = () => {
    if (current <= 0) return;

    setCurrent((prev) => prev - 1);
  };

  /*
   * =========================
   * REPLAY VOICE
   * =========================
   */

  const replayVoice = () => {
    if (!scene?.voice) return;

    voiceRef.current?.pause();

    const voice = new Audio(scene.voice);

    voice.volume = 1;

    voiceRef.current = voice;

    setIsVoicePlaying(true);

    voice.play().catch(() => {
      setIsVoicePlaying(false);
    });

    voice.onended = () => {
      setIsVoicePlaying(false);
    };
  };

  /*
   * =========================
   * MUSIC
   * =========================
   */

  const toggleMusic = async () => {
    if (!musicRef.current) return;

    if (isMusicPlaying) {
      musicRef.current.pause();
      setIsMusicPlaying(false);
      return;
    }

    try {
      await musicRef.current.play();
      setIsMusicPlaying(true);
    } catch {
      setIsMusicPlaying(false);
    }
  };

  /*
   * =========================
   * SWIPE
   * =========================
   */

  const handleTouchStart = (event: React.TouchEvent) => {
    if (stage !== "scene") return;

    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (stage !== "scene") return;

    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0].clientX;

    const difference = touchStartX.current - endX;

    if (Math.abs(difference) > 60) {
      if (difference > 0) {
        nextScene();
      } else {
        previousScene();
      }
    }

    touchStartX.current = null;
  };

  /*
   * =========================
   * COVER
   * =========================
   */

  if (stage === "cover") {
    return (
      <section className="reader-page page-shell">
        <div className="reader">

          <div className="reader-header">
            <div className="eyebrow">
              GEOTOON • EPISODE {String(episodeNumber).padStart(2, "0")}
            </div>

            <h1>{title}</h1>

            <p>
              Sebuah petualangan untuk mengenal Geografi
              melalui komik interaktif.
            </p>
          </div>

          <div className="reader-frame">
            <img
              src={cover}
              alt={`Cover GEOTOON Episode ${episodeNumber}`}
              className="comic-image"
              draggable={false}
            />
          </div>

          <div className="reader-finish">

            <div>
              <div className="result-icon">🌍</div>

              <p>
                Siap mengikuti petualangan
                GEOTOON?
              </p>
            </div>

            <button
              className="button primary"
              onClick={() => setStage("preview")}
            >
              👀 Lihat Preview
            </button>

          </div>

        </div>
      </section>
    );
  }

  /*
   * =========================
   * PREVIEW
   * =========================
   */

  if (stage === "preview") {
    return (
      <section className="reader-page page-shell">
        <div className="reader">

          <div className="reader-header">

            <div className="eyebrow">
              GEOTOON • PREVIEW EPISODE{" "}
              {String(episodeNumber).padStart(2, "0")}
            </div>

            <h1>{title}</h1>

            <p>
              Lihat gambaran perjalanan sebelum
              memulai cerita.
            </p>

          </div>

          <div className="reader-frame">
            <img
              src={preview}
              alt={`Preview GEOTOON Episode ${episodeNumber}`}
              className="comic-image"
              draggable={false}
            />
          </div>

          <div className="reader-controls">

            <button
              className="button secondary"
              onClick={() => setStage("cover")}
            >
              ← Kembali
            </button>

            <button
              className="button primary"
              onClick={startStory}
            >
              ▶ Mulai Cerita
            </button>

          </div>

        </div>
      </section>
    );
  }

  /*
   * =========================
   * SCENE READER
   * =========================
   */

  return (
    <section className="reader-page page-shell">

      <div className="reader-header">

        <div className="eyebrow">
          GEOTOON • EPISODE{" "}
          {String(episodeNumber).padStart(2, "0")}
        </div>

        <h1>{title}</h1>

        <p>
          Geser komik atau gunakan tombol
          untuk melanjutkan petualangan.
        </p>

      </div>

      <div className="reader">

        {/* SCENE COUNT */}

        <div className="reader-meta">
          Scene {current + 1} dari {scenes.length}
        </div>

        {/* PROGRESS */}

        <div className="progress-track">

          <span
            style={{
              width: `${
                ((current + 1) / scenes.length) * 100
              }%`,
            }}
          />

        </div>

        {/* COMIC */}

        <div
          className="reader-frame"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          <img
            src={scene.image}
            alt={`GEOTOON Episode ${episodeNumber} ${scene.title}`}
            className="comic-image"
            draggable={false}
          />

        </div>

        {/* SCENE TITLE */}

        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
          }}
        >
          <div className="eyebrow">
            SCENE {current + 1}
          </div>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "clamp(22px, 4vw, 30px)",
            }}
          >
            {scene.title}
          </h2>
        </div>

        {/* AUDIO */}

        <div className="audio-row">

          <div className="audio-chip muted">
            🎙️{" "}
            {isVoicePlaying
              ? "Sedang membacakan..."
              : scene.voice
              ? "Voice-over selesai"
              : "Voice-over belum tersedia"}
          </div>

          <button
            className="audio-chip"
            onClick={replayVoice}
            disabled={!scene.voice}
          >
            🔁 Replay Voice
          </button>

          <button
            className="audio-chip"
            onClick={toggleMusic}
            disabled={!backgroundMusic}
          >
            {isMusicPlaying
              ? "🎵 BGM ON"
              : "🔇 BGM OFF"}
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="reader-controls">

          <button
            className="button secondary"
            onClick={previousScene}
            disabled={current === 0}
          >
            ← Sebelumnya
          </button>

          <div className="panel-count">
            {current + 1} / {scenes.length}
          </div>

          <button
            className="button primary"
            onClick={nextScene}
            disabled={current === scenes.length - 1}
          >
            Berikutnya →
          </button>

        </div>

        {/* DOTS */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "7px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >

          {scenes.map((sceneItem, index) => (

            <button
              key={sceneItem.id}
              onClick={() => setCurrent(index)}
              aria-label={`Scene ${index + 1}`}
              style={{
                width:
                  index === current
                    ? "30px"
                    : "10px",

                height: "10px",

                padding: 0,

                border: "none",

                borderRadius: "999px",

                background:
                  index === current
                    ? "#1877d2"
                    : "#d9cfbc",

                cursor: "pointer",

                transition: ".2s ease",
              }}
            />

          ))}

        </div>

        {/* SWIPE HINT */}

        <p
          style={{
            textAlign: "center",
            color: "#62708a",
            fontSize: "13px",
            fontWeight: 700,
            marginTop: "14px",
          }}
        >
          👆 Geser kiri / kanan pada komik
          untuk berpindah scene
        </p>

        {/* FINISH */}

        {current === scenes.length - 1 && (

          <div className="reader-finish">

            <p>
              🎉 Kamu sudah menyelesaikan
              Episode {String(episodeNumber).padStart(2, "0")}!
            </p>

            <a
              href={`/quiz/${episodeId}`}
              className="button primary"
            >
              📝 Kerjakan Evaluasi
            </a>

          </div>

        )}

      </div>

    </section>
  );
}
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MisiDetektifCitra from "@/components/MisiDetektifCitra";
import MisiTarikGaris from "@/components/MisiTarikGaris";
import type { Scene } from "@/data/episodes";

type ComicReaderProps = {
  episodeId: string;
  episodeNumber: number;
  title: string;
  cover: string;
  coverHtml?: string;
  preview?: string;
  scenes: Scene[];
  backgroundMusic?: string;
};

type Stage = "cover" | "preview" | "scene";

export default function ComicReader({
  episodeId,
  episodeNumber,
  title,
  cover,
  coverHtml,
  preview,
  scenes,
  backgroundMusic,
}: ComicReaderProps) {
  const [stage, setStage] = useState<Stage>("cover");
  const [current, setCurrent] = useState(0);

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceFailed, setVoiceFailed] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const voiceSessionRef = useRef(0);

  const touchStartX = useRef<number | null>(null);

  const scene = scenes[current];
  const isEpisodeThreeCover = episodeId === "episode-03" && Boolean(coverHtml);
  const nextEpisode =
    episodeId === "episode-01"
      ? { id: "episode-02", label: "Lanjut Episode 2" }
      : episodeId === "episode-02"
        ? { id: "episode-03", label: "Lanjut Episode 3" }
        : null;

  const stopCurrentVoice = useCallback(() => {
    voiceSessionRef.current += 1;

    const currentVoice = voiceRef.current;

    if (!currentVoice) {
      setIsVoicePlaying(false);
      setVoiceFailed(false);
      setVoiceMessage("");
      return;
    }

    currentVoice.onended = null;
    currentVoice.onerror = null;
    currentVoice.pause();
    currentVoice.currentTime = 0;
    voiceRef.current = null;
    setIsVoicePlaying(false);
    setVoiceFailed(false);
    setVoiceMessage("");
  }, []);

  const stopReaderAudio = useCallback(() => {
    stopCurrentVoice();
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);
  }, [stopCurrentVoice]);

  const playVoice = useCallback(
    (voicePath: string) => {
      stopCurrentVoice();

      const session = voiceSessionRef.current;
      const voice = new Audio(voicePath);
      const sceneLabel = `Scene ${current + 1}`;

      voice.volume = 1;
      voiceRef.current = voice;
      setVoiceFailed(false);
      setVoiceMessage(`Memutar voice-over ${sceneLabel.toLowerCase()}...`);
      setIsVoicePlaying(true);

      voice.onended = () => {
        if (voiceSessionRef.current !== session) return;

        voiceRef.current = null;
        setIsVoicePlaying(false);
        setVoiceMessage(`Voice-over ${sceneLabel} selesai.`);
      };

      voice.onerror = () => {
        if (voiceSessionRef.current !== session) return;

        voiceRef.current = null;
        setIsVoicePlaying(false);
        setVoiceFailed(true);
        setVoiceMessage(
          `Voice-over ${sceneLabel} gagal dimuat. Silakan periksa koneksi lalu buka ulang scene ini.`
        );
      };

      voice.play().catch(() => {
        if (voiceSessionRef.current !== session) return;

        voiceRef.current = null;
        setIsVoicePlaying(false);
        setVoiceFailed(true);
        setVoiceMessage(
          `Voice-over ${sceneLabel} tidak dapat diputar. Silakan coba lagi.`
        );
      });
    },
    [current, stopCurrentVoice]
  );

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
    if (stage !== "scene") {
      stopCurrentVoice();
      return;
    }

    if (!scene?.voice) {
      stopCurrentVoice();
      return;
    }

    const voicePath = scene.voice;
    let isActive = true;

    const playTimer = window.setTimeout(() => {
      if (!isActive) return;

      playVoice(voicePath);
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(playTimer);
      stopCurrentVoice();
    };
  }, [stage, current, scene?.voice, playVoice, stopCurrentVoice]);

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

    playVoice(scene.voice);
  };

  /*
   * =========================
   * MUSIC
   * =========================
   */

  const toggleMusic = async () => {
  const audio = musicRef.current;

  if (!audio) {
    console.error("BGM belum tersedia: musicRef kosong.");
    return;
  }

  if (isMusicPlaying) {
    audio.pause();
    setIsMusicPlaying(false);
    return;
  }

  try {
    audio.volume = 0.18;
    await audio.play();
    setIsMusicPlaying(true);
    console.log("BGM berhasil diputar:", audio.currentSrc);
  } catch (error) {
    setIsMusicPlaying(false);
    console.error("BGM gagal diputar:", error);
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
            <Link
              href="/episodes"
              className="button secondary reader-back-link"
              onClick={stopReaderAudio}
            >
              <span aria-hidden="true">←</span> Pilih Episode
            </Link>
            <div className="eyebrow">
              GEOTOON • EPISODE {String(episodeNumber).padStart(2, "0")}
            </div>

            <h1>{title}</h1>

            <p>
              Ikuti cerita dan aktivitas interaktif untuk belajar Geografi.
            </p>
          </div>

          <div
            className={`reader-frame${coverHtml ? " reader-frame-animated" : ""}${
              isEpisodeThreeCover ? " reader-frame-episode-03-cover" : ""
            }`}
          >
            {coverHtml ? (
              <iframe
                src={coverHtml}
                title={`Animasi sampul ${title}`}
                className="animation-frame"
                sandbox="allow-scripts"
                allowFullScreen
              />
            ) : (
              <img
                src={cover}
                alt={`Cover GEOTOON Episode ${episodeNumber}`}
                className="comic-image"
                draggable={false}
              />
            )}
            {isEpisodeThreeCover && (
              <div className="reader-cover-hit-area">
                <button
                  type="button"
                  className="reader-cover-start-target"
                  aria-label="Mulai Petualangan Episode 3"
                  onClick={() => void startStory()}
                />
              </div>
            )}
          </div>

          {!isEpisodeThreeCover && (
            <div className="reader-finish">
              <div>
                <div className="result-icon">🌍</div>
                <p>Siap mengikuti petualangan GEOTOON?</p>
              </div>

              <button
                className="button primary"
                onClick={() => {
                  if (preview) {
                    setStage("preview");
                  } else {
                    void startStory();
                  }
                }}
              >
                {preview ? "👀 Lihat Preview" : "▶ Mulai Petualangan"}
              </button>
            </div>
          )}

        </div>
      </section>
    );
  }

  /*
   * =========================
   * PREVIEW
   * =========================
   */

  if (stage === "preview" && preview) {
    return (
      <section className="reader-page page-shell">
        <div className="reader">

          <div className="reader-header">
            <Link
              href="/episodes"
              className="button secondary reader-back-link"
              onClick={stopReaderAudio}
            >
              <span aria-hidden="true">←</span> Pilih Episode
            </Link>

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
        <Link
          href="/episodes"
          className="button secondary reader-back-link"
          onClick={stopReaderAudio}
        >
          <span aria-hidden="true">←</span> Pilih Episode
        </Link>

        <div className="eyebrow">
          GEOTOON • EPISODE{" "}
          {String(episodeNumber).padStart(2, "0")}
        </div>

        <h1>{title}</h1>

        <p>
          Gunakan navigasi untuk melanjutkan petualangan. Beberapa scene juga
          bisa diputar atau dimainkan langsung.
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
          className={`reader-frame${scene.type === "html" ? " reader-frame-animated" : ""}${scene.type === "game" ? " reader-frame-game" : ""}`}
          onTouchStart={
            scene.type === "game" || scene.type === "video"
              ? undefined
              : handleTouchStart
          }
          onTouchEnd={
            scene.type === "game" || scene.type === "video"
              ? undefined
              : handleTouchEnd
          }
        >

          {scene.type === "html" ? (
            <iframe
              src={scene.html}
              title={`Episode ${episodeNumber}: ${scene.title}`}
              className="animation-frame"
              sandbox="allow-scripts"
              allowFullScreen
            />
          ) : scene.type === "video" ? (
            <video
              src={scene.video}
              className="scene-video"
              controls
              playsInline
              preload="metadata"
              aria-label={`Episode ${episodeNumber}: ${scene.title}`}
            >
              Browser kamu tidak mendukung pemutar video.
            </video>
          ) : scene.type === "game" ? (
            scene.game === "misi-tarik-garis" ? (
              <MisiTarikGaris key={scene.id} />
            ) : (
              <MisiDetektifCitra key={scene.id} />
            )
          ) : (
            <img
              src={scene.image}
              alt={`GEOTOON Episode ${episodeNumber} ${scene.title}`}
              className="comic-image"
              draggable={false}
            />
          )}

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
          {scene.type !== "game" && (
            <>
              <div className="audio-chip muted" role="status" aria-live="polite">
                🎙️{" "}
                {voiceMessage ||
                  (isVoicePlaying
                    ? "Sedang membacakan..."
                    : scene.voice
                      ? "Voice-over siap"
                      : "Voice-over belum tersedia")}
              </div>

              <button
                className="audio-chip"
                onClick={replayVoice}
                disabled={!scene.voice || voiceFailed}
              >
                {voiceFailed ? "⚠️ Audio gagal dimuat" : "🔁 Replay Voice"}
              </button>
            </>
          )}

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
          {scene.type === "game" || scene.type === "video"
            ? "Gunakan tombol di atas untuk berpindah scene."
            : "👆 Geser komik ke kiri atau kanan untuk berpindah scene."}
        </p>

        {/* FINISH */}

        {current === scenes.length - 1 && (

          <div className="reader-finish">

            <p>
              🎉 Kamu sudah menyelesaikan
              Episode {String(episodeNumber).padStart(2, "0")}!
            </p>
            <div className="reader-finish-actions">
              {nextEpisode ? (
                <Link
                  href={`/episode/${nextEpisode.id}`}
                  className="button primary"
                  onClick={stopReaderAudio}
                >
                  {nextEpisode.label} →
                </Link>
              ) : (
                <>
                  <Link
                    href="/episodes"
                    className="button primary"
                    onClick={stopReaderAudio}
                  >
                    Kembali ke Pilih Episode
                  </Link>
                  <Link
                    href="/"
                    className="button secondary"
                    onClick={stopReaderAudio}
                  >
                    Kembali ke Beranda
                  </Link>
                </>
              )}
            </div>

          </div>

        )}

      </div>

    </section>
  );
}

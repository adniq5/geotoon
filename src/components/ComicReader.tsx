"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MisiDetektifCitra from "@/components/MisiDetektifCitra";
import MisiTarikGaris from "@/components/MisiTarikGaris";
import type { Scene, TimedCue } from "@/data/episodes";

type ComicReaderProps = {
  episodeId: string;
  episodeNumber: number;
  title: string;
  cover: string;
  coverHtml?: string;
  scenes: Scene[];
  backgroundMusic?: string;
};

type Stage = "cover" | "scene";

export default function ComicReader({
  episodeId,
  episodeNumber,
  title,
  cover,
  coverHtml,
  scenes,
  backgroundMusic,
}: ComicReaderProps) {
  const [stage, setStage] = useState<Stage>("cover");
  const [current, setCurrent] = useState(0);

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceFailed, setVoiceFailed] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isCcEnabled, setIsCcEnabled] = useState(false);
  const [activeCue, setActiveCue] = useState<TimedCue | null>(null);

  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const voiceSessionRef = useRef(0);
  const voiceEnabledRef = useRef(true);
  const animationFrameRef = useRef<HTMLIFrameElement | null>(null);
  const activeCueRef = useRef<TimedCue | null>(null);

  const touchStartX = useRef<number | null>(null);

  const scene = scenes[current];
  const timedCues = scene?.subtitleCues ?? scene?.timedCues;
  const hasVoice = Boolean(scene?.voice);
  const hasTimedCues = Boolean(hasVoice && timedCues?.length);
  const hasCcFrame = episodeId === "episode-01" || episodeId === "episode-02";
  const isEpisodeThreeCover = episodeId === "episode-03" && Boolean(coverHtml);
  const isEpisodeTwoCover = episodeId === "episode-02" && Boolean(coverHtml);
  const isEpisodeTwoSceneWithControls =
    episodeId === "episode-02" &&
    scene?.type === "html" &&
    [0, 3, 4, 5, 6].includes(current);
  const isEpisodeTwoSceneWithNotes =
    episodeId === "episode-02" &&
    scene?.type === "html" &&
    [1, 2, 7].includes(current);
  const isEpisodeTwoInteractiveScene =
    episodeId === "episode-02" && scene?.type === "html" && current === 7;
  const nextEpisode =
    episodeId === "episode-01"
      ? { id: "episode-02", label: "Lanjut Episode 2" }
      : episodeId === "episode-02"
        ? { id: "episode-03", label: "Lanjut Episode 3" }
        : null;

  const stopCurrentVoice = useCallback(() => {
    voiceSessionRef.current += 1;
    const previousVisual = activeCueRef.current?.visual;

    const currentVoice = voiceRef.current;

    if (!currentVoice) {
      setIsVoicePlaying(false);
      setIsVoicePaused(false);
      setVoiceFailed(false);
      setVoiceMessage("");
      activeCueRef.current = null;
      setActiveCue(null);
      if (previousVisual) {
        animationFrameRef.current?.contentWindow?.postMessage(
          {
            type: "geotoon:playback-cue",
            visual: { ...previousVisual, action: "clear" },
          },
          "*"
        );
      }
      return;
    }

    currentVoice.onended = null;
    currentVoice.onerror = null;
    currentVoice.onplaying = null;
    currentVoice.onpause = null;
    currentVoice.ontimeupdate = null;
    currentVoice.onseeked = null;
    currentVoice.pause();
    currentVoice.currentTime = 0;
    voiceRef.current = null;
    setIsVoicePlaying(false);
    setIsVoicePaused(false);
    setVoiceFailed(false);
    setVoiceMessage("");
    activeCueRef.current = null;
    setActiveCue(null);
    if (previousVisual) {
      animationFrameRef.current?.contentWindow?.postMessage(
        {
          type: "geotoon:playback-cue",
          visual: { ...previousVisual, action: "clear" },
        },
        "*"
      );
    }
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
      setVoiceMessage(`Menyiapkan voice-over ${sceneLabel.toLowerCase()}...`);
      setIsVoicePlaying(false);
      setIsVoicePaused(false);

      voice.onended = () => {
        if (voiceSessionRef.current !== session) return;

        voiceRef.current = null;
        setIsVoicePlaying(false);
        setIsVoicePaused(false);
        activeCueRef.current = null;
        setActiveCue(null);
        setVoiceMessage(`Voice-over ${sceneLabel} selesai.`);
      };

      voice.onplaying = () => {
        if (voiceSessionRef.current !== session) return;
        setIsVoicePlaying(true);
        setIsVoicePaused(false);
        setVoiceMessage(`Sedang memutar voice-over ${sceneLabel.toLowerCase()}...`);
      };

      voice.onpause = () => {
        if (
          voiceSessionRef.current !== session ||
          voice.ended ||
          !voice.paused
        ) {
          return;
        }
        setIsVoicePlaying(false);
        setIsVoicePaused(true);
      };

      const updateTimedCue = () => {
        if (voiceSessionRef.current !== session) return;
        const cue =
          timedCues?.find(
            (item) =>
              voice.currentTime >= item.startSeconds &&
              voice.currentTime < item.endSeconds
          ) ?? null;
        if (activeCueRef.current === cue) return;

        const previousVisual = activeCueRef.current?.visual;
        activeCueRef.current = cue;
        setActiveCue(cue);
        if (cue?.visual) {
          animationFrameRef.current?.contentWindow?.postMessage(
            {
              type: "geotoon:playback-cue",
              visual: cue.visual,
            },
            "*"
          );
        } else if (previousVisual) {
          animationFrameRef.current?.contentWindow?.postMessage(
            {
              type: "geotoon:playback-cue",
              visual: { ...previousVisual, action: "clear" },
            },
            "*"
          );
        }
      };
      voice.ontimeupdate = updateTimedCue;
      voice.onseeked = updateTimedCue;

      voice.onerror = () => {
        if (voiceSessionRef.current !== session) return;

        voiceRef.current = null;
        setIsVoicePlaying(false);
        setIsVoicePaused(false);
        setVoiceFailed(true);
        voiceEnabledRef.current = false;
        setIsVoiceEnabled(false);
        setVoiceMessage(
          `Voice-over ${sceneLabel} gagal dimuat. Silakan periksa koneksi lalu buka ulang scene ini.`
        );
        activeCueRef.current = null;
        setActiveCue(null);
      };

      voice.play().catch(() => {
        if (voiceSessionRef.current !== session) return;

        voiceRef.current = null;
        setIsVoicePlaying(false);
        setIsVoicePaused(false);
        setVoiceFailed(true);
        voiceEnabledRef.current = false;
        setIsVoiceEnabled(false);
        setVoiceMessage(
          `Voice-over ${sceneLabel} tidak dapat diputar. Silakan coba lagi.`
        );
        activeCueRef.current = null;
        setActiveCue(null);
      });
    },
    [current, timedCues, stopCurrentVoice]
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

    if (!voiceEnabledRef.current) {
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

    voiceEnabledRef.current = true;
    setIsVoiceEnabled(true);
    playVoice(scene.voice);
  };

  const toggleVoice = () => {
    if (!scene?.voice) return;
    if (voiceEnabledRef.current) {
      voiceEnabledRef.current = false;
      setIsVoiceEnabled(false);
      stopCurrentVoice();
      setVoiceMessage("Suara tokoh dimatikan.");
      return;
    }

    voiceEnabledRef.current = true;
    setIsVoiceEnabled(true);
    playVoice(scene.voice);
  };

  const toggleVoicePause = async () => {
    const audio = voiceRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      voiceRef.current = null;
      setIsVoicePlaying(false);
      setIsVoicePaused(false);
      setVoiceFailed(true);
      voiceEnabledRef.current = false;
      setIsVoiceEnabled(false);
      setVoiceMessage("Voice-over tidak dapat dilanjutkan. Tekan Suara Tokoh untuk mencoba lagi.");
    }
  };

  const toggleCaptions = () => {
    if (!hasCcFrame) return;
    setIsCcEnabled((enabled) => !enabled);
  };

  useEffect(() => {
    setIsCcEnabled(false);
  }, [current, hasTimedCues]);

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

            {!isEpisodeTwoCover && (
              <p>
                Ikuti cerita dan aktivitas interaktif untuk belajar Geografi.
              </p>
            )}
          </div>

          <div
            className={`reader-frame${coverHtml ? " reader-frame-animated" : ""}${
              isEpisodeThreeCover
                ? " reader-frame-episode-03-cover"
                : isEpisodeTwoCover
                  ? " reader-frame-episode-02-cover"
                  : ""
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
            {(isEpisodeThreeCover || isEpisodeTwoCover) && (
              <div className="reader-cover-hit-area">
                <button
                  type="button"
                  className={`reader-cover-start-target${
                    isEpisodeTwoCover
                      ? " reader-cover-start-target-episode-02"
                      : ""
                  }`}
                  aria-label={`Mulai Petualangan Episode ${episodeNumber}`}
                  onClick={() => void startStory()}
                />
              </div>
            )}
          </div>

          {!isEpisodeThreeCover && !isEpisodeTwoCover && (
            <div className="reader-finish">
              <div>
                <div className="result-icon">🌍</div>
                <p>Siap mengikuti petualangan GEOTOON?</p>
              </div>

              <button
                className="button primary"
                onClick={() => void startStory()}
              >
                ▶ Mulai Petualangan
              </button>
            </div>
          )}

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
          className={`reader-frame${scene.type === "html" ? " reader-frame-animated" : ""}${scene.type === "game" ? " reader-frame-game" : ""}${
            isEpisodeTwoSceneWithControls
              ? " reader-frame-episode-02-controls"
              : isEpisodeTwoInteractiveScene
                ? " reader-frame-episode-02-interactive"
                : isEpisodeTwoSceneWithNotes
                  ? " reader-frame-episode-02-notes"
                  : ""
          }`}
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
              ref={animationFrameRef}
              src={scene.html}
              title={`Episode ${episodeNumber}: ${scene.title}`}
              className="animation-frame"
              sandbox={
                episodeId === "episode-01" && current === 0
                  ? "allow-scripts allow-same-origin"
                  : "allow-scripts"
              }
              allowFullScreen
              onLoad={() => {
                const visual = activeCueRef.current?.visual;
                if (visual) {
                  animationFrameRef.current?.contentWindow?.postMessage(
                    { type: "geotoon:playback-cue", visual },
                    "*"
                  );
                }
              }}
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

        {hasCcFrame && (
          <div
            className={`reader-cc-frame${isCcEnabled ? " is-enabled" : ""}`}
            role="status"
            aria-live="polite"
            aria-label="Bingkai closed captions"
          >
            {!isCcEnabled
              ? "CC nonaktif"
              : activeCue?.text ??
                (scene.subtitleStatus === "awaiting-voice"
                  ? "Subtitle menunggu file voice-over Episode 2."
                  : scene.subtitleStatus === "awaiting-timestamps"
                    ? "Subtitle menunggu pengukuran timestamp dari audio aktual."
                    : "Menunggu subtitle berikutnya.")}
          </div>
        )}

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
          {hasVoice ? (
            <>
              <div className="audio-chip muted" role="status" aria-live="polite">
                🎙️{" "}
                {voiceMessage ||
                  (isVoicePlaying
                    ? "Suara tokoh sedang diputar"
                    : isVoicePaused
                      ? "Suara tokoh dijeda"
                      : voiceFailed
                        ? "Voice-over gagal diputar"
                        : "Voice-over siap")}
              </div>

              <button
                className="audio-chip"
                onClick={toggleVoice}
                aria-pressed={Boolean(isVoiceEnabled && !voiceFailed)}
              >
                {isVoiceEnabled && !voiceFailed
                  ? "🔊 Suara Tokoh: ON"
                  : "🔇 Suara Tokoh: OFF"}
              </button>

              <button
                className="audio-chip"
                onClick={toggleVoicePause}
                disabled={!isVoicePlaying && !isVoicePaused}
              >
                {isVoicePlaying
                  ? "⏸️ Jeda narasi"
                  : isVoicePaused
                    ? "▶️ Lanjutkan narasi"
                    : "⏸️ Jeda narasi"}
              </button>

              <button
                className="audio-chip"
                onClick={replayVoice}
                disabled={!isVoiceEnabled}
              >
                🔁 Replay Voice
              </button>

            </>
          ) : null}

          {hasCcFrame && (
            <button
              className="audio-chip"
              onClick={toggleCaptions}
              aria-pressed={isCcEnabled}
              title="Tampilkan atau sembunyikan bingkai closed captions"
            >
              {`CC ${isCcEnabled ? "ON" : "OFF"}`}
            </button>
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

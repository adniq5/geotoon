"use client";

import { useEffect, useRef, useState } from "react";
import {
  activateHomepageAudio,
  releaseHomepageAudio,
  stopHomepageAudio,
} from "@/lib/homepageAudio";
import HomepageAnimation from "@/components/HomepageAnimation";

const characters = [
  {
    id: "ramadhani",
    name: "Muhammad Ramadhani",
    animationName: "Animasi Ramadhani",
    description: "Teman yang senang menjelaskan dan berbagi pengetahuan.",
    animation: "/animations/characters/ramadhani.html",
    audio: "/audio/introduction/Madan/perkenalan-madan.mp3",
  },
  {
    id: "marni",
    name: "Marni",
    animationName: "Animasi Marni",
    description: "Teman yang aktif bertanya dan penasaran dengan berbagai hal.",
    animation: "/animations/characters/marni.html",
    audio: "/audio/introduction/Marni/perkenalan-marni.mp3",
  },
  {
    id: "gita",
    name: "Gita Tria Ananda",
    animationName: "Animasi Gita",
    description: "Teman yang kritis dan suka mencari tahu lebih dalam.",
    animation: "/animations/characters/gita.html",
    audio: "/audio/introduction/Gita/perkenalan-gita.mp3",
  },
  {
    id: "humairoh",
    name: "Humairoh",
    animationName: "Animasi Humairoh",
    description: "Teman yang ikut mengamati dan membantu memahami materi.",
    animation: "/animations/characters/humairoh.html",
    audio: "/audio/introduction/Humairoh/perkenalan-humairoh.mp3",
  },
] as const;

type Character = (typeof characters)[number];

type CharacterIntroductionsProps = {
  banner: {
    src: string;
    title: string;
    audioSrc: string;
    audioLabel: string;
    aspectRatio: string;
  };
};

export default function CharacterIntroductions({
  banner,
}: CharacterIntroductionsProps) {
  const [selected, setSelected] = useState<Character | null>(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [audioStatus, setAudioStatus] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    stopHomepageAudio(audio);
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.currentTime = 0;
    audioRef.current = null;
  };

  useEffect(() => {
    if (!selected && !isDirectoryOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [selected, isDirectoryOpen]);

  useEffect(
    () => () => {
      stopAudio();
    },
    []
  );

  const playAudio = (character: Character) => {
    stopAudio();
    setAudioStatus(`Memutar suara perkenalan ${character.name}...`);

    const audio = new Audio(character.audio);
    audioRef.current = audio;
    activateHomepageAudio(audio, () => {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
      if (audioRef.current === audio) audioRef.current = null;
      setAudioStatus("Suara perkenalan dihentikan karena audio lain diputar.");
    });

    audio.onended = () => {
      if (audioRef.current !== audio) return;
      releaseHomepageAudio(audio);
      audioRef.current = null;
      setAudioStatus(`Suara perkenalan ${character.name} selesai.`);
    };

    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      releaseHomepageAudio(audio);
      audioRef.current = null;
      setAudioStatus(`Suara perkenalan ${character.name} tidak dapat diputar.`);
    };

    audio.play().catch(() => {
      if (audioRef.current !== audio) return;
      releaseHomepageAudio(audio);
      audioRef.current = null;
      setAudioStatus(
        `Suara perkenalan ${character.name} gagal diputar. Coba tombol putar ulang.`
      );
    });
  };

  const selectCharacter = (character: Character) => {
    if (selected?.id === character.id) return;

    setIsDirectoryOpen(false);
    setSelected(character);
    playAudio(character);
  };

  const openDirectory = () => {
    stopAudio();
    stopHomepageAudio();
    setAudioStatus("");
    setSelected(null);
    setIsDirectoryOpen(true);
  };

  const returnToDirectory = () => {
    stopAudio();
    setAudioStatus("");
    setSelected(null);
    setIsDirectoryOpen(true);
  };

  const closeDialog = () => {
    stopAudio();
    setAudioStatus("");
    setSelected(null);
    setIsDirectoryOpen(false);
    if (dialogRef.current?.open) dialogRef.current.close();
  };

  return (
    <>
      <div style={{ marginTop: "28px" }}>
        <HomepageAnimation
          {...banner}
          onActivate={openDirectory}
        />
      </div>
      <div className="feature-grid">
        {characters.map((character) => (
          <article className="feature character-card" key={character.id}>
            <button
              className="character-card-trigger"
              type="button"
              onClick={() => selectCharacter(character)}
              aria-haspopup="dialog"
              aria-expanded={selected?.id === character.id}
            >
              <span className="character-animation">
                <iframe
                  src={character.animation}
                  title={character.animationName}
                  className="character-animation-frame"
                  sandbox="allow-scripts"
                  tabIndex={-1}
                />
              </span>
              <strong>{character.name}</strong>
              <span className="character-description">
                {character.description}
              </span>
            </button>
            <a
              className="animation-link"
              href="#kenalan"
              onClick={(event) => {
                event.preventDefault();
                selectCharacter(character);
              }}
            >
              ▶ {character.animationName}
            </a>
          </article>
        ))}
      </div>

      <dialog
        className="character-dialog"
        ref={dialogRef}
        aria-labelledby={
          selected ? "character-dialog-title" : "character-directory-title"
        }
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeDialog();
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        {isDirectoryOpen && !selected ? (
          <div className="character-directory">
            <button
              className="character-dialog-close"
              type="button"
              onClick={closeDialog}
              ref={closeButtonRef}
              aria-label="Tutup daftar tokoh"
            >
              Tutup
            </button>
            <span className="eyebrow">KENALAN DENGAN TOKOH</span>
            <h3 id="character-directory-title">Pilih teman GEOTOON</h3>
            <div className="character-directory-list">
              {characters.map((character) => (
                <article className="character-directory-item" key={character.id}>
                  <div>
                    <strong>{character.name}</strong>
                    <p>{character.description}</p>
                  </div>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => selectCharacter(character)}
                  >
                    Kenali
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : selected ? (
          <div className="character-dialog-panel">
            <button
              className="character-dialog-close"
              type="button"
              onClick={closeDialog}
              ref={closeButtonRef}
              aria-label="Tutup perkenalan tokoh"
            >
              Tutup
            </button>
            <div className="character-dialog-animation">
              <iframe
                src={selected.animation}
                title={selected.animationName}
                className="character-animation-frame"
                sandbox="allow-scripts"
                tabIndex={-1}
                onLoad={() => closeButtonRef.current?.focus()}
              />
            </div>
            <div className="character-dialog-copy">
              <span className="eyebrow">TOKOH GEOTOON</span>
              <h3 id="character-dialog-title">{selected.name}</h3>
              <p>{selected.description}</p>
              <button
                className="button secondary character-replay"
                type="button"
                onClick={returnToDirectory}
              >
                Pilih tokoh lain
              </button>
              <button
                className="button secondary character-replay"
                type="button"
                onClick={() => playAudio(selected)}
              >
                ▶ Putar ulang suara
              </button>
              <p className="character-audio-status" role="status" aria-live="polite">
                {audioStatus}
              </p>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

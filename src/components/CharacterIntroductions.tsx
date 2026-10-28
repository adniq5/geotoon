"use client";

import { useEffect, useRef, useState } from "react";
import {
  activateHomepageAudio,
  disposeHomepageNarration,
  releaseHomepageAudio,
  resumeHomepageNarration,
  stopHomepageAudio,
} from "@/lib/homepageAudio";
import HomepageAnimation, { type IntroductionCue } from "@/components/HomepageAnimation";
import IntroductionDialog from "@/components/IntroductionDialog";

const characters = [
  {
    id: "ramadhani",
    name: "Muhammad Ramadhani",
    animationName: "Animasi Ramadhani",
    description: "Teman yang senang menjelaskan dan berbagi pengetahuan.",
    animation: "/animations/characters/ramadhani.html",
    audio: "/audio/narration-normalized/introduction/Madan/perkenalan-madan.mp3",
  },
  {
    id: "marni",
    name: "Marni",
    animationName: "Animasi Marni",
    description: "Teman yang aktif bertanya dan penasaran dengan berbagai hal.",
    animation: "/animations/characters/marni.html",
    audio: "/audio/narration-normalized/introduction/Marni/perkenalan-marni.mp3",
  },
  {
    id: "gita",
    name: "Gita Tria Ananda",
    animationName: "Animasi Gita",
    description: "Teman yang kritis dan suka mencari tahu lebih dalam.",
    animation: "/animations/characters/gita.html",
    audio: "/audio/narration-normalized/introduction/Gita/perkenalan-gita.mp3",
  },
  {
    id: "humairoh",
    name: "Humairoh",
    animationName: "Animasi Humairoh",
    description: "Teman yang ikut mengamati dan membantu memahami materi.",
    animation: "/animations/characters/humairoh.html",
    audio: "/audio/narration-normalized/introduction/Humairoh/perkenalan-humairoh.mp3",
  },
] as const;

type Character = (typeof characters)[number] & { subtitleCues?: IntroductionCue[] };

type CharacterIntroductionsProps = {
  banner: {
    src: string;
    title: string;
    audioSrc: string;
    audioLabel: string;
    aspectRatio: string;
  };
};

export default function CharacterIntroductions({ banner }: CharacterIntroductionsProps) {
  const [selected, setSelected] = useState<Character | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackHint, setPlaybackHint] = useState("");
  const [activeSubtitle, setActiveSubtitle] = useState<IntroductionCue | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    stopHomepageAudio(audio);
    disposeHomepageNarration(audio);
    audio.onended = null;
    audio.onerror = null;
    audio.ontimeupdate = null;
    audio.pause();
    audio.currentTime = 0;
    audioRef.current = null;
    setIsPlaying(false);
    setActiveSubtitle(null);
  };

  useEffect(() => () => stopAudio(), []);

  const playAudio = async (character: Character, restart = false) => {
    let audio = audioRef.current;
    if (restart && audio) {
      stopAudio();
      audio = null;
    }
    if (!audio) {
      const created = new Audio(character.audio);
      audio = created;
      audioRef.current = created;
      created.ontimeupdate = () => {
        if (audioRef.current !== created) return;
        const cues = character.subtitleCues ?? [];
        setActiveSubtitle(cues.find((cue) => created.currentTime >= cue.startSeconds && created.currentTime < cue.endSeconds) ?? null);
      };
      created.onended = () => {
        if (audioRef.current !== created) return;
        releaseHomepageAudio(created);
        created.currentTime = 0;
        setIsPlaying(false);
        setActiveSubtitle(character.subtitleCues?.at(-1) ?? null);
      };
      created.onerror = () => {
        if (audioRef.current !== created) return;
        releaseHomepageAudio(created);
        audioRef.current = null;
        setIsPlaying(false);
        setPlaybackHint("Audio gagal dimuat. Ketuk gambar untuk mencoba lagi.");
      };
    }

    const current = audioRef.current;
    if (!current) return;
    if (current.currentTime === 0) setActiveSubtitle(null);
    activateHomepageAudio(current, () => {
      current.pause();
      current.currentTime = 0;
      setIsPlaying(false);
      setActiveSubtitle(null);
    });
    try {
      await resumeHomepageNarration(current);
      await current.play();
      if (audioRef.current === current && !current.paused) {
        setIsPlaying(true);
        setPlaybackHint("");
      }
    } catch {
      if (audioRef.current !== current) return;
      releaseHomepageAudio(current);
      setIsPlaying(false);
      setPlaybackHint("Autoplay diblokir. Ketuk gambar untuk memulai suara.");
    }
  };

  const togglePlayback = () => {
    if (!selected) return;
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      releaseHomepageAudio(audio);
      setIsPlaying(false);
      return;
    }
    void playAudio(selected, Boolean(audio?.ended));
  };

  const selectCharacter = (character: Character) => {
    if (selected?.id === character.id) return;
    stopAudio();
    setSelected(character);
    setPlaybackHint("");
    void playAudio(character, true);
  };

  const closeDialog = () => {
    stopAudio();
    setPlaybackHint("");
    setSelected(null);
  };

  return (
    <>
      <div className="homepage-intro-block">
        <HomepageAnimation {...banner} />
      </div>
      <div className="feature-grid">
        {characters.map((character) => (
          <article className="feature character-card" key={character.id}>
            <button className="character-card-trigger" type="button" onClick={() => selectCharacter(character)} aria-haspopup="dialog" aria-expanded={selected?.id === character.id}>
              <span className="character-animation">
                <iframe src={character.animation} title={character.animationName} className="character-animation-frame" sandbox="allow-scripts" tabIndex={-1} />
              </span>
              <strong>{character.name}</strong>
              <span className="character-description">{character.description}</span>
            </button>
            <a className="animation-link" href="#kenalan" onClick={(event) => { event.preventDefault(); selectCharacter(character); }}>
              ▶ {character.animationName}
            </a>
          </article>
        ))}
      </div>

      <IntroductionDialog
        open={Boolean(selected)}
        title={selected?.name ?? "Perkenalan tokoh GEOTOON"}
        imageSrc={selected?.animation ?? ""}
        imageTitle={selected?.animationName ?? "Animasi perkenalan tokoh"}
        aspectRatio="0.633"
        onImageActivate={togglePlayback}
        isPlaying={isPlaying}
        subtitle={activeSubtitle?.text}
        playbackHint={playbackHint}
        onClose={closeDialog}
      />
    </>
  );
}

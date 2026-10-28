"use client";

import { useEffect, useRef, useState } from "react";
import {
  activateHomepageAudio,
  disposeHomepageNarration,
  isHomepageAudioActive,
  resumeHomepageNarration,
  releaseHomepageAudio,
  stopHomepageAudio,
} from "@/lib/homepageAudio";
import IntroductionDialog from "@/components/IntroductionDialog";

export type IntroductionCue = {
  startSeconds: number;
  endSeconds: number;
  text: string;
};

type HomepageAnimationProps = {
  src: string;
  title: string;
  audioSrc: string;
  audioLabel: string;
  aspectRatio: string;
  subtitleCues?: IntroductionCue[];
};

export default function HomepageAnimation({
  src,
  title,
  audioSrc,
  aspectRatio,
  subtitleCues = [],
}: HomepageAnimationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackHint, setPlaybackHint] = useState("");
  const [activeCue, setActiveCue] = useState<IntroductionCue | null>(null);

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    stopHomepageAudio(audio);
    disposeHomepageNarration(audio);
    audio.pause();
    audio.currentTime = 0;
    audio.ontimeupdate = null;
    audio.onended = null;
    audio.onerror = null;
    audioRef.current = null;
    setIsPlaying(false);
    setActiveCue(null);
  };

  useEffect(() => () => stopAudio(), []);

  const playAudio = async (restart = false) => {
    let audio = audioRef.current;
    if (restart && audio) {
      stopAudio();
      audio = null;
    }
    if (!audio) {
      const created = new Audio(audioSrc);
      audio = created;
      audioRef.current = created;
      created.ontimeupdate = () => {
        if (audioRef.current !== created) return;
        setActiveCue(subtitleCues.find((cue) => created.currentTime >= cue.startSeconds && created.currentTime < cue.endSeconds) ?? null);
      };
      created.onended = () => {
        if (audioRef.current !== created) return;
        releaseHomepageAudio(created);
        created.currentTime = 0;
        setIsPlaying(false);
        setActiveCue(subtitleCues.at(-1) ?? null);
      };
      created.onerror = () => {
        if (audioRef.current !== created) return;
        releaseHomepageAudio(created);
        created.ontimeupdate = null;
        created.onended = null;
        created.onerror = null;
        audioRef.current = null;
        setIsPlaying(false);
        setPlaybackHint("Audio gagal dimuat. Ketuk gambar untuk mencoba lagi.");
      };
    }

    const current = audioRef.current;
    if (!current) return;
    if (current.currentTime === 0) setActiveCue(null);
    activateHomepageAudio(current, () => {
      current.pause();
      current.currentTime = 0;
      setIsPlaying(false);
      setActiveCue(null);
    });
    try {
      await resumeHomepageNarration(current);
      await current.play();
      if (audioRef.current === current && !current.paused) {
        setIsPlaying(true);
        setPlaybackHint("");
      }
    } catch {
      if (audioRef.current !== current || !isHomepageAudioActive(current)) return;
      releaseHomepageAudio(current);
      setIsPlaying(false);
      setPlaybackHint("Autoplay diblokir. Ketuk gambar untuk memulai suara.");
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      releaseHomepageAudio(audio);
      setIsPlaying(false);
      return;
    }
    void playAudio(Boolean(audio?.ended));
  };

  const openModal = () => {
    stopAudio();
    setPlaybackHint("");
    setIsOpen(true);
    void playAudio(true);
  };

  const closeModal = () => {
    stopAudio();
    setPlaybackHint("");
    setIsOpen(false);
  };

  return (
    <>
      <div className="homepage-media-trigger">
        <iframe src={src} title={title} sandbox="allow-scripts" loading="lazy" style={{ display: "block", width: "100%", aspectRatio, border: 0, pointerEvents: "none" }} tabIndex={-1} />
        <button className="homepage-media-trigger-hit" type="button" onClick={openModal} aria-label={`Buka ${title}`} />
      </div>
      <IntroductionDialog
        open={isOpen}
        title={title}
        imageSrc={src}
        imageTitle={title}
        aspectRatio={aspectRatio}
        onImageActivate={togglePlayback}
        isPlaying={isPlaying}
        subtitle={activeCue?.text}
        playbackHint={playbackHint}
        onClose={closeModal}
      />
    </>
  );
}

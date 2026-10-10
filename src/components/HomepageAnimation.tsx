"use client";

import { useEffect, useRef, useState } from "react";
import {
  activateHomepageAudio,
  isHomepageAudioActive,
  releaseHomepageAudio,
  stopHomepageAudio,
} from "@/lib/homepageAudio";

type HomepageAnimationProps = {
  src: string;
  title: string;
  audioSrc: string;
  audioLabel: string;
  aspectRatio: string;
  onActivate?: () => void;
};

function watchAudio(
  audio: HTMLAudioElement,
  onEnded: () => void,
  onError: () => void
) {
  audio.addEventListener("ended", onEnded);
  audio.addEventListener("error", onError);
}

export default function HomepageAnimation({
  src,
  title,
  audioSrc,
  audioLabel,
  aspectRatio,
  onActivate,
}: HomepageAnimationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(
    () => () => {
      if (audioRef.current) stopHomepageAudio(audioRef.current);
    },
    []
  );

  const playAudio = async () => {
    const existingAudio = audioRef.current;
    if (existingAudio && !existingAudio.paused) {
      existingAudio.pause();
      stopHomepageAudio(existingAudio);
      setIsPlaying(false);
      setMessage("Suara dijeda.");
      return;
    }

    if (audioRef.current?.error) {
      audioRef.current = null;
    }

    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      watchAudio(
        audio,
        () => {
          if (!isHomepageAudioActive(audio)) return;
          audio.currentTime = 0;
          releaseHomepageAudio(audio);
          setIsPlaying(false);
          setMessage(`${audioLabel} selesai.`);
        },
        () => {
          if (!isHomepageAudioActive(audio)) return;
          releaseHomepageAudio(audio);
          setIsPlaying(false);
          setMessage(`${audioLabel} tidak dapat diputar.`);
        }
      );
      audioRef.current = audio;
    }

    const currentAudio = audioRef.current;
    const stop = () => {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setMessage("Suara dihentikan.");
    };

    activateHomepageAudio(currentAudio, stop);
    setMessage(`Memutar ${audioLabel.toLowerCase()}...`);
    setIsPlaying(true);

    try {
      await currentAudio.play();
    } catch {
      if (!isHomepageAudioActive(currentAudio)) return;
      releaseHomepageAudio(currentAudio);
      setIsPlaying(false);
      setMessage(`${audioLabel} gagal diputar. Silakan coba lagi.`);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        border: "6px solid #10223d",
        borderRadius: "24px",
        background: "#0b1020",
        boxShadow: "10px 11px 0 #f1c94a",
      }}
    >
      <iframe
        src={src}
        title={title}
        sandbox="allow-scripts"
        loading="lazy"
        style={{
          display: "block",
          width: "100%",
          aspectRatio,
          border: 0,
        }}
      />
      {onActivate && (
        <button
          className="homepage-intro-open-area"
          type="button"
          onClick={onActivate}
          aria-label="Kenalan dengan tokoh GEOTOON"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            width: "100%",
            height: "100%",
            padding: 0,
            border: 0,
            background: "transparent",
            cursor: "pointer",
          }}
        />
      )}
      <button
        className="button primary homepage-animation-control"
        type="button"
        onClick={playAudio}
        aria-label={`${isPlaying ? "Jeda" : "Putar"} ${audioLabel}`}
        style={{
          position: "absolute",
          right: "12px",
          bottom: "12px",
          zIndex: 2,
          padding: "9px 14px",
          border: "2px solid white",
          boxShadow: "0 3px 0 #071326",
        }}
      >
        <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
        <span className="homepage-animation-control-label">
          {isPlaying ? "Jeda suara" : "Putar suara"}
        </span>
      </button>
      <span
        role="status"
        aria-live="polite"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </span>
    </div>
  );
}

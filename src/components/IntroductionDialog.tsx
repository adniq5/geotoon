"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type IntroductionDialogProps = {
  open: boolean;
  title: string;
  imageSrc: string;
  imageTitle: string;
  aspectRatio: string;
  onImageActivate?: () => void;
  isPlaying?: boolean;
  subtitle?: ReactNode;
  playbackHint?: string;
  onClose: () => void;
};

export default function IntroductionDialog({
  open,
  title,
  imageSrc,
  imageTitle,
  aspectRatio,
  onImageActivate,
  isPlaying = false,
  subtitle,
  playbackHint,
  onClose,
}: IntroductionDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [modalSize, setModalSize] = useState({ imageWidth: 1120, dialogWidth: 1184 });

  useEffect(() => {
    const ratioParts = aspectRatio.split("/").map((part) => Number(part.trim()));
    const ratio = ratioParts.length === 2 ? ratioParts[0] / ratioParts[1] : Number(aspectRatio);
    const updateWidth = () => {
      if (Number.isFinite(ratio) && ratio > 0) {
        const isMobile = window.innerWidth <= 600;
        const panelPadding = isMobile ? 24 : 56;
        const borderWidth = isMobile ? 6 : 8;
        const dialogLimit = Math.max(1, window.innerWidth - (isMobile ? 20 : 32));
        const imageWidth = Math.min(
          1120,
          dialogLimit - panelPadding - borderWidth,
          Math.max(1, window.innerHeight * 0.94 - (isMobile ? 76 : 96)) * ratio
        );
        setModalSize({ imageWidth, dialogWidth: imageWidth + panelPadding + borderWidth });
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [aspectRatio]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      className="character-dialog"
      ref={dialogRef}
      style={{ width: `${modalSize.dialogWidth}px` }}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="character-dialog-panel">
        <button
          ref={closeRef}
          className="character-dialog-close"
          type="button"
          onClick={onClose}
          aria-label={`Tutup ${title}`}
        >
          Tutup
        </button>
        <div
          className="character-dialog-animation"
          style={{ aspectRatio, width: `${modalSize.imageWidth}px` }}
        >
          <iframe
            src={imageSrc}
            title={imageTitle}
            className="character-animation-frame"
            sandbox="allow-scripts"
            tabIndex={-1}
          />
          {onImageActivate && (
            <button
              className="introduction-dialog-image-hit"
              type="button"
              onClick={onImageActivate}
              aria-label={`${isPlaying ? "Jeda" : "Putar atau lanjutkan"} audio ${title}`}
            />
          )}
          {subtitle && <div className="introduction-dialog-subtitle" aria-live="polite" aria-atomic="true">{subtitle}</div>}
          {playbackHint && <span className="introduction-dialog-hint" role="status">{playbackHint}</span>}
          {onImageActivate && (
            <span className="introduction-dialog-playback" aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
          )}
        </div>
      </div>
    </dialog>
  );
}

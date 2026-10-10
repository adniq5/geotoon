let activeAudio: HTMLAudioElement | null = null;
let activeStop: (() => void) | null = null;

export function stopHomepageAudio(audio?: HTMLAudioElement) {
  if (!activeAudio || (audio && activeAudio !== audio)) return;

  const stop = activeStop;
  activeAudio = null;
  activeStop = null;
  stop?.();
}

export function activateHomepageAudio(
  audio: HTMLAudioElement,
  stop: () => void
) {
  stopHomepageAudio();
  activeAudio = audio;
  activeStop = stop;
}

export function releaseHomepageAudio(audio: HTMLAudioElement) {
  if (activeAudio !== audio) return;

  activeAudio = null;
  activeStop = null;
}

export function isHomepageAudioActive(audio: HTMLAudioElement) {
  return activeAudio === audio;
}

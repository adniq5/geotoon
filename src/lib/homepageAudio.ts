let activeAudio: HTMLAudioElement | null = null;
let activeStop: (() => void) | null = null;

type NarrationGraph = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  gain: GainNode;
  compressor: DynamicsCompressorNode;
};

const narrationGraphs = new WeakMap<HTMLAudioElement, NarrationGraph>();

function prepareHomepageNarration(audio: HTMLAudioElement) {
  if (narrationGraphs.has(audio)) return;

  try {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;

    const context = new AudioContextConstructor();
    const source = context.createMediaElementSource(audio);
    const gain = context.createGain();
    const compressor = context.createDynamicsCompressor();

    gain.gain.value = 1.2;
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    source.connect(gain).connect(compressor).connect(context.destination);
    audio.volume = 1;
    narrationGraphs.set(audio, { context, source, gain, compressor });
  } catch {
    // Keep native playback available when Web Audio is unavailable.
  }
}

export async function resumeHomepageNarration(audio: HTMLAudioElement) {
  const graph = narrationGraphs.get(audio);
  if (graph?.context.state === "suspended") await graph.context.resume();
}

export function disposeHomepageNarration(audio: HTMLAudioElement) {
  const graph = narrationGraphs.get(audio);
  if (!graph) return;

  graph.source.disconnect();
  graph.gain.disconnect();
  graph.compressor.disconnect();
  void graph.context.close();
  narrationGraphs.delete(audio);
}

export function stopHomepageAudio(audio?: HTMLAudioElement) {
  if (!activeAudio || (audio && activeAudio !== audio)) return;

  const previousAudio = activeAudio;
  const stop = activeStop;
  activeAudio = null;
  activeStop = null;
  stop?.();
  disposeHomepageNarration(previousAudio);
}

export function activateHomepageAudio(
  audio: HTMLAudioElement,
  stop: () => void
) {
  stopHomepageAudio();
  prepareHomepageNarration(audio);
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

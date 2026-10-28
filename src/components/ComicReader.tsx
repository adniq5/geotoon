"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MisiDetektifCitra from "@/components/MisiDetektifCitra";
import MisiTarikGaris from "@/components/MisiTarikGaris";
import { calculateEpisode3FinalScore } from "@/lib/episode3Scoring";
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
type MatchingGameResult = {
  correctCount: number;
  total: number;
  scorePercent: number;
};
type DetectiveGameResult = {
  completedFields: number;
  totalFields: number;
  scorePercent: number;
};

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
  const [episodeCompleted, setEpisodeCompleted] = useState(false);
  const [gameOneCompleted, setGameOneCompleted] = useState(false);
  const [gameTwoCompleted, setGameTwoCompleted] = useState(false);
  const [gameOneResult, setGameOneResult] =
    useState<MatchingGameResult | null>(null);
  const [gameTwoResult, setGameTwoResult] =
    useState<DetectiveGameResult | null>(null);

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceFailed, setVoiceFailed] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isCcEnabled, setIsCcEnabled] = useState(true);
  const [activeCue, setActiveCue] = useState<TimedCue | null>(null);
  const [runtimeHtmlDoc, setRuntimeHtmlDoc] = useState<{
    url: string;
    srcDoc: string | null;
  } | null>(null);
  const [measuredFrame, setMeasuredFrame] = useState<{
    sceneKey: string;
    height: number;
  } | null>(null);

  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const voiceSessionRef = useRef(0);
  const voiceEnabledRef = useRef(true);
  const animationFrameRef = useRef<HTMLIFrameElement | null>(null);
  const handledSceneNextRef = useRef<string | null>(null);
  const activeCueRef = useRef<TimedCue | null>(null);
  const captionsEnabledRef = useRef(true);
  const dialogueSyncFrameRef = useRef<number | null>(null);
  const lastDialogPayloadRef = useRef("");

  const sendDialogCue = useCallback(
    (cue: TimedCue | null, audioTime = 0, force = false) => {
      if (episodeId === "episode-03") return;
      const cueWordCount = cue ? cue.text.trim().split(/\s+/).length : 0;
      const cueDuration = cue ? cue.endSeconds - cue.startSeconds : 0;
      const dialogueWordCount = cue
        ? Math.min(
            cueWordCount,
            Math.floor(
              ((audioTime - cue.startSeconds) / cueDuration) * cueWordCount
            ) + 1
          )
        : 0;
      const payload =
        cue?.dialogueBubbleIndex === undefined
          ? {
              type: "geotoon:dialogue-cue",
              action: "clear",
            }
          : {
              type: "geotoon:dialogue-cue",
              action: "show",
              bubbleIndex: cue.dialogueBubbleIndex,
              text: cue.text,
              wordCount: dialogueWordCount,
              visible: captionsEnabledRef.current,
            };
      const signature = JSON.stringify(payload);
      if (!force && lastDialogPayloadRef.current === signature) return;
      lastDialogPayloadRef.current = signature;
      animationFrameRef.current?.contentWindow?.postMessage(payload, "*");
    },
    [episodeId]
  );

  const touchStartX = useRef<number | null>(null);

  const scene = scenes[current];
  const isEpisodeThree = episodeId === "episode-03";
  const gameOneSceneIndex = scenes.findIndex(
    (item) => item.type === "game" && item.game === "misi-tarik-garis"
  );
  const gameTwoSceneIndex = scenes.findIndex(
    (item) => item.type === "game" && item.game === "misi-detektif-citra"
  );
  const isGameOneScene = isEpisodeThree && current === gameOneSceneIndex;
  const isGameTwoScene = isEpisodeThree && current === gameTwoSceneIndex;
  const gameOneNextLocked = isGameOneScene && !gameOneCompleted;
  const gameTwoPreviousLocked = isGameTwoScene;
  const episodeThreeFinalScore = calculateEpisode3FinalScore(
    gameOneResult?.scorePercent ?? null,
    gameTwoResult?.scorePercent ?? null
  );
  const sceneHtml = scene?.type === "html" ? scene.html : undefined;
  const frameSceneKey = `${episodeId}:${scene?.id ?? current}`;
  const timedCues = scene?.subtitleCues ?? scene?.timedCues;
  const hasVoice = Boolean(scene?.voice);
  const hasTimedCues = Boolean(hasVoice && timedCues?.length);
  const hasBubbleCues = Boolean(
    timedCues?.some((cue) => cue.dialogueBubbleIndex !== undefined)
  );
  const isEpisodeOnePilotScene = episodeId === "episode-01" && current === 0;
  const isRevisionHtmlScene =
    (episodeId === "episode-01" || episodeId === "episode-02") &&
    stage === "scene" &&
    scene?.type === "html";
  const needsEpisodeTwoToolbarLayout =
    episodeId === "episode-02" &&
    stage === "scene" &&
    current === 0 &&
    scene?.type === "html";
  const useRuntimeHtmlDoc =
    isRevisionHtmlScene && runtimeHtmlDoc?.srcDoc != null;
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

  const nextScene = useCallback(() => {
    if (current >= scenes.length - 1) return;
    if (isEpisodeThree && isGameOneScene && !gameOneCompleted) return;

    setEpisodeCompleted(false);
    setCurrent((prev) => prev + 1);
  }, [current, scenes.length, isEpisodeThree, isGameOneScene, gameOneCompleted]);

  const stopCurrentVoice = useCallback(() => {
    voiceSessionRef.current += 1;
    if (dialogueSyncFrameRef.current !== null) {
      cancelAnimationFrame(dialogueSyncFrameRef.current);
      dialogueSyncFrameRef.current = null;
    }
    const previousVisual = activeCueRef.current?.visual;
    sendDialogCue(null);

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
  }, [sendDialogCue]);

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

        if (dialogueSyncFrameRef.current !== null) {
          cancelAnimationFrame(dialogueSyncFrameRef.current);
          dialogueSyncFrameRef.current = null;
        }

        voiceRef.current = null;
        setIsVoicePlaying(false);
        setIsVoicePaused(false);
        activeCueRef.current = null;
        setActiveCue(null);
        sendDialogCue(null);
        setVoiceMessage(`Voice-over ${sceneLabel} selesai.`);
      };

      voice.onplaying = () => {
        if (voiceSessionRef.current !== session) return;
        setIsVoicePlaying(true);
        setIsVoicePaused(false);
        setVoiceMessage(`Sedang memutar voice-over ${sceneLabel.toLowerCase()}...`);
        updateTimedCue();
        if (hasBubbleCues && dialogueSyncFrameRef.current === null) {
          dialogueSyncFrameRef.current = requestAnimationFrame(syncDialogFrame);
        }
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
        if (dialogueSyncFrameRef.current !== null) {
          cancelAnimationFrame(dialogueSyncFrameRef.current);
          dialogueSyncFrameRef.current = null;
        }
      };

      const updateTimedCue = () => {
        if (voiceSessionRef.current !== session) return;
        const cue =
          timedCues?.find(
            (item) =>
              voice.currentTime >= item.startSeconds &&
              voice.currentTime < item.endSeconds
          ) ?? null;
        if (activeCueRef.current !== cue) {
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
        }
        sendDialogCue(cue, voice.currentTime);
      };
      const syncDialogFrame = () => {
        if (voiceSessionRef.current !== session || voice.paused || voice.ended) {
          dialogueSyncFrameRef.current = null;
          return;
        }
        updateTimedCue();
        dialogueSyncFrameRef.current = requestAnimationFrame(syncDialogFrame);
      };
      voice.ontimeupdate = updateTimedCue;
      voice.onseeked = updateTimedCue;

      voice.onerror = () => {
        if (voiceSessionRef.current !== session) return;

        if (dialogueSyncFrameRef.current !== null) {
          cancelAnimationFrame(dialogueSyncFrameRef.current);
          dialogueSyncFrameRef.current = null;
        }

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
        sendDialogCue(null);
      };

      voice.play().catch(() => {
        if (voiceSessionRef.current !== session) return;

        if (dialogueSyncFrameRef.current !== null) {
          cancelAnimationFrame(dialogueSyncFrameRef.current);
          dialogueSyncFrameRef.current = null;
        }

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
        sendDialogCue(null);
      });
    },
    [current, timedCues, hasBubbleCues, stopCurrentVoice, sendDialogCue]
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

  useEffect(() => {
    if (!isRevisionHtmlScene) return;

    const handleFrameMessage = (event: MessageEvent) => {
      if (event.source !== animationFrameRef.current?.contentWindow) return;
      if (event.data?.type === "geotoon:scene-next") {
        if (handledSceneNextRef.current === frameSceneKey) return;
        handledSceneNextRef.current = frameSceneKey;
        nextScene();
        return;
      }
      if (event.data?.type !== "geotoon:scene-size") return;

      const height = Number(event.data.height);
      if (!Number.isFinite(height) || height < 100 || height > 4000) return;
      setMeasuredFrame({ sceneKey: frameSceneKey, height: Math.ceil(height) });
    };

    window.addEventListener("message", handleFrameMessage);
    return () => window.removeEventListener("message", handleFrameMessage);
  }, [episodeId, frameSceneKey, isRevisionHtmlScene, nextScene]);

  useEffect(() => {
    if (
      !isRevisionHtmlScene ||
      measuredFrame?.sceneKey !== frameSceneKey
    ) {
      return;
    }

    animationFrameRef.current?.contentWindow?.postMessage(
      { type: "geotoon:frame-sized" },
      "*"
    );
  }, [episodeId, frameSceneKey, isRevisionHtmlScene, measuredFrame]);

  useEffect(() => {
    if (!isRevisionHtmlScene || !sceneHtml) {
      setRuntimeHtmlDoc(null);
      return;
    }

    let active = true;
    const htmlUrl = sceneHtml;
    setRuntimeHtmlDoc(null);

    fetch(htmlUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => {
        if (!active) return;

        const document = new DOMParser().parseFromString(html, "text/html");
        const base = document.createElement("base");
        base.href = new URL(htmlUrl, window.location.href).href;
        document.head.prepend(base);

        const audioTrackingScript = document.createElement("script");
        audioTrackingScript.textContent = `
          (function(){
            var NativeAudio=window.Audio;window.__geotoonAudioInstances=[];
            window.Audio=function(){var audio=new NativeAudio(...arguments);window.__geotoonAudioInstances.push(audio);return audio};
            window.Audio.prototype=NativeAudio.prototype;
          })();
        `;
        document.head.prepend(audioTrackingScript);

        if (episodeId === "episode-01" && current === 4) {
          const sceneNarrationGainScript = document.createElement("script");
          sceneNarrationGainScript.id = "geotoon-scene5-narration-gain";
          sceneNarrationGainScript.textContent = `
            (function(){
              var Context=window.AudioContext||window.webkitAudioContext;
              if(!Context||Context.prototype.__geotoonScene5Gain)return;
              var nativeCreateBufferSource=Context.prototype.createBufferSource;
              Object.defineProperty(Context.prototype,"__geotoonScene5Gain",{value:true});
              Context.prototype.createBufferSource=function(){
                var source=nativeCreateBufferSource.call(this);
                var gain=this.createGain();
                var compressor=this.createDynamicsCompressor();
                var nativeConnect=source.connect.bind(source);
                var routed=false;
                gain.gain.value=1.65;
                compressor.threshold.value=-18;
                compressor.knee.value=12;
                compressor.ratio.value=4;
                compressor.attack.value=0.003;
                compressor.release.value=0.25;
                source.connect=function(destination){
                  if(destination===this.context.destination){
                    if(!routed){
                      nativeConnect(gain);
                      gain.connect(compressor);
                      compressor.connect(destination);
                      routed=true;
                    }
                    return destination;
                  }
                  return nativeConnect.apply(this,arguments);
                };
                return source;
              };
            })();
          `;
          document.head.appendChild(sceneNarrationGainScript);
        }

        const layoutStyle = document.createElement("style");
        layoutStyle.textContent = `
          .geotoon-shared-audio-controls{position:relative!important;inset:auto!important;display:flex!important;flex-wrap:wrap!important;align-items:center!important;justify-content:center!important;gap:10px!important;width:100%!important;max-width:100%!important;margin:14px auto 0!important;padding:10px!important;box-sizing:border-box!important}
          .geotoon-shared-audio-controls button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:44px!important;max-width:100%!important;padding:10px 16px!important;border:2px solid #dfd3bf!important;border-radius:999px!important;background:#fff!important;color:#17324f!important;font:800 14px/1.25 system-ui,sans-serif!important;white-space:nowrap!important;cursor:pointer!important;touch-action:manipulation!important}
          .geotoon-shared-audio-controls button[aria-pressed="true"]{border-color:#7eb8e6!important;background:#eef7ff!important;color:#125d9e!important}
          .geotoon-shared-audio-controls button:disabled{opacity:.55!important;cursor:not-allowed!important}
          @media(max-width:600px){.geotoon-shared-audio-controls{gap:7px!important;padding:8px 4px!important}.geotoon-shared-audio-controls button{min-height:42px!important;padding:9px 12px!important;font-size:clamp(12px,3.3vw,14px)!important}}
        `;
        if (needsEpisodeTwoToolbarLayout) {
          layoutStyle.textContent += `
            .geotoon-reader-toolbar{display:flex!important;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;width:100%;margin:0 auto!important;padding:8px 12px!important;box-sizing:border-box}
            .geotoon-reader-toolbar button{flex:0 1 auto;min-width:0;max-width:100%;white-space:normal;touch-action:manipulation}
            .geotoon-reader-toolbar-top{margin-bottom:6px!important}
            .geotoon-reader-toolbar-bottom{margin-top:6px!important}
            @media(max-width:600px){.geotoon-reader-toolbar{gap:6px;padding:8px 6px!important}.geotoon-reader-toolbar button{font-size:clamp(12px,3.4vw,14px)!important;padding:8px 10px!important}}
          `;
        }

        const hasViewportSizedCanvas =
          !document.querySelector(".wrap") &&
          Boolean(document.querySelector("#stage")) &&
          Boolean(document.querySelector("#ctl"));
        if (hasViewportSizedCanvas) {
          layoutStyle.textContent += `
            html,body{height:auto!important;min-height:0!important}
            body{display:block!important;align-items:initial!important;justify-content:initial!important}
            #stage{width:100%!important;max-width:100%!important;flex:none!important}
          `;
        }
        if (layoutStyle.textContent) document.head.appendChild(layoutStyle);

        if (needsEpisodeTwoToolbarLayout) {
          const layoutScript = document.createElement("script");
          layoutScript.textContent = `
            (function(){
              var stage=document.getElementById("stage");
              var bar=document.querySelector(".bar");
              if(!stage||!bar||!stage.parentNode)return;
              var parent=stage.parentNode;
              var top=document.createElement("div");
              var bottom=document.createElement("div");
              top.className="bar geotoon-reader-toolbar geotoon-reader-toolbar-top";
              bottom.className="bar geotoon-reader-toolbar geotoon-reader-toolbar-bottom";
              Array.from(bar.querySelectorAll("button")).forEach(function(button){
                if(button.matches('[data-m="semua"],[data-m="satelit"],[data-m="ruang"]'))top.appendChild(button);
                else bottom.appendChild(button);
              });
              parent.insertBefore(top,stage);
              parent.insertBefore(bottom,stage.nextSibling);
              bar.remove();
            })();
          `;
          document.body.appendChild(layoutScript);
        }

        const hasInternalSceneStartBridge =
          document.documentElement.innerHTML.includes("geotoon:scene-start");
        if (
          episodeId === "episode-01" &&
          (current === 1 || current === 4) &&
          !hasInternalSceneStartBridge
        ) {
          const sceneStartBridgeScript = document.createElement("script");
          sceneStartBridgeScript.id = "geotoon-runtime-bridge";
          sceneStartBridgeScript.textContent = `
            (function(){
              var startRequested=false,started=false;
              function startWhenReady(){
                if(!startRequested||started)return;
                var start=document.querySelector("#go,#ov,#big,#pl,#play");
                if(!start||start.disabled)return;
                started=true;start.click();
              }
              window.addEventListener("message",function(event){
                if(event.source!==window.parent||!event.data)return;
                if(event.data.type!=="geotoon:scene-start")return;
                startRequested=true;
                if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startWhenReady,{once:true});
                else requestAnimationFrame(startWhenReady);
              });
            })();
          `;
          document.body.appendChild(sceneStartBridgeScript);
        }

        const controlsScript = document.createElement("script");
        controlsScript.textContent = `
          (function(){
            function setup(){
              var pause=document.querySelector('#pz,#pp,#pb,#play,#pl');
              var repeat=document.querySelector('#re');
              if(!pause||!repeat)return;
              var duplicateSceneNext=document.getElementById('geotoon-scene-next');
              if(duplicateSceneNext)duplicateSceneNext.remove();
              var cc=document.querySelector('#geotoon-revision-cc');
              var audio=document.querySelector('audio')||((window.__geotoonAudioInstances||[]).slice(-1)[0]);
              var root=pause.parentElement;
              while(root&&root!==document.body&&!root.contains(repeat))root=root.parentElement;
              if(!root)root=pause.parentElement;
              root.classList.add('geotoon-shared-audio-controls');
              repeat.textContent='Ulangi Obrolan';
              function setPauseLabel(label){
                if(pause.textContent.trim()!==label)pause.textContent=label;
              }
              function syncPause(){
                if(audio){setPauseLabel(audio.paused?'Lanjutkan':'Jeda');return}
                var label=pause.textContent.trim();
                if(/jeda/i.test(label))return;
                if(/lanjut|putar/i.test(label))setPauseLabel('Lanjutkan');
              }
              if(audio){audio.addEventListener('play',syncPause);audio.addEventListener('pause',syncPause);audio.addEventListener('ended',syncPause);syncPause();}
              new MutationObserver(syncPause).observe(pause,{childList:true,subtree:true,characterData:true});
              if(!cc){
                var captionNodes=document.querySelectorAll('#typed,.typed,.bub,.bubble,.chat,.msg,.hlw,.subtitle,.subtitles,.caption,.captions,[data-subtitle]');
                if(captionNodes.length){
                  cc=document.createElement('button');cc.type='button';cc.id='geotoon-shared-cc';cc.textContent='CC ON';cc.setAttribute('aria-pressed','true');cc.setAttribute('aria-label','Aktifkan atau nonaktifkan subtitle');root.appendChild(cc);
                  var enabled=true;cc.addEventListener('click',function(){enabled=!enabled;captionNodes.forEach(function(node){node.style.visibility=enabled?'':'hidden'});cc.textContent='CC '+(enabled?'ON':'OFF');cc.setAttribute('aria-pressed',String(enabled))});
                }
              }
              root.appendChild(pause);root.appendChild(repeat);
              if(cc){root.appendChild(cc);cc.textContent=cc.textContent.indexOf('OFF')>=0?'CC OFF':'CC ON';}
            }
            if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
          })();
        `;
        document.body.appendChild(controlsScript);
        const srcDoc = `<!doctype html>${document.documentElement.outerHTML}`;
        setRuntimeHtmlDoc({ url: htmlUrl, srcDoc });
      })
      .catch(() => {
        if (active) setRuntimeHtmlDoc({ url: htmlUrl, srcDoc: null });
      });

    return () => {
      active = false;
    };
  }, [current, episodeId, isRevisionHtmlScene, needsEpisodeTwoToolbarLayout, sceneHtml]);

  /*
   * =========================
   * START STORY
   * =========================
   */

  const startStory = async () => {
    setStage("scene");
    setCurrent(0);
    if (episodeId === "episode-03") {
      setGameOneResult(null);
      setGameTwoResult(null);
      setGameOneCompleted(false);
      setGameTwoCompleted(false);
      setEpisodeCompleted(false);
    }

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

  const previousScene = () => {
    if (current <= 0) return;
    if (isEpisodeThree && isGameTwoScene) return;

    setEpisodeCompleted(false);
    setCurrent((prev) => prev - 1);
  };

  const isSceneChangeLocked = (index: number) => {
    if (!isEpisodeThree) return false;
    if (isGameOneScene && index > current && !gameOneCompleted) return true;
    if (isGameTwoScene && index < current) return true;
    return false;
  };

  const selectScene = (index: number) => {
    if (isSceneChangeLocked(index)) return;
    if (index !== current) setEpisodeCompleted(false);
    setCurrent(index);
  };

  const finishMatchingGame = useCallback(
    (result: MatchingGameResult) => {
      if (episodeId !== "episode-03") return;
      setGameOneResult(result);
      setGameOneCompleted(true);
      if (gameTwoCompleted) setEpisodeCompleted(true);
    },
    [episodeId, gameTwoCompleted]
  );
  const advanceAfterMatchingGame = useCallback(() => {
    if (episodeId !== "episode-03" || !gameOneCompleted) return;
    const matchingSceneIndex = scenes.findIndex(
      (item) => item.type === "game" && item.game === "misi-tarik-garis"
    );
    const detectiveSceneIndex = scenes.findIndex(
      (item) =>
        item.type === "game" && item.game === "misi-detektif-citra"
    );
    setCurrent((index) =>
      index === matchingSceneIndex && detectiveSceneIndex >= 0
        ? detectiveSceneIndex
        : index
    );
    setEpisodeCompleted(gameTwoCompleted);
  }, [episodeId, gameOneCompleted, gameTwoCompleted, scenes]);
  const finishDetectiveGame = useCallback(
    (result: DetectiveGameResult) => {
      if (episodeId !== "episode-03") return;
      setGameTwoResult(result);
      setGameTwoCompleted(true);
      if (gameOneCompleted) setEpisodeCompleted(true);
    },
    [episodeId, gameOneCompleted]
  );

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

  const toggleCaptions = () => {
    const nextEnabled = !captionsEnabledRef.current;
    captionsEnabledRef.current = nextEnabled;
    setIsCcEnabled(nextEnabled);
    sendDialogCue(
      activeCueRef.current,
      voiceRef.current?.currentTime ?? 0,
      true
    );
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
      if (dialogueSyncFrameRef.current !== null) {
        cancelAnimationFrame(dialogueSyncFrameRef.current);
        dialogueSyncFrameRef.current = null;
      }
      voiceRef.current = null;
      setIsVoicePlaying(false);
      setIsVoicePaused(false);
      setVoiceFailed(true);
      voiceEnabledRef.current = false;
      setIsVoiceEnabled(false);
      setVoiceMessage("Voice-over tidak dapat dilanjutkan. Tekan Suara Tokoh untuk mencoba lagi.");
      activeCueRef.current = null;
      setActiveCue(null);
      sendDialogCue(null);
    }
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
                className="button primary reader-cover-start-button"
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
            episodeId === "episode-02" && current === 0
              ? " reader-frame-episode-02-scene-01"
              : ""
          }${
            isEpisodeTwoSceneWithControls
              ? " reader-frame-episode-02-controls"
              : isEpisodeTwoInteractiveScene
                ? " reader-frame-episode-02-interactive"
                : isEpisodeTwoSceneWithNotes
                  ? " reader-frame-episode-02-notes"
                  : ""
          }`}
          style={
            isRevisionHtmlScene && measuredFrame?.sceneKey === frameSceneKey
              ? { height: `${measuredFrame.height + 12}px`, aspectRatio: "auto" }
              : undefined
          }
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

          {scene.type === "html" &&
          isRevisionHtmlScene &&
          runtimeHtmlDoc?.url !== scene.html ? (
            <div className="animation-frame-loading" role="status">
              Memuat animasi…
            </div>
          ) : scene.type === "html" ? (
            <iframe
              ref={animationFrameRef}
              src={useRuntimeHtmlDoc ? undefined : scene.html}
              srcDoc={
                useRuntimeHtmlDoc
                  ? runtimeHtmlDoc?.srcDoc ?? undefined
                  : undefined
              }
              title={`Episode ${episodeNumber}: ${scene.title}`}
              className="animation-frame"
              sandbox={
                episodeId === "episode-01" && current === 0
                  ? "allow-scripts allow-same-origin"
                  : "allow-scripts"
              }
              allow={episodeId === "episode-03" ? undefined : "autoplay"}
              allowFullScreen
              onLoad={() => {
                if (voiceRef.current) {
                  sendDialogCue(
                    activeCueRef.current,
                    voiceRef.current.currentTime,
                    true
                  );
                }
                const visual = activeCueRef.current?.visual;
                if (visual) {
                  animationFrameRef.current?.contentWindow?.postMessage(
                    { type: "geotoon:playback-cue", visual },
                    "*"
                  );
                }
                if (isRevisionHtmlScene) {
                  animationFrameRef.current?.contentWindow?.postMessage(
                    { type: "geotoon:scene-start" },
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
              <MisiTarikGaris
                key={scene.id}
                onResult={finishMatchingGame}
                onAdvance={advanceAfterMatchingGame}
              />
            ) : (
              <MisiDetektifCitra
                key={scene.id}
                onComplete={finishDetectiveGame}
              />
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

              {isEpisodeOnePilotScene && (
                <button
                  className="audio-chip"
                  onClick={toggleCaptions}
                  aria-pressed={isCcEnabled}
                  title="Tampilkan atau sembunyikan teks di balon percakapan"
                >
                  {`CC ${isCcEnabled ? "ON" : "OFF"}`}
                </button>
              )}
            </>
          ) : null}

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
            disabled={current === 0 || gameTwoPreviousLocked}
          >
            ← Sebelumnya
          </button>

          <div className="panel-count">
            {current + 1} / {scenes.length}
          </div>

          <button
            className="button primary"
            onClick={nextScene}
            disabled={current === scenes.length - 1 || gameOneNextLocked}
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
              onClick={() => selectScene(index)}
              disabled={isSceneChangeLocked(index)}
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

                cursor: isSceneChangeLocked(index) ? "not-allowed" : "pointer",
                opacity: isSceneChangeLocked(index) ? 0.45 : 1,

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

        {current === scenes.length - 1 &&
          (episodeId !== "episode-03" ||
            (episodeCompleted && gameOneCompleted && gameTwoCompleted)) && (

          <div
            className={`reader-finish${episodeId === "episode-03" ? " reader-finish-episode-three" : ""}`}
          >

            <p>
              🎉 Kamu sudah menyelesaikan
              Episode {String(episodeNumber).padStart(2, "0")}!
            </p>
            {episodeId === "episode-03" && gameOneResult && gameTwoResult && (
              <div className="reader-episode-results" aria-label="Ringkasan nilai akhir Episode 3">
                <h3>Ringkasan hasil dua misi</h3>
                <div className="reader-episode-result-grid">
                  <p>
                    <strong>Game 1 · Misi Tarik Garis</strong>
                    <span>{gameOneResult.correctCount}/{gameOneResult.total} pasangan benar · {gameOneResult.scorePercent}%</span>
                  </p>
                  <p>
                    <strong>Game 2 · Misi Detektif Citra</strong>
                    <span>{gameTwoResult.completedFields}/{gameTwoResult.totalFields} isian wajib lengkap · {gameTwoResult.scorePercent}%</span>
                  </p>
                </div>
                {episodeThreeFinalScore !== null && (
                  <p className="reader-episode-final-score">
                    Nilai akhir berbobot: ({gameOneResult.scorePercent} × 20%) + ({gameTwoResult.scorePercent} × 80%) = {episodeThreeFinalScore}/100
                  </p>
                )}
                <p className="reader-episode-score-note">
                  Nilai Game 1 berbobot 20% dan Misi Detektif berbobot 80%. Nilai dibulatkan ke bilangan bulat terdekat setelah dihitung.
                </p>
              </div>
            )}
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

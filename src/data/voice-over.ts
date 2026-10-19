export type VoiceAssetMappingStatus = "candidate-unmapped";

export type VoiceAsset = {
  character: string;
  path: string;
  episodeHint: 1;
  sceneHint: number | null;
  durationSeconds: number;
  mappingStatus: VoiceAssetMappingStatus;
  note: string;
};

/**
 * Candidate clips supplied with the project. They stay separate from the
 * verified scene voice-over until each clip is matched to a dialog and order.
 */
export const candidateVoiceAssets: VoiceAsset[] = [
  {
    character: "Gita",
    path: "/audio/Gita/eps 1 scene 1.mp3",
    episodeHint: 1,
    sceneHint: 1,
    durationSeconds: 7,
    mappingStatus: "candidate-unmapped",
    note: "Dialog text and position in scene 1 still need confirmation.",
  },
  {
    character: "Gita",
    path: "/audio/Gita/eps 1 scene 3..mp3",
    episodeHint: 1,
    sceneHint: 3,
    durationSeconds: 4,
    mappingStatus: "candidate-unmapped",
    note: "Dialog text and position in scene 3 still need confirmation.",
  },
  {
    character: "Gita",
    path: "/audio/Gita/scene 4.mp3",
    episodeHint: 1,
    sceneHint: 4,
    durationSeconds: 12,
    mappingStatus: "candidate-unmapped",
    note: "Episode is inferred from the surrounding files; verify before playback.",
  },
  {
    character: "Gita",
    path: "/audio/Gita/eps 1 scene 5..mp3",
    episodeHint: 1,
    sceneHint: 5,
    durationSeconds: 12,
    mappingStatus: "candidate-unmapped",
    note: "Dialog text and position in scene 5 still need confirmation.",
  },
  ...[1, 2, 3, 4, 5].map((scene) => ({
    character: "Humairoh",
    path: `/audio/Humairoh/Eps 1 (Sin ${scene}).m4a.mp4`,
    episodeHint: 1 as const,
    sceneHint: scene,
    durationSeconds: [3, 5, 6, 6, 7][scene - 1],
    mappingStatus: "candidate-unmapped" as const,
    note: "Container is M4A audio stored with an .mp4 extension; dialog order needs confirmation.",
  })),
  ...[
    ["Episode 1.mp3", 1, 5],
    ["scene 2.mp3", 2, 7],
    ["scene 3.mp3", 3, 4],
    ["scene 4.mp3", 4, 11],
    ["scene 5.mp3", 5, 3],
  ].map(([file, scene, duration]) => ({
    character: "Madan/Ramadhani",
    path: `/audio/Madan/${file}`,
    episodeHint: 1 as const,
    sceneHint: scene as number,
    durationSeconds: duration as number,
    mappingStatus: "candidate-unmapped" as const,
    note: "Character naming differs between the folder and the application; confirm identity.",
  })),
  ...[
    ["eps 1 (scane 1).m4a", 1, 5],
    ["eps 1 (scane 3).m4a", 3, 10],
    ["eps 1 (scene 4).m4a", 4, 5],
  ].map(([file, scene, duration]) => ({
    character: "Marni",
    path: `/audio/Marni/${file}`,
    episodeHint: 1 as const,
    sceneHint: scene as number,
    durationSeconds: duration as number,
    mappingStatus: "candidate-unmapped" as const,
    note: "Filename contains a spelling variation; dialog position needs confirmation.",
  })),
  {
    character: "Bu Guru",
    path: "/audio/Bu Guru/Ibu guru.mp4",
    episodeHint: 1,
    sceneHint: null,
    durationSeconds: 8,
    mappingStatus: "candidate-unmapped",
    note: "Scene and dialog are not identified by the filename.",
  },
];

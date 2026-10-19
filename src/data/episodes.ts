export type SceneContent =
  | { type: "image"; image: string }
  | { type: "html"; html: string }
  | { type: "video"; video: string }
  | {
      type: "game";
      game: "misi-tarik-garis" | "misi-detektif-citra";
    };

export type TimedCue = {
  startSeconds: number;
  endSeconds: number;
  text: string;
  visual?: {
    targetId: string;
    action: "highlight" | "clear";
  };
};

export type SubtitleTimelineStatus =
  | "awaiting-voice"
  | "awaiting-timestamps"
  | "ready";

export type Scene = {
  id: string;
  title: string;
  voice?: string;
  timedCues?: TimedCue[];
  subtitleCues?: TimedCue[];
  subtitleStatus?: SubtitleTimelineStatus;
} & SceneContent;

export type Episode = {
  id: string;
  number: number;
  title: string;
  description: string;
  cover: string;
  coverHtml?: string;
  scenes: Scene[];
};

export const episode1SubtitleCues: Record<string, TimedCue[]> = {
  scene1: [
    {
      startSeconds: 1,
      endSeconds: 8.9,
      text: "Coba kalian perhatikan peta ini. Dari peta tersebut, informasi apa saja yang bisa kalian dapatkan?",
    },
    {
      startSeconds: 9,
      endSeconds: 13.9,
      text: "Lokasi suatu tempat, Bu.",
    },
    {
      startSeconds: 14,
      endSeconds: 18.9,
      text: "Kita juga bisa melihat jalan dan posisi suatu wilayah.",
    },
    {
      startSeconds: 19,
      endSeconds: 28.9,
      text: "Berarti kita bisa mengetahui suatu tempat meskipun belum pernah datang langsung ke sana.",
    },
    {
      startSeconds: 29,
      endSeconds: 30.816,
      text: "Tepat sekali.",
    },
  ],
  scene2: [
    {
      startSeconds: 1,
      endSeconds: 4.9,
      text: "Kalau begitu, sebenarnya apa yang dimaksud dengan peta?",
    },
    {
      startSeconds: 5,
      endSeconds: 12.9,
      text: "Peta adalah gambaran permukaan bumi pada bidang datar yang diperkecil menggunakan skala tertentu.",
    },
  ],
  scene3: [
    {
      startSeconds: 0,
      endSeconds: 4.9,
      text: "Kenapa ya peta punya banyak tanda dan warna?",
    },
    {
      startSeconds: 5,
      endSeconds: 14.9,
      text: "Karena setiap bagian mempunyai fungsi; ada judul, simbol, legenda, skala, dan unsur lainnya.",
    },
    {
      startSeconds: 15,
      endSeconds: 19.9,
      text: "Legenda membantu kita dalam memahami arti simbol.",
    },
    {
      startSeconds: 20,
      endSeconds: 25.845,
      text: "Sedangkan skala membantu membandingkan jarak pada peta dengan jarak sebenarnya.",
    },
  ],
  scene4: [
    {
      startSeconds: 1,
      endSeconds: 5.9,
      text: "Tanpa sadar kita sering menggunakan peta dalam kehidupan sehari-hari.",
    },
    {
      startSeconds: 6,
      endSeconds: 11.9,
      text: "Berarti peta bukan cuma digunakan saat belajar geografi?",
    },
    {
      startSeconds: 12,
      endSeconds: 23.9,
      text: "Tentu tidak, kita menggunakannya untuk mencari lokasi, menentukan arah, perjalanan, bahkan memahami kondisi pada suatu wilayah.",
    },
    {
      startSeconds: 24,
      endSeconds: 36.272,
      text: "Dengan peta, kita bisa mengetahui kondisi suatu wilayah seperti persebaran pemukiman, jalan, sungai, hingga fasilitas umum.",
    },
  ],
  scene5: [
    {
      startSeconds: 0,
      endSeconds: 11.9,
      text: "Aku jadi penasaran, informasi pada peta ini diperoleh dari mana? Apakah semua tempat harus didatangi dan diamati satu per satu?",
    },
    {
      startSeconds: 12,
      endSeconds: 16.9,
      text: "Hmm, sepertinya ada cara lain.",
    },
    {
      startSeconds: 17,
      endSeconds: 23.546,
      text: "Pertanyaan itu membawa kita pada teknologi yang memungkinkan manusia mengamati bumi dari kejauhan.",
    },
  ],
};

export const episodes: Episode[] = [
  {
    id: "episode-01",
    number: 1,
    title: "Petunjuk Pertama: Membaca Bumi Lewat Peta",
    description:
      "Sebuah perjalanan untuk memahami bumi dimulai dari sebuah peta.",
    cover: "/images/episodes/episode-01/Cover/Tampilan%20Awal%20Eps%201.png",
    coverHtml: "/animations/episode-01/cover.html",
    scenes: [
      {
        id: "scene-01",
        title: "Sebuah Tantangan",
        type: "html",
        html: "/animations/episode-01/scene-01.html",
        voice: "/audio/voice-over/episode-1/scene1-episode1.mp3",
        subtitleCues: episode1SubtitleCues.scene1,
        subtitleStatus: "ready",
      },
      {
        id: "scene-02",
        title: "Apa Itu Peta?",
        type: "html",
        html: "/animations/episode-01/scene-02.html",
        voice: "/audio/voice-over/episode-1/scene2-episode1.mp3",
        subtitleCues: episode1SubtitleCues.scene2,
        subtitleStatus: "awaiting-timestamps",
      },
      {
        id: "scene-03",
        title: "Mengenal Isi Peta",
        type: "html",
        html: "/animations/episode-01/scene-03.html",
        voice: "/audio/voice-over/episode-1/scene3-episode1.mp3",
        subtitleCues: episode1SubtitleCues.scene3,
        subtitleStatus: "ready",
      },
      {
        id: "scene-04",
        title: "Peta dalam Kehidupan",
        type: "html",
        html: "/animations/episode-01/scene-04.html",
        voice: "/audio/voice-over/episode-1/scene4-episode1.mp3",
        subtitleCues: episode1SubtitleCues.scene4,
        subtitleStatus: "ready",
      },
      {
        id: "scene-05",
        title: "Misteri Baru",
        type: "html",
        html: "/animations/episode-01/scene-05.html",
        voice: "/audio/voice-over/episode-1/scene5-episode1.mp3",
        subtitleCues: episode1SubtitleCues.scene5,
        subtitleStatus: "ready",
      },
    ],
  },
  {
    id: "episode-02",
    number: 2,
    title: "Melihat Bumi Tanpa Menyentuhnya",
    description:
      "Petualangan berlanjut dengan mengenal penginderaan jauh dan cara mengamati bumi dari jarak jauh.",
    cover: "/images/episodes/episode-02/Cover/Scene%20Tampilan%20Awal%20Eps%202.png",
    coverHtml: "/animations/episode-02/cover.html?embed=1",
    scenes: [
      {
        id: "scene-01",
        title: "Petualangan Dimulai",
        type: "html",
        html: "/animations/episode-02/scene-01.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-02",
        title: "Penginderaan Jauh",
        type: "html",
        html: "/animations/episode-02/scene-02.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-03",
        title: "Bagaimana Satelit Mengamati Bumi",
        type: "html",
        html: "/animations/episode-02/scene-03.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-04",
        title: "Citra, Mata Bumi dari Atas",
        type: "html",
        html: "/animations/episode-02/scene-04.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-05",
        title: "Mengenal Jenis-Jenis Citra",
        type: "html",
        html: "/animations/episode-02/scene-05.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-06",
        title: "Misi Detektif Citra",
        type: "html",
        html: "/animations/episode-02/scene-06.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-07",
        title: "Tiga Tahap Interpretasi Citra",
        type: "html",
        html: "/animations/episode-02/scene-07.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-08",
        title: "Rona, Warna, dan Bentuk",
        type: "html",
        html: "/animations/episode-02/scene-08.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-09",
        title: "Scene 9",
        type: "html",
        html: "/animations/episode-02/scene-09.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-10",
        title: "Scene 10",
        type: "html",
        html: "/animations/episode-02/scene-10.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-11",
        title: "Scene 11",
        type: "html",
        html: "/animations/episode-02/scene-11.html",
        subtitleStatus: "awaiting-voice",
      },
      {
        id: "scene-12",
        title: "Scene 12",
        type: "html",
        html: "/animations/episode-02/scene-12.html",
        subtitleStatus: "awaiting-voice",
      },
    ],
  },
  {
    id: "episode-03",
    number: 3,
    title: "Penalaran Analisis Penginderaan Jauh dan Citra",
    description:
      "Amati citra, susun interpretasi dari bukti, dan jelaskan penalaranmu dalam Misi Detektif Citra.",
    cover: "/images/episodes/episode-03/Cover/Judul%20Awal%20Episod%203.png",
    coverHtml: "/animations/episode-03/cover.html",
    scenes: [
      {
        id: "scene-01",
        title: "Misi Tarik Garis: Cara Kerja Citra Penginderaan Jauh",
        type: "game",
        game: "misi-tarik-garis",
      },
      {
        id: "scene-02",
        title: "Misi Detektif Citra",
        type: "game",
        game: "misi-detektif-citra",
      },
    ],
  },
];

export function getEpisode(id: string) {
  return episodes.find((episode) => episode.id === id);
}

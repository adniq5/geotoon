export type SceneContent =
  | { type: "image"; image: string }
  | { type: "html"; html: string }
  | { type: "video"; video: string }
  | {
      type: "game";
      game: "misi-tarik-garis" | "misi-detektif-citra";
    };

export type Scene = {
  id: string;
  title: string;
  voice?: string;
} & SceneContent;

export type Episode = {
  id: string;
  number: number;
  title: string;
  description: string;
  cover: string;
  coverHtml?: string;
  preview?: string;
  scenes: Scene[];
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
    preview: "/images/episodes/episode-01/Preview/Episod%201.png",
    scenes: [
      {
        id: "scene-01",
        title: "Sebuah Tantangan",
        type: "html",
        html: "/animations/episode-01/scene-01.html",
        voice: "/audio/voice-over/episode-1/scene1-episode1.mp3",
      },
      {
        id: "scene-02",
        title: "Apa Itu Peta?",
        type: "html",
        html: "/animations/episode-01/scene-02.html",
        voice: "/audio/voice-over/episode-1/scene2-episode1.mp3",
      },
      {
        id: "scene-03",
        title: "Mengenal Isi Peta",
        type: "html",
        html: "/animations/episode-01/scene-03.html",
        voice: "/audio/voice-over/episode-1/scene3-episode1.mp3",
      },
      {
        id: "scene-04",
        title: "Peta dalam Kehidupan",
        type: "html",
        html: "/animations/episode-01/scene-04.html",
        voice: "/audio/voice-over/episode-1/scene4-episode1.mp3",
      },
      {
        id: "scene-05",
        title: "Misteri Baru",
        type: "html",
        html: "/animations/episode-01/scene-05.html",
        voice: "/audio/voice-over/episode-1/scene5-episode1.mp3",
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
    coverHtml: "/animations/episode-02/cover.html",
    preview: "/images/episodes/episode-02/Preview/Episod%202.png",
    scenes: [
      {
        id: "scene-01",
        title: "Petualangan Dimulai",
        type: "html",
        html: "/animations/episode-02/scene-01.html",
      },
      {
        id: "scene-02",
        title: "Penginderaan Jauh",
        type: "html",
        html: "/animations/episode-02/scene-02.html",
      },
      {
        id: "scene-03",
        title: "Bagaimana Satelit Mengamati Bumi",
        type: "html",
        html: "/animations/episode-02/scene-03.html",
      },
      {
        id: "scene-04",
        title: "Citra, Mata Bumi dari Atas",
        type: "html",
        html: "/animations/episode-02/scene-04.html",
      },
      {
        id: "scene-05",
        title: "Mengenal Jenis-Jenis Citra",
        type: "html",
        html: "/animations/episode-02/scene-05.html",
      },
      {
        id: "scene-06",
        title: "Misi Detektif Citra",
        type: "html",
        html: "/animations/episode-02/scene-06.html",
      },
      {
        id: "scene-07",
        title: "Tiga Tahap Interpretasi Citra",
        type: "html",
        html: "/animations/episode-02/scene-07.html",
      },
      {
        id: "scene-08",
        title: "Rona, Warna, dan Bentuk",
        type: "html",
        html: "/animations/episode-02/scene-08.html",
      },
      {
        id: "scene-09",
        title: "Scene 9",
        type: "html",
        html: "/animations/episode-02/scene-09.html",
      },
      {
        id: "scene-10",
        title: "Scene 10",
        type: "html",
        html: "/animations/episode-02/scene-10.html",
      },
      {
        id: "scene-11",
        title: "Scene 11",
        type: "html",
        html: "/animations/episode-02/scene-11.html",
      },
      {
        id: "scene-12",
        title: "Scene 12",
        type: "html",
        html: "/animations/episode-02/scene-12.html",
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

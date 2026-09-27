export type Scene = {
  id: string;
  title: string;
  image: string;
};

export type Episode = {
  id: string;
  number: number;
  title: string;
  description: string;
  cover: string;
  preview: string;
  scenes: Scene[];
};

export const episodes: Episode[] = [
  {
    id: "episode-01",
    number: 1,
    title: "Petunjuk Pertama: Membaca Bumi Lewat Peta",
    description:
      "Sebuah perjalanan untuk memahami bumi dimulai dari sebuah peta.",
    cover:
      "/images/episodes/episode-01/Cover/Tampilan%20Awal%20Eps%201.png",
    preview:
      "/images/episodes/episode-01/Preview/Episod%201.png",

    scenes: [
      {
        id: "scene-01",
        title: "Sebuah Tantangan",
        image:
          "/images/episodes/episode-01/Scene%201/Scene%201.png",
      },
      {
        id: "scene-02",
        title: "Apa Itu Peta?",
        image:
          "/images/episodes/episode-01/Scene%202/Scene%202.png",
      },
      {
        id: "scene-03",
        title: "Mengenal Isi Peta",
        image:
          "/images/episodes/episode-01/Scene%203/Scene%203.png",
      },
      {
        id: "scene-04",
        title: "Peta dalam Kehidupan",
        image:
          "/images/episodes/episode-01/Scene%204/Scene%204.png",
      },
      {
        id: "scene-05",
        title: "Misteri Baru",
        image:
          "/images/episodes/episode-01/Scene%205/Scene%205.png",
      },
    ],
  },

  {
    id: "episode-02",
    number: 2,
    title: "Melihat Bumi Tanpa Menyentuhnya",
    description:
      "Petualangan berlanjut dengan mengenal cara mengamati bumi dari jarak jauh.",

    cover:
      "/images/episodes/episode-02/Cover/Scene%20Tampilan%20Awal%20Eps%202.png",

    preview:
      "/images/episodes/episode-02/Preview/Episod%202.png",

    scenes: [
      {
        id: "scene-01",
        title: "Scene 1",
        image:
          "/images/episodes/episode-02/Scene%201/Scene%201.png",
      },
      {
        id: "scene-02",
        title: "Scene 2",
        image:
          "/images/episodes/episode-02/Scene%202/Scene%202.png",
      },
      {
        id: "scene-03",
        title: "Scene 3",
        image:
          "/images/episodes/episode-02/Scene%203/Scene%203.png",
      },
      {
        id: "scene-04",
        title: "Scene 4",
        image:
          "/images/episodes/episode-02/Scene%204/Scene%204.png",
      },
      {
        id: "scene-05",
        title: "Scene 5",
        image:
          "/images/episodes/episode-02/Scene%205/Scene%205.png",
      },
      {
        id: "scene-06",
        title: "Scene 6",
        image:
          "/images/episodes/episode-02/Scene%206/Scene%206.png",
      },
    ],
  },

  {
    id: "episode-03",
    number: 3,
    title: "Episode 3",
    description: "Lanjutan petualangan GEOTOON.",

    cover:
      "/images/episodes/episode-03/Cover/Judul%20Awal%20Episod%203.png",

    preview:
      "/images/episodes/episode-03/Preview/Episod%203.png",

    scenes: [
      {
        id: "scene-01",
        title: "Scene 1",
        image:
          "/images/episodes/episode-03/Scene%201/Scene%201.png",
      },
      {
        id: "scene-02",
        title: "Scene 2",
        image:
          "/images/episodes/episode-03/Scene%202/Scene%202.png",
      },
      {
        id: "scene-03",
        title: "Scene 3",
        image:
          "/images/episodes/episode-03/Scene%203/Scene%203.png",
      },
      {
        id: "scene-04",
        title: "Scene 4",
        image:
          "/images/episodes/episode-03/Scene%204/Scene%204.png",
      },
      {
        id: "scene-05",
        title: "Scene 5",
        image:
          "/images/episodes/episode-03/Scene%205/Scene%205.png",
      },
      {
        id: "scene-06",
        title: "Scene 6",
        image:
          "/images/episodes/episode-03/Scene%206/Scene%206.png",
      },
      {
        id: "scene-07",
        title: "Scene 7",
        image:
          "/images/episodes/episode-03/Scene%207/Scene%207.png",
      },
    ],
  },

  {
    id: "episode-04",
    number: 4,
    title: "Episode 4",
    description: "Lanjutan petualangan GEOTOON.",

    cover:
      "/images/episodes/episode-04/Cover/Tampilan%20Awal%20Eps%204.png",

    preview:
      "/images/episodes/episode-04/Preview/Episod%204.png",

    scenes: [
      {
        id: "scene-01",
        title: "Scene 1",
        image:
          "/images/episodes/episode-04/Scene%201/Scene%201.png",
      },
      {
        id: "scene-02",
        title: "Scene 2",
        image:
          "/images/episodes/episode-04/Scene%202/Scene%202.png",
      },
      {
        id: "scene-03",
        title: "Scene 3",
        image:
          "/images/episodes/episode-04/Scene%203/Scene%203.png",
      },
      {
        id: "scene-04",
        title: "Scene 4",
        image:
          "/images/episodes/episode-04/Scene%204/Scene%204.png",
      },
      {
        id: "scene-05",
        title: "Scene 5",
        image:
          "/images/episodes/episode-04/Scene%205/Scene%205.png",
      },
    ],
  },

  {
    id: "episode-05",
    number: 5,
    title: "Episode 5",
    description: "Petualangan GEOTOON berlanjut.",

    cover:
      "/images/episodes/episode-05/Cover/Judul%20Tampilan%20Eps%205.png",

    preview:
      "/images/episodes/episode-05/Preview/Episod%205.png",

    scenes: [
      {
        id: "scene-01",
        title: "Scene 1",
        image:
          "/images/episodes/episode-05/Scene%201/Scene%201.png",
      },
      {
        id: "scene-02",
        title: "Scene 2",
        image:
          "/images/episodes/episode-05/Scene%202/Scene%202.png",
      },
      {
        id: "scene-03",
        title: "Scene 3",
        image:
          "/images/episodes/episode-05/Scene%203/Scene%203.png",
      },
      {
        id: "scene-04",
        title: "Scene 4",
        image:
          "/images/episodes/episode-05/Scene%204/Scene%204.png",
      },
      {
        id: "scene-05",
        title: "Scene 5",
        image:
          "/images/episodes/episode-05/Scene%205/Scene%205.png",
      },
      {
        id: "scene-06",
        title: "Scene 6",
        image:
          "/images/episodes/episode-05/Scene%206/Scene%206.png",
      },
      {
        id: "scene-07",
        title: "Scene 7",
        image:
          "/images/episodes/episode-05/Scene%207/Scene%207.png",
      },
      {
        id: "scene-08",
        title: "Scene 8",
        image:
          "/images/episodes/episode-05/Scene%208/Scene%208.png",
      },
      {
        id: "scene-09",
        title: "Scene 9",
        image:
          "/images/episodes/episode-05/Scene%209/Scene%209.png",
      },
      {
        id: "scene-10",
        title: "Scene 10",
        image:
          "/images/episodes/episode-05/Scene%2010/Scene%2010.png",
      },
      {
        id: "scene-11",
        title: "Scene 11",
        image:
          "/images/episodes/episode-05/Scene%2011/Scene%2011.png",
      },
    ],
  },
];

export function getEpisode(id: string) {
  return episodes.find((episode) => episode.id === id);
}
export type EvaluationQuestion = {
  image: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Evaluation = {
  episodeId: string;
  title: string;
  subject: string;
  introImage: string;
  answerImage: string;
  questions: EvaluationQuestion[];
};

/*
|--------------------------------------------------------------------------
| DATA EVALUASI GEOTOON
|--------------------------------------------------------------------------
| A = 0
| B = 1
| C = 2
| D = 3
|--------------------------------------------------------------------------
*/

export const evaluations: Evaluation[] = [
  // =========================================================
  // EPISODE 1
  // =========================================================
  {
    episodeId: "episode-01",
    title: "Evaluasi Episode 1",
    subject: "Peta",

    introImage:
      "/images/episodes/episode-01/evaluation/evaluasi.png",

    answerImage:
      "/images/episodes/episode-01/evaluation/jawaban.png",

    questions: [
      {
        image:
          "/images/episodes/episode-01/evaluation/soal-01.png",

        question:
          "Pernyataan yang paling tepat mengenai peta adalah ....",

        options: [
          "Gambaran permukaan bumi pada bidang datar yang diperkecil menggunakan skala tertentu",
          "Gambaran permukaan bumi yang hanya menunjukkan lokasi suatu tempat",
          "Gambar suatu wilayah yang tidak membutuhkan simbol dan skala",
          "Gambaran permukaan bumi yang hanya dapat digunakan dalam pembelajaran",
        ],

        answer: 0,

        explanation:
          "Peta merupakan gambaran permukaan bumi pada bidang datar yang diperkecil menggunakan skala tertentu.",
      },

      {
        image:
          "/images/episodes/episode-01/evaluation/soal-02.png",

        question:
          "Mengapa peta menggunakan simbol dan warna yang berbeda-beda?",

        options: [
          "Agar peta terlihat lebih berwarna",
          "Karena setiap simbol dan warna dapat mewakili informasi tertentu",
          "Agar peta menjadi lebih mudah dibaca",
          "Karena semua wilayah memiliki warna yang berbeda",
        ],

        answer: 1,

        explanation:
          "Simbol dan warna pada peta digunakan untuk mewakili informasi tertentu, seperti sungai, jalan, hutan, dan kota.",
      },

      {
        image:
          "/images/episodes/episode-01/evaluation/soal-03.png",

        question:
          "Salah satu fungsi peta adalah ....",

        options: [
          "Menggantikan pengamatan seluruh objek secara langsung",
          "Menyajikan informasi suatu wilayah agar lebih mudah dipahami",
          "Menunjukkan keadaan cuaca secara pasti",
          "Menentukan jenis tanah tanpa informasi lainnya",
        ],

        answer: 1,

        explanation:
          "Salah satu fungsi peta adalah menyajikan informasi suatu wilayah agar lebih mudah dipahami.",
      },
    ],
  },

  // =========================================================
  // EPISODE 2
  // =========================================================
  {
    episodeId: "episode-02",
    title: "Evaluasi Episode 2",
    subject: "Penginderaan Jauh",

    introImage:
      "/images/episodes/episode-02/evaluation/evaluasi.png",

    answerImage:
      "/images/episodes/episode-02/evaluation/jawaban.png",

    questions: [
      {
        image:
          "/images/episodes/episode-02/evaluation/soal-01.png",

        question:
          "Penginderaan jauh adalah teknik untuk memperoleh informasi mengenai objek atau wilayah di permukaan bumi dengan cara ....",

        options: [
          "Menyentuh objek secara langsung",
          "Menggunakan alat tanpa kontak langsung dengan objek",
          "Mengamati objek hanya dari daratan",
          "Melakukan penelitian langsung di lapangan",
        ],

        answer: 1,

        explanation:
          "Penginderaan jauh memperoleh informasi mengenai objek atau wilayah dengan menggunakan alat atau sensor tanpa kontak langsung dengan objek.",
      },

      {
        image:
          "/images/episodes/episode-02/evaluation/soal-02.png",

        question:
          "Penginderaan jauh pasif menggunakan sumber energi ....",

        options: [
          "Buatan dari sensor",
          "Alami, terutama Matahari",
          "Listrik dari komputer",
          "Gelombang suara",
        ],

        answer: 1,

        explanation:
          "Penginderaan jauh pasif menggunakan sumber energi alami, terutama radiasi Matahari.",
      },

      {
        image:
          "/images/episodes/episode-02/evaluation/soal-03.png",

        question:
          "Hasil gambaran yang direkam menggunakan kamera atau sensor disebut ....",

        options: [
          "Citra",
          "Peta konsep",
          "Diagram",
          "Sketsa",
        ],

        answer: 0,

        explanation:
          "Hasil gambaran yang direkam menggunakan kamera atau sensor pada penginderaan jauh disebut citra.",
      },
    ],
  },

  // =========================================================
  // EPISODE 3
  // =========================================================
  {
    episodeId: "episode-03",
    title: "Evaluasi Episode 3",
    subject: "Citra",

    introImage:
      "/images/episodes/episode-03/evaluation/evaluasi.png",

    answerImage:
      "/images/episodes/episode-03/evaluation/jawaban.png",

    questions: [
      {
        image:
          "/images/episodes/episode-03/evaluation/soal-01.png",

        question:
          "Apa yang dimaksud dengan citra foto?",

        options: [
          "Gambaran permukaan bumi yang diperoleh melalui pemotretan menggunakan kamera",
          "Gambaran permukaan bumi yang dibuat secara manual",
          "Gambaran yang dihasilkan hanya menggunakan radar",
          "Gambaran yang diperoleh tanpa menggunakan alat",
        ],

        answer: 0,

        explanation:
          "Citra foto merupakan hasil pemotretan permukaan bumi yang diperoleh menggunakan kamera dari udara.",
      },

      {
        image:
          "/images/episodes/episode-03/evaluation/soal-02.png",

        question:
          "Berdasarkan arah sumbu kamera, citra foto dibedakan menjadi ....",

        options: [
          "Foto udara dan foto satelit",
          "Foto vertikal dan foto condong",
          "Foto warna asli dan warna semu",
          "Foto tunggal dan foto jamak",
        ],

        answer: 1,

        explanation:
          "Berdasarkan arah sumbu kamera, citra foto dibedakan menjadi foto vertikal (sumbu tegak lurus) dan foto condong (sumbu membentuk sudut terhadap permukaan bumi).",
      },

      {
        image:
          "/images/episodes/episode-03/evaluation/soal-03.png",

        question:
          "Manakah yang termasuk contoh citra nonfoto?",

        options: [
          "Foto ultraviolet dan foto pankromatik",
          "Foto vertikal dan foto condong",
          "Citra inframerah termal dan citra radar",
          "Foto udara dan foto satelit",
        ],

        answer: 2,

        explanation:
          "Citra nonfoto diperoleh dari sensor tertentu, seperti sensor inframerah termal dan radar, bukan dari pemotretan kamera.",
      },
    ],
  },

  // =========================================================
  // EPISODE 4
  // =========================================================
  {
    episodeId: "episode-04",
    title: "Evaluasi Episode 4",
    subject: "Interpretasi Citra",

    introImage:
      "/images/episodes/episode-04/evaluation/evaluasi.png",

    answerImage:
      "/images/episodes/episode-04/evaluation/jawaban.png",

    questions: [
      {
        image:
          "/images/episodes/episode-04/evaluation/soal-01.png",

        question:
          "Kegiatan mengkaji citra untuk mengenali objek dan memperoleh informasi dari objek tersebut disebut ....",

        options: [
          "Interpretasi citra",
          "Pembuatan peta",
          "Pengukuran wilayah",
          "Observasi lapangan",
        ],

        answer: 0,

        explanation:
          "Interpretasi citra adalah kegiatan mengkaji citra untuk mengenali objek dan memperoleh informasi dari objek tersebut.",
      },

      {
        image:
          "/images/episodes/episode-04/evaluation/soal-02.png",

        question:
          "Dalam interpretasi citra, setelah menemukan keberadaan suatu objek, langkah selanjutnya adalah mengenali objek tersebut berdasarkan ciri-cirinya. Tahapan tersebut disebut ....",

        options: [
          "Deteksi",
          "Identifikasi",
          "Analisis",
          "Perekaman",
        ],

        answer: 1,

        explanation:
          "Identifikasi adalah tahapan mengenali objek yang sudah ditemukan berdasarkan ciri-ciri seperti bentuk, warna, ukuran, tekstur, pola, dan bayangan.",
      },

      {
        image:
          "/images/episodes/episode-04/evaluation/soal-03.png",

        question:
          "Ketika sulit mengenali suatu objek pada citra, kita dapat menggunakan petunjuk seperti warna, bentuk, ukuran, tekstur, pola, dan bayangan. Petunjuk tersebut disebut ....",

        options: [
          "Unsur interpretasi citra",
          "Komponen peta",
          "Jenis citra",
          "Sumber energi",
        ],

        answer: 0,

        explanation:
          "Unsur interpretasi citra adalah petunjuk yang digunakan untuk mengenali objek pada citra, meliputi warna, bentuk, ukuran, tekstur, pola, dan bayangan.",
      },
    ],
  },

  // =========================================================
  // EPISODE 5
  // =========================================================
  {
    episodeId: "episode-05",
    title: "Evaluasi Episode 5",
    subject: "Unsur Interpretasi Citra",

    introImage:
      "/images/episodes/episode-05/evaluation/evaluasi.png",

    answerImage:
      "/images/episodes/episode-05/evaluation/jawaban.png",

    questions: [
      {
        image:
          "/images/episodes/episode-05/evaluation/soal-01.png",

        question:
          "Dalam mengenali objek pada citra, kita dapat memperhatikan tingkat terang atau gelap serta warna yang terlihat. Unsur interpretasi citra tersebut adalah ....",

        options: [
          "Rona dan warna",
          "Bentuk dan ukuran",
          "Tekstur dan pola",
          "Situs dan asosiasi",
        ],

        answer: 0,

        explanation:
          "Tingkat terang atau gelap serta warna yang terlihat merupakan unsur rona dan warna dalam interpretasi citra.",
      },

      {
        image:
          "/images/episodes/episode-05/evaluation/soal-02.png",

        question:
          "Pada citra terlihat sebuah kawasan permukiman dengan rumah-rumah yang tersusun teratur. Untuk mengenali objek tersebut, kita dapat memperhatikan ....",

        options: [
          "Tekstur dan bayangan",
          "Bentuk dan pola",
          "Situs dan asosiasi",
          "Rona dan warna",
        ],

        answer: 1,

        explanation:
          "Susunan rumah-rumah yang teratur dapat dikenali dengan memperhatikan bentuk dan pola objek pada citra.",
      },

      {
        image:
          "/images/episodes/episode-05/evaluation/soal-03.png",

        question:
          "Saat mengidentifikasi suatu objek pada citra, kita dapat menggunakan berbagai petunjuk, seperti rona, warna, bentuk, ukuran, tekstur, pola, bayangan, situs, dan asosiasi. Tujuan penggunaan petunjuk tersebut adalah ....",

        options: [
          "Memperindah tampilan citra",
          "Membantu mengenali dan memahami objek pada citra",
          "Mengubah citra menjadi peta",
          "Menentukan jenis sensor yang digunakan",
        ],

        answer: 1,

        explanation:
          "Berbagai unsur interpretasi citra digunakan untuk membantu mengenali dan memahami objek pada citra.",
      },
    ],
  },
];
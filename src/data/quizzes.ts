export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const quizzes: Record<string, QuizQuestion[]> = {
  'episode-01': [
    {
      question: 'Apa tujuan utama GEOTOON?',
      options: [
        'Media pembelajaran Geografi',
        'Aplikasi belanja',
        'Game olahraga',
        'Aplikasi musik',
      ],
      answer: 0,
      explanation: 'GEOTOON dirancang sebagai media pembelajaran Geografi berbasis komik.',
    },
    {
      question: 'Objek apa yang banyak diamati dalam pembelajaran pada GEOTOON?',
      options: ['Objek permukaan bumi', 'Resep makanan', 'Nilai saham', 'Lirik lagu'],
      answer: 0,
      explanation: 'Materi GEOTOON mengajak siswa mengenali berbagai objek di permukaan bumi.',
    },
    {
      question: 'Media apa yang digunakan untuk mengenali bumi dari atas?',
      options: ['Peta dan citra', 'Kamus dan novel', 'Kalkulator dan jam', 'Poster olahraga'],
      answer: 0,
      explanation: 'GEOTOON memperkenalkan pembelajaran melalui peta dan citra.',
    },
    {
      question: 'Apa manfaat mengamati detail pada citra?',
      options: [
        'Membantu mengenali objek',
        'Mengubah warna layar',
        'Mempercepat internet',
        'Mengisi baterai',
      ],
      answer: 0,
      explanation: 'Detail pada citra membantu proses mengenali dan menginterpretasikan objek.',
    },
    {
      question: 'Setelah mempelajari episode, siswa dapat melakukan apa?',
      options: ['Mengerjakan quiz', 'Menghapus website', 'Mengganti sistem operasi', 'Mematikan internet'],
      answer: 0,
      explanation: 'Quiz digunakan sebagai evaluasi pemahaman setelah membaca episode.',
    },
  ],
};

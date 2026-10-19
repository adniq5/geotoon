export type TeamProfile = {
  id: string;
  name: string;
  role: string;
  description: string;
  photo?: string;
  photoAlt?: string;
  details?: string[];
  placeholder?: boolean;
};

export const teamProfiles: TeamProfile[] = [
  {
    id: "faisal",
    name: "Pak Faisal",
    role: "Dosen terkait",
    description: "Dosen yang tercantum sebagai pihak terkait dalam proyek GEOTOON.",
    photo: "/images/team/faisal.jpeg",
    photoAlt: "Foto Pak Faisal",
    details: ["NIP: 199007292018031001"],
  },
  {
    id: "riyan",
    name: "Pak Riyan",
    role: "Dosen terkait",
    description: "Dosen yang tercantum sebagai pihak terkait dalam proyek GEOTOON.",
    photo: "/images/team/riyan.jpeg",
    photoAlt: "Foto Pak Riyan",
    details: ["NIP: 199805232025061007"],
  },
  {
    id: "nevy",
    name: "Bu Nevy",
    role: "Dosen terkait",
    description: "Dosen yang tercantum sebagai pihak terkait dalam proyek GEOTOON.",
    photo: "/images/team/nevy.jpeg",
    photoAlt: "Foto Bu Nevy",
    details: ["NIP: 198804192014042002"],
  },
  ...["Humairoh", "Ramadhani", "Gita", "Marni"].map((name) => ({
    id: name.toLowerCase(),
    name,
    role: "Mahasiswa penyusun konten",
    description:
      "Berkontribusi dalam pembuatan konten, penyusunan isi, dan format materi GEOTOON.",
    details: [
      "Universitas Lambung Mangkurat",
      "Program Studi Pendidikan Geografi",
    ],
  })),
  {
    id: "web-developer",
    name: "Muhammad Adnan Iqlima",
    role: "Pengembang Web (Web Developer)",
    description:
      "Bertanggung jawab atas pengembangan teknis website GEOTOON, termasuk antarmuka pengguna, implementasi animasi interaktif, serta pengembangan fitur pada platform pembelajaran digital.",
    details: ["Politeknik Negeri Banjarmasin", "Sistem Informasi Kota Cerdas"],
  },
];

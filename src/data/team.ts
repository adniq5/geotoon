export type TeamProfile = {
  id: string;
  name: string;
  photo?: string;
  photoAlt?: string;
  photoClass?: string;
  role?: string;
  details: string[];
};

const affiliation = [
  "Jurusan Pendidikan Geografi",
  "Universitas Lambung Mangkurat",
];

export const lecturerProfiles: TeamProfile[] = [
  {
    id: "nevy",
    name: "Dr. Nevy Farista Aristin, S.Pd., M.Sc.",
    photo: "/images/team/nevy.jpeg",
    photoAlt: "Foto Dr. Nevy Farista Aristin",
    photoClass: "team-profile-photo-nevy",
    details: affiliation,
  },
  {
    id: "riyan",
    name: "A. Riyan Rahman Hakiki, S.Pd., M.Pd.",
    photo: "/images/team/riyan.png",
    photoAlt: "Foto A. Riyan Rahman Hakiki",
    photoClass: "team-profile-photo-riyan",
    details: affiliation,
  },
  {
    id: "faisal",
    name: "Dr. Faisal Arif Setiawan, M.Pd.",
    photo: "/images/team/faisal.png",
    photoAlt: "Foto Dr. Faisal Arif Setiawan",
    photoClass: "team-profile-photo-faisal",
    details: affiliation,
  },
];

export const studentProfiles: TeamProfile[] = [
  {
    id: "gita",
    name: "Gita Tria Ananda",
    photo: "/images/team/Gita Tria Ananda.jpeg",
    photoAlt: "Foto Gita Tria Ananda",
    photoClass: "team-profile-photo-gita",
    details: affiliation,
  },
  {
    id: "ramadhani",
    name: "Muhammad Ramadhani",
    photo: "/images/team/Muhammad Ramadhani.jpeg",
    photoAlt: "Foto Muhammad Ramadhani",
    photoClass: "team-profile-photo-ramadhani",
    details: affiliation,
  },
  {
    id: "humairah",
    name: "Humairah",
    photo: "/images/team/Humairah.jpeg",
    photoAlt: "Foto Humairah",
    photoClass: "team-profile-photo-humairah",
    details: affiliation,
  },
  {
    id: "marni",
    name: "Marni",
    photo: "/images/team/Marni.jpeg",
    photoAlt: "Foto Marni",
    photoClass: "team-profile-photo-marni",
    details: affiliation,
  },
];

export const webDeveloperProfile: TeamProfile = {
  id: "web-developer",
  name: "Muhammad Adnan Iqlima",
  photo: "/images/team/Adnan.jpeg",
  photoAlt: "Foto Muhammad Adnan Iqlima",
  photoClass: "team-profile-photo-adnan",
  role: "Pengembang web",
  details: ["Sistem Informasi Kota Cerdas", "Politeknik Negeri Banjarmasin"],
};

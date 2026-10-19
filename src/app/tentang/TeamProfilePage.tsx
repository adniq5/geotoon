"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect } from "react";
import { teamProfiles } from "@/data/team";

export default function TeamProfilePage() {
  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.history.scrollRestoration = "manual";
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 0);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="team-page page-shell">
      <div className="team-page-heading">
        <Link href="/" className="button secondary team-back-link">
          ← Kembali ke GEOTOON
        </Link>
        <span className="eyebrow">TENTANG PEMBUATAN GEOTOON</span>
        <h1>Profil Tim GEOTOON</h1>
        <p>
          GEOTOON dikerjakan oleh dosen terkait, mahasiswa penyusun konten,
          dan pengembang web. Informasi ditampilkan berdasarkan data yang
          tersedia dan tidak menambahkan gelar atau jabatan yang belum
          dikonfirmasi.
        </p>
      </div>

      <div className="team-profile-grid">
        {teamProfiles.map((profile) => (
          <article className="team-profile-card" key={profile.id}>
            <div
              className={`team-profile-photo${
                profile.photo ? "" : " team-profile-photo-placeholder"
              }`}
            >
              {profile.photo ? (
                <Image
                  src={profile.photo}
                  alt={profile.photoAlt ?? `Foto ${profile.name}`}
                  width={640}
                  height={800}
                />
              ) : (
                <>
                  <span aria-hidden="true">＋</span>
                  <span>Foto belum tersedia</span>
                </>
              )}
            </div>
            <div className="team-profile-copy">
              <span className="eyebrow">{profile.role}</span>
              <h2>{profile.name}</h2>
              <p>{profile.description}</p>
              {profile.details?.map((detail) => (
                <p className="team-profile-detail" key={detail}>
                  {detail}
                </p>
              ))}
              {profile.placeholder && (
                <span className="team-profile-placeholder">
                  Identitas menunggu data
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

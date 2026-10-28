"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect } from "react";
import {
  lecturerProfiles,
  studentProfiles,
  webDeveloperProfile,
  type TeamProfile,
} from "@/data/team";

function ProfileCard({ profile }: { profile: TeamProfile }) {
  return (
    <article className="team-profile-card">
      <div
        className={`team-profile-photo${
          profile.photo ? "" : " team-profile-photo-placeholder"
        }${profile.photoClass ? ` ${profile.photoClass}` : ""}`}
      >
        {profile.photo ? (
          <Image
            src={profile.photo}
            alt={profile.photoAlt ?? `Foto ${profile.name}`}
            width={640}
            height={800}
          />
        ) : null}
      </div>
      <div className="team-profile-copy">
        <h2>{profile.name}</h2>
        {profile.details.map((detail) => (
          <p className="team-profile-detail" key={detail}>
            {detail}
          </p>
        ))}
        {profile.role && <p className="team-profile-detail">{profile.role}</p>}
      </div>
    </article>
  );
}

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
          Kembali ke GEOTOON
        </Link>
        <span className="eyebrow">TENTANG PEMBUATAN GEOTOON</span>
        <h1>Profil Tim GEOTOON</h1>
      </div>

      <div className="team-profile-groups">
        <div className="team-profile-grid team-profile-grid-lecturers">
          {lecturerProfiles.map((profile) => (
            <ProfileCard profile={profile} key={profile.id} />
          ))}
        </div>
        <div className="team-profile-grid team-profile-grid-students">
          {studentProfiles.map((profile) => (
            <ProfileCard profile={profile} key={profile.id} />
          ))}
        </div>
        <div className="team-profile-grid team-profile-grid-developer">
          <ProfileCard profile={webDeveloperProfile} />
        </div>
      </div>
    </main>
  );
}

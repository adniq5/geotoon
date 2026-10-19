import Link from 'next/link';
import { episodes } from '@/data/episodes';
import EpisodeCard from '@/components/EpisodeCard';
import CharacterIntroductions from '@/components/CharacterIntroductions';
import HomepageAnimation from '@/components/HomepageAnimation';

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-copy" style={{ maxWidth: '760px' }}>
          <span className="eyebrow">MEDIA PEMBELAJARAN GEOGRAFI</span>

          <h1>
            Mengenal Bumi
            <br />
            <span>dari Atas!</span>
          </h1>

          <p>
            Ikuti petualangan GEOTOON bersama para karakter untuk mengenal
            peta, citra, dan berbagai objek di permukaan bumi.
          </p>

          <div className="hero-actions">
            <Link href="/episodes" className="button primary">
              🚀 Mulai Petualangan
            </Link>

            <a href="#kenalan" className="button secondary">
              👋 Kenalan Dulu
            </a>
          </div>
        </div>

        <div className="hero-art hero-animation">
          <iframe
            src="/animations/episode-01/cover.html"
            title="Animasi sampul GEOTOON Episode 1"
            className="hero-animation-frame"
            sandbox="allow-scripts"
          />
        </div>

      </section>

      {/* KENALAN DENGAN TOKOH */}
      <section className="section homepage-character-section" id="kenalan">
        <div className="section-heading">
          <span className="eyebrow">KENALAN DULU</span>

          <h2>Kenalan dengan tokoh GEOTOON.</h2>

          <p>
            Sebelum memulai petualangan, yuk kenalan dengan teman-teman
            yang akan menemani perjalanan belajar Geografi.
          </p>
        </div>

        <CharacterIntroductions
          banner={{
            src: "/animations/characters/intro.html",
            title: "Animasi perkenalan tokoh GEOTOON",
            audioSrc: "/audio/introduction/perkenalan-geotoon.mp3",
            audioLabel: "voice-over perkenalan GEOTOON",
            aspectRatio: "1536 / 255",
          }}
        />
      </section>

      {/* PENUTUP BERSAMA */}
      <section className="section homepage-closing-section" id="penutup">
        <h3 style={{ margin: '0 0 16px', fontSize: '1.4rem' }}>
          Penutup Bersama
        </h3>
        <div>
          <HomepageAnimation
            src="/animations/characters/closing.html"
            title="Animasi Penutup Bersama GEOTOON"
            audioSrc="/audio/introduction/penutup-perkenalan.mp3"
            audioLabel="voice-over penutup GEOTOON"
            aspectRatio="1536 / 189"
          />
        </div>
      </section>

      {/* TENTANG GEOTOON */}
      <section className="section homepage-about-section" id="tentang">
        <div className="section-heading">
          <span className="eyebrow">TENTANG GEOTOON</span>

          <h2>Belajar Geografi lewat cerita.</h2>

          <p>
          Materi disampaikan melalui komik digital, narasi audio, dan
          musik latar agar siswa dapat belajar Geografi melalui cerita
          yang menarik dan interaktif.
          </p>
        </div>
        <div className="feature-grid homepage-feature-grid">
          <div className="feature">
            📚
            <strong>Komik Digital</strong>
            <span>
              Belajar melalui panel cerita dan karakter.
            </span>
          </div>

          <div className="feature">
            🔊
            <strong>Voice-over</strong>
            <span>
              Dengarkan dialog dan penjelasan dari para karakter.
            </span>
          </div>

          <div className="feature">
            🎵
            <strong>Background Music</strong>
            <span>
              Nikmati suasana belajar yang lebih hidup dengan backsound.
            </span>
            <small className="music-credit">
              Credit Music: &quot;Summer (Nature&apos;s Crescendo)&quot; by
              ConcernedApe (Stardew Valley OST) - Source:{" "}
              <a
                href="https://youtu.be/k0nqXeM-sns"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            </small>
          </div>

          <Link href="/tentang" className="feature feature-link">
            👥
            <strong>Profil Tim GEOTOON</strong>
            <span>
              Kenali pihak yang berkontribusi dalam pembuatan media ini.
            </span>
            <span className="feature-link-action">Lihat profil tim →</span>
          </Link>
        </div>
      </section>

      {/* EPISODE */}
      <section className="section episodes-section">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">PETUALANGAN</span>
            <h2>Pilih Episode</h2>
          </div>

          <Link href="/episodes" className="text-link">
            Lihat semua →
          </Link>
        </div>

        <div className="episode-grid">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import { episodes } from '@/data/episodes';
import EpisodeCard from '@/components/EpisodeCard';

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-copy">
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

        <div className="hero-art">
          <Image
            src="/images/geotoon-cover.jpg"
            alt="Karakter GEOTOON"
            width={1536}
            height={1024}
            priority
          />
        </div>
      </section>

      {/* KENALAN DENGAN TOKOH */}
      <section className="section" id="kenalan">
        <div className="section-heading">
          <span className="eyebrow">KENALAN DULU</span>

          <h2>Kenalan dengan tokoh GEOTOON.</h2>

          <p>
            Sebelum memulai petualangan, yuk kenalan dengan teman-teman
            yang akan menemani perjalanan belajar Geografi.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature">
            👧
            <strong>Marni</strong>
            <span>
              Teman yang aktif bertanya dan penasaran dengan berbagai hal.
            </span>
          </div>

          <div className="feature">
            👦
            <strong>Muhammad Ramadhani</strong>
            <span>
              Teman yang senang menjelaskan dan berbagi pengetahuan.
            </span>
          </div>

          <div className="feature">
            👧
            <strong>Gita Tria Ananda</strong>
            <span>
              Teman yang kritis dan suka mencari tahu lebih dalam.
            </span>
          </div>

          <div className="feature">
            👧
            <strong>Humairoh</strong>
            <span>
              Teman yang ikut mengamati dan membantu memahami materi.
            </span>
          </div>
        </div>

        {/* AUDIO PERKENALAN */}
        <div
          style={{
            marginTop: '28px',
            padding: '24px',
            borderRadius: '22px',
            border: '2px solid rgba(15, 39, 71, 0.12)',
            background: '#fff',
            textAlign: 'center',
          }}
        >
          <span className="eyebrow">🎙️ KENALAN DENGAN TOKOH GEOTOON</span>

          <h3
            style={{
              margin: '8px 0',
              fontSize: '1.4rem',
            }}
          >
            Yuk, kenalan dulu!
          </h3>

          <p
            style={{
              margin: '0 auto 18px',
              maxWidth: '600px',
            }}
          >
            Dengarkan perkenalan para tokoh GEOTOON sebelum memulai
            perjalanan belajar Geografi.
          </p>

          <audio
            controls
            preload="metadata"
            style={{
              width: '100%',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <source
              src="/audio/introduction/perkenalan-geotoon.mp3"
              type="audio/mpeg"
            />

            Browser kamu tidak mendukung pemutar audio.
          </audio>
        </div>
      </section>

      {/* TENTANG GEOTOON */}
      <section className="section" id="tentang">
        <div className="section-heading">
          <span className="eyebrow">TENTANG GEOTOON</span>

          <h2>Belajar Geografi lewat cerita.</h2>

          <p>
            Materi disampaikan melalui komik digital, audio, dan quiz
            sederhana agar siswa dapat belajar dengan cara yang lebih
            interaktif.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature">
            📖
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
          </div>

          <div className="feature">
            📝
            <strong>Quiz</strong>
            <span>
              Uji pemahaman setelah menyelesaikan setiap episode.
            </span>
          </div>
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
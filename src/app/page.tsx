import Image from 'next/image';
import Link from 'next/link';
import { episodes } from '@/data/episodes';
import EpisodeCard from '@/components/EpisodeCard';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">MEDIA PEMBELAJARAN GEOGRAFI</span>
          <h1>Mengenal Bumi<br /><span>dari Atas!</span></h1>
          <p>Ikuti petualangan GEOTOON bersama para karakter untuk mengenal peta, citra, dan berbagai objek di permukaan bumi.</p>
          <div className="hero-actions">
            <Link href="/episodes" className="button primary">🚀 Mulai Petualangan</Link>
            <a href="#tentang" className="button secondary">Kenalan Dulu</a>
          </div>
        </div>
        <div className="hero-art">
          <Image src="/images/geotoon-cover.jpg" alt="Karakter GEOTOON" width={1536} height={1024} priority />
        </div>
      </section>

      <section className="section" id="tentang">
        <div className="section-heading">
          <span className="eyebrow">KENALAN DENGAN GEOTOON</span>
          <h2>Belajar Geografi lewat cerita.</h2>
          <p>Materi disampaikan melalui komik digital, audio, dan quiz sederhana agar siswa dapat belajar dengan cara yang lebih interaktif.</p>
        </div>
        <div className="feature-grid">
          <div className="feature">📖 <strong>Komik Digital</strong><span>Belajar melalui panel cerita dan karakter.</span></div>
          <div className="feature">🔊 <strong>Voice-over</strong><span>Dengarkan dialog dan penjelasan setiap panel.</span></div>
          <div className="feature">🎵 <strong>Background Music</strong><span>Pengalaman belajar dibuat lebih hidup.</span></div>
          <div className="feature">📝 <strong>Quiz</strong><span>Uji pemahaman setelah menyelesaikan episode.</span></div>
        </div>
      </section>

      <section className="section episodes-section">
        <div className="section-heading inline">
          <div><span className="eyebrow">PETUALANGAN</span><h2>Pilih Episode</h2></div>
          <Link href="/episodes" className="text-link">Lihat semua →</Link>
        </div>
        <div className="episode-grid">{episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)}</div>
      </section>
    </main>
  );
}

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="site-nav">
      <Link href="/" className="brand" aria-label="GEOTOON - Beranda">
        🌍 GEOTOON
      </Link>
      <nav aria-label="Navigasi utama">
        <Link href="/">
          <span aria-hidden="true">⌂</span> Beranda
        </Link>
        <Link href="/episodes">
          <span aria-hidden="true">📚</span> Episode
        </Link>
        <Link href="/episode/episode-03">
          <span aria-hidden="true">🎯</span> Aktivitas
        </Link>
        <Link href="/tentang">
          <span aria-hidden="true">👥</span> Profil Tim
        </Link>
      </nav>
    </header>
  );
}

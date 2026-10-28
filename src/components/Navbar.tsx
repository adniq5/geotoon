'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const episodeDetailRoutes = new Set([
    '/episode/episode-01',
    '/episode/episode-02',
    '/episode/episode-03',
  ]);

  if (pathname && episodeDetailRoutes.has(pathname.replace(/\/$/, ''))) {
    return null;
  }

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

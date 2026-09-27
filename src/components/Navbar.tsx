import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="site-nav">
      <Link href="/" className="brand">🌍 GEOTOON</Link>
      <nav>
        <Link href="/episodes">Episode</Link>
        <Link href="/#tentang">Tentang</Link>
      </nav>
    </header>
  );
}

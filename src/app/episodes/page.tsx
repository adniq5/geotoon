import Link from 'next/link';
import { episodes } from '@/data/episodes';
import EpisodeCard from '@/components/EpisodeCard';

export default function EpisodesPage() {
  return (
    <main className="page-shell">
      <Link href="/" className="back-link">← Beranda</Link>
      <div className="page-heading"><span className="eyebrow">PETUALANGAN GEOTOON</span><h1>Pilih Episode</h1><p>Pilih cerita untuk mulai belajar.</p></div>
      <div className="episode-grid">{episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)}</div>
    </main>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/data/episodes';

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="episode-card">
      <Image src={episode.cover} alt={episode.title} width={900} height={600} />
      <div className="episode-card-body">
        <span className="episode-badge">Episode {episode.number}</span>
        <h2>{episode.title}</h2>
        <p>{episode.description}</p>
        <Link href={`/episode/${episode.id}`} className="button primary">
          Mulai Petualangan →
        </Link>
      </div>
    </article>
  );
}

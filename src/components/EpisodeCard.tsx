import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/data/episodes';

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="episode-card">
      <div className="episode-card-cover">
        {episode.coverHtml ? (
          <iframe
            src={episode.coverHtml}
            title={`Animasi sampul ${episode.title}`}
            className="episode-card-cover-frame"
            loading="lazy"
            sandbox="allow-scripts"
          />
        ) : (
          <Image
            src={episode.cover}
            alt={`Cover GEOTOON Episode ${episode.number}: ${episode.title}`}
            width={900}
            height={600}
          />
        )}
      </div>
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

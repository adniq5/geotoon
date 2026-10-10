import { notFound } from "next/navigation";
import ComicReader from "@/components/ComicReader";
import { getEpisode } from "@/data/episodes";

type EpisodePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EpisodePage({
  params,
}: EpisodePageProps) {
  const { id } = await params;

  const episode = getEpisode(id);

  if (!episode) {
    notFound();
  }

  return (
    <main>
      <ComicReader
        episodeId={episode.id}
        episodeNumber={episode.number}
        title={episode.title}
        cover={episode.cover}
        preview={episode.preview}
        coverHtml={episode.coverHtml}
        scenes={episode.scenes}
        backgroundMusic="/audio/bgm/geotoon-backsound.mp3"
      />
    </main>
  );
}
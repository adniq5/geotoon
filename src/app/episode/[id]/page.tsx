import { notFound } from "next/navigation";
import ComicReader from "@/components/ComicReader";
import { getEpisode } from "@/data/episodes";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const episode = getEpisode(id);

  if (!episode) {
    notFound();
  }

  return (
    <ComicReader
      episodeId={episode.id}
      episodeNumber={episode.number}
      title={episode.title}
      cover={episode.cover}
      preview={episode.preview}
      scenes={episode.scenes}
    />
  );
}
import { notFound } from "next/navigation";
import Quiz from "@/components/Quiz";
import { evaluations } from "@/data/evaluations";

type Props = {
  params: Promise<{
    episodeId: string;
  }>;
};

function normalizeEpisodeId(id: string) {
  const decoded = decodeURIComponent(id);

  // episode-1 → episode-01
  const match = decoded.match(/^episode-(\d+)$/);

  if (match) {
    return `episode-${match[1].padStart(2, "0")}`;
  }

  return decoded;
}

export default async function QuizPage({ params }: Props) {
  const { episodeId } = await params;

  const normalizedId = normalizeEpisodeId(episodeId);

  const evaluation = evaluations.find(
    (item) => item.episodeId === normalizedId
  );

  if (!evaluation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#eef8ee]">
      <Quiz evaluation={evaluation} />
    </main>
  );
}
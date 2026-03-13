import { ResultScoreCard, ResultBreakdown, Text } from '@repo/ui';

export default function ResultsPage() {
  const breakdown = {
    skills_match: 80,
    experience_relevance: 65,
    education: 70,
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <Text as="h1" size="4xl" weight="semibold">
          Resume Analysis Results
        </Text>

        <Text size="sm" className="text-muted-foreground">
          See how well your resume matches the job description
        </Text>
      </div>

      {/* Score Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <ResultScoreCard score={95} />
        </div>
      </div>

      {/* Breakdown + Keywords */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Breakdown */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <ResultBreakdown breakdown={breakdown} />
        </div>

        {/* Keywords placeholder */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex items-center justify-center text-muted-foreground">
          Keyword Analysis (Coming Next)
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground shadow-sm">
        AI Suggestions (Coming Next)
      </div>
    </main>
  );
}

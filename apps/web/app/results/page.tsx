import { ResultScoreCard, Text } from '@repo/ui';

export default function ResultsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-10">
      <div className="text-center space-y-2">
        <Text as="h1" size="4xl" weight="semibold">
          Resume Analysis Results
        </Text>

        <Text size="sm" className="text-muted-foreground">
          See how well your resume matches the job description.
        </Text>
      </div>

      {/* Score Card */}
      <div className="flex justify-center">
        <ResultScoreCard score={95} />
      </div>

      {/* Placeholder Sections (coming next) */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6 text-center text-muted-foreground">
          Score Breakdown (Coming Next)
        </div>

        <div className="border rounded-lg p-6 text-center text-muted-foreground">
          Keyword Analysis (Coming Next)
        </div>
      </div>

      <div className="border rounded-lg p-6 text-center text-muted-foreground">
        AI Suggestions (Coming Next)
      </div>
    </main>
  );
}

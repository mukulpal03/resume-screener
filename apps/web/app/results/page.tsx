import {
  ResultScoreCard,
  ResultBreakdown,
  ResultKeywords,
  Text,
  ResultSuggestions,
} from '@repo/ui';

export default function ResultsPage() {
  const breakdown = {
    skills_match: 80,
    experience_relevance: 65,
    education: 70,
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Text size="xs" weight="semibold" className="text-slate-400 tracking-widest uppercase">
          Analysis Complete
        </Text>
        <Text as="h1" size="4xl" weight="bold" className="text-slate-900 tracking-tight">
          Resume Results
        </Text>
        <Text size="sm" className="text-slate-400 mt-1">
          See how well your resume matches the job description
        </Text>
      </div>

      {/* Score + Breakdown side by side on top row */}
      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <ResultScoreCard score={95} />
        <ResultBreakdown breakdown={breakdown} />
      </div>

      {/* Keywords full width */}
      <ResultKeywords
        matched={['React', 'Node.js', 'MongoDB', 'GraphQL']}
        missing={['Docker', 'AWS', 'Redis']}
      />

      {/* Suggestions full width */}
      <ResultSuggestions
        suggestions={[
          {
            section: 'Experience',
            issue: 'All experience dates are in the future',
            fix: 'Correct employment timeline',
          },
          {
            section: 'Skills',
            issue: 'Missing key technologies listed in the job description',
            fix: 'Add Docker, AWS, and Redis to your skills section',
          },
        ]}
      />
    </main>
  );
}

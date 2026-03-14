'use client';

import { useEffect, useState } from 'react';
import {
  ResultScoreCard,
  ResultBreakdown,
  ResultKeywords,
  Text,
  ResultSuggestions,
} from '@repo/ui';

type ResumeResult = {
  overall_score: number;
  breakdown: {
    skills_match: number;
    experience_relevance: number;
    education: number;
  };
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: {
    section: string;
    issue: string;
    fix: string;
  }[];
};

type ResumeResponse = {
  success: boolean;
  characters: number;
  result: ResumeResult;
};

export default function ResultsPage() {
  const [data, setData] = useState<ResumeResponse | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('resumeResult');

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return <div>Loading results...</div>;
  }

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

      {/* Score + Breakdown */}
      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <ResultScoreCard score={data.result.overall_score} />

        <ResultBreakdown breakdown={data.result.breakdown} />
      </div>

      {/* Keywords */}
      <ResultKeywords
        matched={data.result.matched_keywords ?? []}
        missing={data.result.missing_keywords ?? []}
      />

      {/* Suggestions */}
      <ResultSuggestions suggestions={data.result.suggestions} />
    </main>
  );
}

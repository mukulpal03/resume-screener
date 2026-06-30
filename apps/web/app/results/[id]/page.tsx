'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResultScoreCard from '../../components/results/result-score-card';
import ResultBreakdown from '../../components/results/result-breakdown';
import ResultKeywords from '../../components/results/result-keywords';
import ResultSuggestions from '../../components/results/result-suggestion';
import Text from '../../components/typography/text';
import type { SingleResultResponse, ResumeResult } from '@repo/types';
import { useResultsService } from '../../services/results.service';

const serifStyle = { fontFamily: 'var(--font-playfair)' };

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<SingleResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchResultById } = useResultsService();

  useEffect(() => {
    if (!id) return;
    const loadResult = async () => {
      try {
        const res = await fetchResultById(id);
        setData(res);
      } catch (err) {
        setError('Failed to load result');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="flex flex-col gap-6">
          <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
          <div className="h-12 w-64 rounded-xl bg-muted animate-pulse" />
          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <div className="h-48 rounded-2xl bg-muted animate-pulse" />
            <div className="h-48 rounded-2xl bg-muted animate-pulse" />
          </div>
          <div className="h-40 rounded-2xl bg-muted animate-pulse" />
          <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-14 flex flex-col items-center gap-4">
        <Text size="base" className="text-muted-foreground">
          {error ?? 'Result not found'}
        </Text>
        <button
          onClick={() => router.push('/results')}
          className="text-sm text-primary hover:underline"
        >
          ← Back to history
        </button>
      </main>
    );
  }

  const item = data.result;
  const isInvalid = item.isValid === false;

  const resumeResult: ResumeResult = {
    is_valid: item.isValid,
    overall_score: item.overallScore,
    breakdown: {
      skills_match: item.skillsMatchScore,
      experience_relevance: item.experienceRelevanceScore,
      education: item.educationScore,
    },
    matched_keywords: item.matchedKeywords,
    missing_keywords: item.missingKeywords,
    suggestions: item.suggestions,
    summary: item.summary,
    job_title: item.jobTitle,
    candidate_name: item.candidateName,
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 flex flex-col gap-8">
      {/* Back */}
      <button
        onClick={() => router.push('/results')}
        className="self-start inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M8 3L3 8l5 5" />
        </svg>
        Back to history
      </button>

      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <Text
          size="xs"
          weight="semibold"
          className={
            isInvalid
              ? 'text-amber-600 tracking-[0.1em] uppercase'
              : 'text-primary tracking-[0.1em] uppercase'
          }
        >
          {isInvalid ? 'Analysis Failed' : 'Analysis Complete'}
        </Text>
        <h1
          className="text-[clamp(24px,3.5vw,40px)] font-bold tracking-tight text-foreground leading-tight"
          style={serifStyle}
        >
          {isInvalid ? 'Unable to Analyze Resume' : (item.jobTitle ?? 'Resume Analysis')}
        </h1>
        {item.candidateName && !isInvalid && (
          <Text size="sm" className="text-muted-foreground">
            Candidate: <span className="font-medium text-foreground">{item.candidateName}</span>
          </Text>
        )}
        <Text size="xs" className="text-muted-foreground/70">
          Analyzed on {formatDate(item.createdAt)}
        </Text>
      </div>

      {isInvalid ? (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start shadow-sm">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 text-xl font-bold">
            ⚠️
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-base font-semibold text-foreground">Please check your inputs</h2>
            <Text size="sm" className="text-muted-foreground leading-relaxed">
              {item.summary}
            </Text>
            <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-1">
              <Text size="xs" className="text-muted-foreground/80 font-medium">
                How to fix this:
              </Text>
              <ul className="list-disc pl-4 text-xs text-muted-foreground/70 space-y-1">
                <li>Make sure you upload a real, professional resume in PDF or Word format.</li>
                <li>Make sure you paste a clear and complete job description description.</li>
                <li>Avoid random characters, generic placeholder documents, or unrelated text.</li>
              </ul>
            </div>
            <button
              onClick={() => router.push('/')}
              className="self-start mt-4 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all"
            >
              Try screening again
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary */}
          {resumeResult.summary && (
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text
                  size="xs"
                  weight="semibold"
                  className="text-primary uppercase tracking-widest"
                >
                  AI Summary
                </Text>
              </div>
              <Text size="sm" className="text-foreground leading-relaxed">
                {resumeResult.summary}
              </Text>
            </div>
          )}

          {/* Score + Breakdown */}
          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <ResultScoreCard score={resumeResult.overall_score} />
            <ResultBreakdown breakdown={resumeResult.breakdown} />
          </div>

          {/* Keywords */}
          <ResultKeywords
            matched={resumeResult.matched_keywords}
            missing={resumeResult.missing_keywords}
          />

          {/* Suggestions */}
          <ResultSuggestions suggestions={resumeResult.suggestions} />
        </>
      )}
    </main>
  );
}

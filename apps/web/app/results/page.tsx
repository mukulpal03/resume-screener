'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Text from '../components/typography/text';
import SectionHeader from '../components/common/section-header';
import type { HistoryItem, HistoryResponse } from '@repo/types';
import { useResultsService } from '../services/results.service';

// const serifStyle = { fontFamily: 'var(--font-playfair)' };

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
}

function getScoreBorder(score: number): string {
  if (score >= 75) return 'border-emerald-400';
  if (score >= 50) return 'border-amber-400';
  return 'border-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 75) return 'bg-emerald-50';
  if (score >= 50) return 'bg-amber-50';
  return 'bg-red-50';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function HistoryCard({ item, onClick }: { item: HistoryItem; onClick: () => void }) {
  const isInvalid = item.isValid === false;

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-border rounded-2xl p-5 cursor-pointer hover:shadow-[0_4px_20px_rgba(5,150,105,0.08)] transition-all duration-200 ${isInvalid ? 'hover:border-amber-500/30' : 'hover:border-primary/30'}`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Score circle */}
        {isInvalid ? (
          <div className="flex-shrink-0 w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-amber-500 text-xl sm:text-2xl">
            ⚠️
          </div>
        ) : (
          <div
            className={`flex-shrink-0 w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full border-2 flex flex-col items-center justify-center ${getScoreBorder(item.overallScore)} ${getScoreBg(item.overallScore)}`}
          >
            <Text
              size="lg"
              weight="bold"
              className={`leading-none sm:text-xl ${getScoreColor(item.overallScore)}`}
            >
              {item.overallScore}
            </Text>
            <Text
              size="xs"
              className="text-muted-foreground scale-90 sm:scale-100 leading-none mt-0.5"
            >
              /100
            </Text>
          </div>
        )}

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Text size="base" weight="semibold" className="text-foreground truncate">
              {isInvalid ? 'Analysis Incomplete' : item?.jobTitle}
            </Text>
          </div>
          <Text size="sm" className="text-muted-foreground truncate">
            {isInvalid ? item?.summary : item?.candidateName}
          </Text>
        </div>
      </div>

      {/* Date & Chips section */}
      <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
        {/* Score breakdown chips */}
        {isInvalid ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md font-medium">
              ⚠️ Invalid Input
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
              Score: 0
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap sm:justify-end">
            <span className="inline-flex items-center gap-1 text-[11px] bg-[#ECFDF5] text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md">
              Skills {item?.skillsMatchScore}%
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md">
              Exp {item?.experienceRelevanceScore}%
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md">
              Edu {item?.educationScore}%
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
              {item?.matchedKeywords?.length} keywords
            </span>
          </div>
        )}

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{timeAgo(item?.createdAt)}</span>
            <span className="text-muted-foreground/30">•</span>
            <span>{formatDate(item?.createdAt)}</span>
          </div>
          <svg
            className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M8 3l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { fetchResultsHistory } = useResultsService();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetchResultsHistory();
        setData(res);
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      {/* Header */}
      <div className="mb-10">
        <SectionHeader
          label="History"
          heading="Your past analyses"
          subtext="All your previously screened resumes in one place."
        />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[104px] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-border rounded-2xl bg-muted/30">
          <Text size="base" className="text-muted-foreground">
            {error}
          </Text>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && (data?.history ?? []).length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 border border-dashed border-border rounded-2xl bg-muted/30">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
            📄
          </div>
          <Text size="lg" weight="medium" className="text-foreground">
            No analyses yet
          </Text>
          <Text size="sm" className="text-muted-foreground text-center max-w-[300px]">
            Upload a resume and paste a job description to get your first analysis.
          </Text>
          <button
            onClick={() => router.push('/')}
            className="mt-2 inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
          >
            Analyze a resume →
          </button>
        </div>
      )}

      {/* History list */}
      {!loading && !error && (data?.history ?? []).length > 0 && (
        <div className="flex flex-col gap-3">
          {/* Stats bar */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap mb-4 px-1">
            <Text size="sm" className="text-muted-foreground">
              <span className="font-semibold text-foreground">{data?.history.length}</span> total
              analyses
            </Text>
            <Text size="sm" className="text-muted-foreground">
              Avg score:{' '}
              <span className="font-semibold text-foreground">
                {(() => {
                  const validHistory = (data?.history ?? []).filter(
                    (item) => item.isValid !== false
                  );
                  return validHistory.length > 0
                    ? Math.round(
                        validHistory.reduce((acc, item) => acc + item.overallScore, 0) /
                          validHistory.length
                      )
                    : 0;
                })()}
              </span>
            </Text>
          </div>

          {(data?.history ?? []).map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onClick={() => router.push(`/results/${item.id}`)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

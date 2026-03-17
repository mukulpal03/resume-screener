import { Card, CardContent } from '@repo/ui';
import { Text } from '@repo/ui';
import type { ResultKeywordsProps } from '@repo/types';

export default function ResultKeywords({ matched = [], missing = [] }: ResultKeywordsProps) {
  const safeMatched = matched ?? [];
  const safeMissing = missing ?? [];

  const matchRate =
    (safeMatched?.length ?? 0) + (safeMissing?.length ?? 0) > 0
      ? Math.round(
          ((safeMatched?.length ?? 0) / ((safeMatched?.length ?? 0) + (safeMissing?.length ?? 0))) *
            100
        )
      : 0;

  const ringColor = matchRate >= 70 ? '#22c55e' : matchRate >= 40 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 26;

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg rounded-2xl">
      {/* Dark header */}
      <div className="bg-slate-900 px-7 py-6 flex items-center justify-between">
        <div>
          <Text size="xs" weight="semibold" className="text-slate-400 tracking-widest uppercase">
            Keyword Analysis
          </Text>
          <Text as="h3" size="xl" weight="bold" className="text-slate-50 tracking-tight mt-1">
            Resume Match Score
          </Text>
        </div>

        {/* Score ring */}
        <div className="relative w-16 h-16">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#1e3a5f" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - matchRate / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-slate-50 text-sm font-extrabold leading-none">{matchRate}%</span>
          </div>
        </div>
      </div>

      <CardContent className="px-7 py-6 bg-white flex flex-col gap-6">
        {/* Matched Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 ring-[3px] ring-green-100" />
            <Text size="xs" weight="semibold" className="text-slate-500 tracking-widest uppercase">
              Matched — {matched.length}
            </Text>
          </div>

          <div className="flex flex-wrap gap-2">
            {matched.length > 0 ? (
              matched.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-1 text-[12.5px] font-medium"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0">
                    <circle cx="6" cy="6" r="6" fill="#22c55e" />
                    <path
                      d="M3.5 6l1.8 1.8 3.2-3.6"
                      stroke="white"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {keyword}
                </span>
              ))
            ) : (
              <Text size="sm" className="text-slate-400 italic">
                No matched keywords
              </Text>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Missing Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 ring-[3px] ring-red-100" />
            <Text size="xs" weight="semibold" className="text-slate-500 tracking-widest uppercase">
              Missing — {missing.length}
            </Text>
          </div>

          <div className="flex flex-wrap gap-2">
            {missing.length > 0 ? (
              missing.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-1 text-[12.5px] font-medium"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0">
                    <circle cx="6" cy="6" r="6" fill="#ef4444" />
                    <path
                      d="M4 4l4 4M8 4l-4 4"
                      stroke="white"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  {keyword}
                </span>
              ))
            ) : (
              <Text size="sm" className="text-slate-400 italic">
                No missing keywords 🎉
              </Text>
            )}
          </div>
        </div>

        {/* Tip banner */}
        {missing.length > 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-base">💡</span>
            <Text size="xs" className="text-slate-500 leading-relaxed">
              Add{' '}
              <strong className="text-slate-800">
                {missing.length} missing keyword{missing.length > 1 ? 's' : ''}
              </strong>{' '}
              to your resume to improve your match score.
            </Text>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

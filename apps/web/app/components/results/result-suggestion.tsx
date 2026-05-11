import { Card, CardContent } from '../ui/card';
import Text from '../typography/text';
import type { ResumeSuggestion } from '@repo/types';

interface Props {
  suggestions: ResumeSuggestion[];
}

export default function ResultSuggestions({ suggestions }: Props) {
  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg rounded-2xl">
      {/* Dark header */}
      <div className="bg-slate-900 px-7 py-6 flex items-center justify-between">
        <div>
          <Text size="xs" weight="semibold" className="text-slate-400 tracking-widest uppercase">
            AI Suggestions
          </Text>
          <Text as="h3" size="xl" weight="bold" className="text-slate-50 tracking-tight mt-1">
            Improvement Areas
          </Text>
        </div>
        {suggestions.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <Text size="xs" className="text-slate-400 tracking-widest uppercase">
              Total
            </Text>
            <span className="text-sm font-bold px-3 py-1 rounded-full border bg-slate-700 text-slate-100 border-slate-600">
              {suggestions.length}
            </span>
          </div>
        )}
      </div>

      <CardContent className="px-0 py-0 bg-white">
        {suggestions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="group relative px-7 py-6 hover:bg-slate-50 transition-colors duration-200"
              >
                {/* Index number — large, faint, decorative */}
                <span className="absolute right-6 top-4 text-6xl font-black text-slate-100 select-none leading-none group-hover:text-slate-200 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Section pill */}
                <div className="inline-flex items-center gap-1.5 bg-slate-900 text-slate-200 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-md mb-4">
                  <div className="w-1 h-1 rounded-full bg-slate-400" />
                  {suggestion.section}
                </div>

                {/* Issue + Fix stacked with a connector line */}
                <div className="relative flex flex-col gap-0 pl-4">
                  {/* Vertical connector line */}
                  <div className="absolute left-0 top-3 bottom-3 w-px bg-gradient-to-b from-red-300 via-slate-200 to-emerald-300" />

                  {/* Issue block */}
                  <div className="relative pl-5 pb-4">
                    <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-400 ring-2 ring-white" />
                    <Text
                      size="xs"
                      weight="semibold"
                      className="text-red-400 uppercase tracking-widest mb-1"
                    >
                      Issue
                    </Text>
                    <Text size="sm" className="text-slate-500 leading-relaxed">
                      {suggestion.issue}
                    </Text>
                  </div>

                  {/* Fix block */}
                  <div className="relative pl-5 pt-1">
                    <div className="absolute left-[-4.5px] top-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                    <Text
                      size="xs"
                      weight="semibold"
                      className="text-emerald-500 uppercase tracking-widest mb-1"
                    >
                      Fix
                    </Text>
                    <Text size="sm" weight="medium" className="text-slate-800 leading-relaxed">
                      {suggestion.fix}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-14 text-center px-7">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text size="sm" className="text-slate-400 italic">
              No suggestions — your resume looks great!
            </Text>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

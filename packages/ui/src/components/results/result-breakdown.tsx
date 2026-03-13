import { Card, CardContent, Progress } from '@repo/ui';
import { Text } from '@repo/ui';

interface Breakdown {
  skills_match: number;
  experience_relevance: number;
  education: number;
}

interface Props {
  breakdown: Breakdown;
}

const getScoreColor = (value: number) => {
  if (value >= 70)
    return {
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    };
  if (value >= 40)
    return {
      bar: 'bg-amber-400',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-400',
    };
  return { bar: 'bg-red-400', badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' };
};

const getScoreLabel = (value: number) => {
  if (value >= 70) return 'Strong';
  if (value >= 40) return 'Fair';
  return 'Weak';
};

export default function ResultBreakdown({ breakdown }: Props) {
  const items = [
    {
      label: 'Skills Match',
      value: breakdown.skills_match,
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path
            d="M2 8h2M12 8h2M8 2v2M8 12v2M4.1 4.1l1.4 1.4M10.5 10.5l1.4 1.4M4.1 11.9l1.4-1.4M10.5 5.5l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      label: 'Experience Relevance',
      value: breakdown.experience_relevance,
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <rect
            x="2"
            y="4"
            width="12"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Education',
      value: breakdown.education,
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path
            d="M8 2L1 6l7 4 7-4-7-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M4 7.5V11c0 1.1 1.8 2 4 2s4-.9 4-2V7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const average = Math.round(items.reduce((sum, i) => sum + i.value, 0) / items.length);
  const avgColors = getScoreColor(average);

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg rounded-2xl">
      {/* Dark header — matches ResultKeywords style */}
      <div className="bg-slate-900 px-7 py-6 flex items-center justify-between">
        <div>
          <Text size="xs" weight="semibold" className="text-slate-400 tracking-widest uppercase">
            Score Breakdown
          </Text>
          <Text as="h3" size="xl" weight="bold" className="text-slate-50 tracking-tight mt-1">
            Category Scores
          </Text>
        </div>

        {/* Average badge */}
        <div className="flex flex-col items-center gap-1">
          <Text size="xs" className="text-slate-400 tracking-widest uppercase">
            Avg
          </Text>
          <span className={`text-sm font-bold px-3 py-1 rounded-full border ${avgColors.badge}`}>
            {average}
          </span>
        </div>
      </div>

      <CardContent className="px-7 py-6 bg-white flex flex-col gap-5">
        {items.map((item, index) => {
          const colors = getScoreColor(item.value);
          return (
            <div key={item.label} className="flex flex-col gap-2">
              {/* Row: icon + label + score badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  {item.icon}
                  <Text size="sm" weight="medium" className="text-slate-700">
                    {item.label}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}
                  >
                    {getScoreLabel(item.value)}
                  </span>
                  <Text
                    size="sm"
                    weight="bold"
                    className="text-slate-800 tabular-nums w-8 text-right"
                  >
                    {item.value}
                  </Text>
                </div>
              </div>

              {/* Progress bar */}
              <Progress value={item.value} className={`h-2 ${colors.bar}`} />

              {/* Divider between items */}
              {index < items.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent mt-1" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

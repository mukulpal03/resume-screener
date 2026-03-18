import { Card, CardContent } from '@repo/ui';
import { Text } from '@repo/ui';

interface Props {
  score: number;
}

export default function ResultScoreCard({ score }: Props) {
  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Needs Improvement';
  };

  const getScoreConfig = () => {
    if (score >= 80)
      return {
        color: 'text-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ring: '#22c55e',
        ringBg: '#dcfce7',
        glow: 'shadow-emerald-100',
      };
    if (score >= 60)
      return {
        color: 'text-amber-500',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        ring: '#f59e0b',
        ringBg: '#fef3c7',
        glow: 'shadow-amber-100',
      };
    if (score >= 40)
      return {
        color: 'text-orange-500',
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        ring: '#f97316',
        ringBg: '#ffedd5',
        glow: 'shadow-orange-100',
      };
    return {
      color: 'text-red-500',
      badge: 'bg-red-50 text-red-700 border-red-200',
      ring: '#ef4444',
      ringBg: '#fee2e2',
      glow: 'shadow-red-100',
    };
  };

  const config = getScoreConfig();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg rounded-2xl">
      {/* Dark header */}
      <div className="bg-slate-900 px-7 py-6">
        <Text size="xs" weight="semibold" className="text-slate-400 tracking-widest uppercase">
          Resume Analysis
        </Text>
        <Text as="h3" size="xl" weight="bold" className="text-slate-50 tracking-tight mt-1">
          Overall Score
        </Text>
      </div>

      <CardContent className="bg-white flex flex-col items-center justify-center gap-6 py-10 px-7">
        {/* SVG ring + score */}
        <div className={`relative w-40 h-40 drop-shadow-xl ${config.glow}`}>
          <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
            {/* Track */}
            <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
            {/* Progress */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={config.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className={`text-5xl font-black leading-none tracking-tighter ${config.color}`}>
              {score}
            </span>
            <Text size="xs" className="text-slate-400 tracking-widest uppercase">
              / 100
            </Text>
          </div>
        </div>

        {/* Label badge */}
        <span className={`text-sm font-semibold px-4 py-1.5 rounded-full border ${config.badge}`}>
          {getScoreLabel()}
        </span>

        {/* Subtle bar breakdown strip */}
        <div className="w-full flex items-center gap-1 px-2">
          {[20, 40, 60, 80, 100].map((threshold, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full"
              style={{
                background:
                  score >= threshold
                    ? config.ring
                    : score >= threshold - 20
                      ? `${config.ring}55`
                      : '#e2e8f0',
              }}
            />
          ))}
        </div>

        <div className="w-full flex justify-between px-2">
          {['Poor', 'Fair', 'Good', 'Great', 'Excellent'].map((label, i) => (
            <Text key={i} size="xs" className="text-slate-400">
              {label}
            </Text>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

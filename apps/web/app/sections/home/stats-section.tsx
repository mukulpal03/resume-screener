import { Text } from '@repo/ui';
import { STATS } from '../../constants/home';

const serifStyle = { fontFamily: 'var(--font-serif)' };

export default function StatsSection() {
  return (
    <div className="border-b border-border bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {STATS.map((s) => (
            <div key={s.num} className="px-8 py-10 flex flex-col gap-1">
              <Text
                as="div"
                size="5xl"
                weight="bold"
                className="leading-none tracking-[-0.03em] text-foreground"
                style={serifStyle}
              >
                {s.num}
                <span className="text-primary">{s.suffix}</span>
              </Text>
              <Text size="sm" weight="medium" className="text-foreground mt-1">
                {s.label}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {s.sub}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Text from '../../components/typography/text';
import { STATS } from '../../constants/home';
import { cn } from '../../lib/utils';

const serifStyle = { fontFamily: 'var(--font-serif)' };

export default function StatsSection() {
  return (
    <div className="border-b border-border bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border md:border-0">
          {STATS.map((s, index) => (
            <div
              key={s.label}
              className={cn(
                'px-6 py-8 flex flex-col gap-1',
                // Mobile grid styling
                'border-t border-border',
                index % 2 === 1 ? 'border-l' : '',
                // Desktop overrides
                'md:border-t-0 md:border-l-0 md:px-8 md:py-10 md:first:border-l-0',
                'md:border-l'
              )}
            >
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

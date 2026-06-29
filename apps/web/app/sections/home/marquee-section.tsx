import Text from '../../components/typography/text';
import { TECH_STACK } from '../../constants/home';

export default function MarqueeSection() {
  const doubled = [...TECH_STACK, ...TECH_STACK];
  return (
    <div
      id="tech-stack"
      className="overflow-hidden border-t border-b border-border bg-[#F5FAF7] py-7"
    >
      <Text
        size="xs"
        weight="medium"
        className="text-center tracking-[0.1em] uppercase text-muted-foreground mb-5"
      >
        Built with
      </Text>
      <div className="flex gap-14 w-max" style={{ animation: 'marquee 22s linear infinite' }}>
        {doubled.map((name, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap opacity-50">
            <span className="w-4 h-4 rounded bg-muted-foreground/40 inline-block" />
            <Text size="sm" weight="medium" className="text-muted-foreground">
              {name}
            </Text>
          </span>
        ))}
      </div>
    </div>
  );
}

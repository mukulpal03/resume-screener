import SectionHeader from '../../components/common/section-header';
import Text from '../../components/typography/text';
import { HOW_IT_WORKS_STEPS } from '../../constants/home';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="How it works"
          heading="Three steps to a hiring decision"
          subtext="Sign in, upload a resume, paste a JD — the AI does the rest."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS_STEPS.map((s, i) => (
            <div
              key={s.num}
              className="relative bg-white border border-border rounded-2xl p-8 shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Connector line between steps */}
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden md:block absolute top-[52px] right-[-24px] w-12 h-px bg-border z-10" />
              )}

              {/* Step number */}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-6">
                <Text size="sm" weight="semibold" className="text-primary-foreground">
                  {s.num}
                </Text>
              </div>

              <Text size="lg" weight="semibold" className="text-foreground mb-3">
                {s.title}
              </Text>
              <Text size="sm" className="text-muted-foreground leading-relaxed mb-5">
                {s.desc}
              </Text>

              <div
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 border border-border"
                style={{ background: s.color }}
              >
                <Text size="xs" className="text-muted-foreground">
                  {s.tag}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

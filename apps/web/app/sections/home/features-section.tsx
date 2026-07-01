import SectionHeader from '../../components/common/section-header';
import Text from '../../components/typography/text';
import { FEATURES, SCORE_BREAKDOWN } from '../../constants/home';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#F5FAF7] border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="Features"
          heading="Everything you need to hire right"
          subtext="Structured AI feedback to help you tailor a resume to any job description."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wide card */}
          <div className="col-span-1 md:col-span-2 bg-white border border-border rounded-2xl p-6 md:p-8 hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-lg mb-5">
              🎯
            </div>
            <Text size="lg" weight="semibold" className="text-foreground mb-2">
              AI match score
            </Text>
            <Text size="sm" className="text-muted-foreground leading-relaxed mb-6">
              Get a 0–100 compatibility score between any resume and job description. Powered by
              semantic AI — not just keyword matching.
            </Text>

            {/* Mini score preview */}
            <div className="bg-[#F5FAF7] border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 rounded-full border-[3px] border-primary flex flex-col items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <Text size="xl" weight="bold" className="text-foreground leading-none">
                  82
                </Text>
                <Text size="xs" className="text-muted-foreground">
                  /100
                </Text>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {SCORE_BREAKDOWN.map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <Text size="xs" className="text-muted-foreground w-[56px] flex-shrink-0">
                      {b.label}
                    </Text>
                    <div className="flex-1 h-[5px] rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${b.pct}%`, background: b.color }}
                      />
                    </div>
                    <Text size="xs" className="text-muted-foreground w-7 text-right">
                      {b.pct}%
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regular feature cards */}
          {FEATURES.filter((f) => !f.wide).map((f) => (
            <div
              key={f.title}
              className="bg-white border border-border rounded-2xl p-6 md:p-7 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-lg mb-5">
                {f.icon}
              </div>
              <Text size="base" weight="semibold" className="text-foreground mb-2">
                {f.title}
              </Text>
              <Text size="sm" className="text-muted-foreground leading-relaxed">
                {f.desc}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

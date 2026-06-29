import SectionHeader from '../../components/common/section-header';
import Text from '../../components/typography/text';
import { REPORT_HIGHLIGHTS } from '../../constants/home';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#F5FAF7] border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="Your report"
          heading="What you get from each analysis"
          subtext="Every run produces a structured report you can revisit from your account history."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REPORT_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-border rounded-2xl p-7 shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-lg mb-5">
                {item.icon}
              </div>
              <Text size="base" weight="semibold" className="text-foreground mb-2">
                {item.title}
              </Text>
              <Text size="sm" className="text-muted-foreground leading-relaxed flex-1">
                {item.desc}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import SectionHeader from '../../components/common/section-header';
import StarRating from '../../components/common/star-rating';
import Text from '../../components/typography/text';
import { TESTIMONIALS } from '../../constants/home';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#F5FAF7] border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="Testimonials"
          heading="Recruiters love it"
          subtext="Real stories from teams using ResumeAI every day."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-border rounded-2xl p-7 shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <StarRating className="mb-4" />
              <p
                className="text-sm text-foreground leading-[1.75] mb-6 flex-1"
                dangerouslySetInnerHTML={{ __html: t.quote }}
              />
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <Text size="sm" weight="medium" className="text-foreground">
                    {t.name}
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    {t.role}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

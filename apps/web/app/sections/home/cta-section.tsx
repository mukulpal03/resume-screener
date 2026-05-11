'use client';

import AppButton from '../../components/common/app-button';
import Text from '../../components/typography/text';

const serifStyle = { fontFamily: 'var(--font-serif)' };

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-28 bg-white border-b border-border">
      {/* Green dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(5,150,105,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)',
        }}
      />

      {/* Green glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(5,150,105,0.08)_0%,transparent_65%)] z-0" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <Text
          as="h2"
          size="5xl"
          weight="bold"
          className="leading-[1.1] tracking-[-0.03em] text-foreground mb-5"
          style={serifStyle}
        >
          Start screening resumes{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            the smart way
          </span>
        </Text>

        <Text size="lg" className="text-muted-foreground font-light leading-relaxed mb-10">
          Free forever. No sign-up needed. Upload a resume and get answers in seconds.
        </Text>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <AppButton
            variant="primary"
            size="lg"
            className="rounded-xl px-8"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Analyze a resume now →
          </AppButton>
          <AppButton
            variant="outline"
            size="lg"
            className="rounded-xl px-8"
            onClick={() =>
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            See how it works
          </AppButton>
        </div>
      </div>
    </section>
  );
}

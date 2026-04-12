'use client';

import { Text, Badge } from '@repo/ui';
import ResumeUploadForm from '../../components/resume-upload-form';
import { HERO_TRUST_POINTS } from '../../constants/home';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(5,150,105,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      {/* Green glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.10)_0%,transparent_65%)] z-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-7 pb-8">
        {/* Eyebrow */}
        <div className="flex justify-center mb-3">
          <Badge
            variant="primary"
            className="gap-2 px-4 rounded-full text-xs font-medium normal-case tracking-normal"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
            AI-powered resume screening — results in seconds
          </Badge>
        </div>

        {/* Headline */}
        <div className="text-center mb-3">
          <h1 className="text-[clamp(32px,4.5vw,58px)] leading-[1.05] tracking-[-0.03em] text-foreground font-bold">
            <span style={{ fontFamily: 'var(--font-playfair)' }}>Screen smarter. </span>
            <span
              className="italic font-normal"
              style={{
                fontFamily: 'var(--font-serif)',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Hire better.
            </span>
          </h1>
        </div>

        {/* Subtext */}
        <div className="text-center mb-5">
          <Text
            size="sm"
            className="text-muted-foreground max-w-[520px] mx-auto leading-relaxed font-light"
          >
            Upload any resume, paste the job description — get an instant AI compatibility score,
            skill gaps, and keyword report in seconds.
          </Text>
        </div>

        {/* Upload Form Card */}
        <div className="mx-auto max-w-4xl">
          <div className="bg-white border border-border rounded-2xl shadow-[0_4px_40px_rgba(5,150,105,0.08),0_1px_8px_rgba(0,0,0,0.06)] p-6">
            <ResumeUploadForm />
          </div>
        </div>

        {/* Trust points */}
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          {HERO_TRUST_POINTS.map((item) => (
            <Text key={item} size="sm" className="text-muted-foreground">
              {item}
            </Text>
          ))}
        </div>
      </div>
    </section>
  );
}

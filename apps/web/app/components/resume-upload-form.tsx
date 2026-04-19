'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadResumeCard, JDTextarea, AppButton, Text, cn } from '@repo/ui';
import { uploadResume } from '../services/resume.service';
import { validateResumeFlow } from '../lib/resume-validation';
import { toast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import type { FormValues } from '@repo/types';
import { RESUME_UPLOAD_STEPS } from '../constants/resume';
import { ApiError } from '../lib/api-error';
import { useAuth } from '@clerk/nextjs';

export default function ResumeUploadForm() {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      resume: null,
      jobDescription: '',
    },
  });

  const resumeFile = watch('resume');
  const jobDescription = watch('jobDescription');

  const handleFileUpload = async (file: File) => {
    setValue('resume', file);
  };

  const onSubmit = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to analyze a resume');
      router.push('/sign-in');
      return;
    }

    const error = validateResumeFlow(resumeFile, jobDescription);
    if (error) {
      toast.error(error);
      return;
    }
    if (!resumeFile) return;

    let interval: NodeJS.Timeout | null = null;

    try {
      setLoading(true);
      setStepIndex(0);

      interval = setInterval(() => {
        setStepIndex((prev) => (prev < RESUME_UPLOAD_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);

      const token = await getToken();
      const result = await uploadResume(resumeFile, token, jobDescription);
      sessionStorage.setItem('resumeResult', JSON.stringify(result));

      if (interval) clearInterval(interval);
      router.push('/results');
    } catch (err) {
      if (interval) clearInterval(interval);

      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Failed to upload resume. Please try again.');
        // eslint-disable-next-line no-console
        console.error('Upload Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = stepIndex === RESUME_UPLOAD_STEPS.length - 1;
  const progressPercent = isLastStep
    ? 95
    : Math.round(((stepIndex + 1) / RESUME_UPLOAD_STEPS.length) * 100);

  return (
    <>
      {/* ── Loading Overlay ── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 max-w-[340px] w-full text-center px-6">
            {/* Spinner ring */}
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-[20%] rounded-full bg-primary/10 animate-pulse" />
              <div className="absolute inset-[35%] rounded-full bg-primary" />
            </div>

            {/* Title + subtitle */}
            <div className="flex flex-col gap-1">
              <Text as="h2" size="xl" weight="semibold" className="text-foreground">
                Analyzing Your Resume
              </Text>
              <Text size="sm" className="text-muted-foreground">
                This usually takes under 10 seconds
              </Text>
            </div>

            {/* Step list */}
            <div className="w-full flex flex-col gap-1.5">
              {RESUME_UPLOAD_STEPS.map((step, i) => {
                const isDone = i < stepIndex;
                const isActive = i === stepIndex;
                const isWaiting = isActive && isLastStep;

                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300',
                      isDone && 'bg-primary/5',
                      isActive && 'bg-primary/10'
                    )}
                  >
                    {/* Step icon */}
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {isDone ? (
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          viewBox="0 0 16 16"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l3.5 3.5L13 4"
                          />
                        </svg>
                      ) : isWaiting ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      ) : isActive ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/25" />
                      )}
                    </div>

                    {/* Step text */}
                    <Text
                      size="sm"
                      className={cn(
                        'text-left flex-1 transition-colors duration-300',
                        isDone && 'text-primary/60 line-through decoration-primary/30',
                        isActive && 'text-foreground font-medium',
                        !isDone && !isActive && 'text-muted-foreground/40'
                      )}
                    >
                      {step}
                    </Text>

                    {/* Waiting badge — only on last step */}
                    {isWaiting && (
                      <Text
                        as="span"
                        size="xs"
                        className="flex-shrink-0 bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        waiting…
                      </Text>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="w-full flex flex-col gap-1.5">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700 ease-out',
                    isLastStep ? 'bg-primary animate-pulse' : 'bg-primary'
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Text size="xs" className="text-muted-foreground/60">
                  {isLastStep
                    ? 'Finalizing results…'
                    : `Step ${stepIndex + 1} of ${RESUME_UPLOAD_STEPS.length}`}
                </Text>
                <Text size="xs" className="text-muted-foreground/60 tabular-nums">
                  {progressPercent}%
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <UploadResumeCard onUpload={handleFileUpload} />
          <JDTextarea
            value={jobDescription}
            onChange={(value) => setValue('jobDescription', value)}
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="min-w-[220px] rounded-xl"
          >
            {loading ? 'Analyzing...' : 'Analyze Resume →'}
          </AppButton>
          <Text size="xs" className="text-muted-foreground">
            Your resume is never stored — 100% private
          </Text>
        </div>
      </form>
    </>
  );
}

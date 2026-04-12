'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadResumeCard, JDTextarea, AppButton, Spinner, Text } from '@repo/ui';
import { uploadResume } from '../services/resume.service';
import { validateResumeFlow } from '../lib/resume-validation';
import { toast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import type { FormValues } from '@repo/types';
import { RESUME_UPLOAD_STEPS } from '../constants/resume';
import { cn } from '@repo/ui';
import { useAuth } from '@clerk/nextjs';
export default function ResumeUploadForm() {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();
  const { isSignedIn } = useAuth();

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

    try {
      setLoading(true);
      setStepIndex(0);

      const interval = setInterval(() => {
        setStepIndex((prev) => (prev < RESUME_UPLOAD_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);

      const result = await uploadResume(resumeFile, jobDescription);
      sessionStorage.setItem('resumeResult', JSON.stringify(result));

      clearInterval(interval);
      router.push('/results');
    } catch {
      toast.error('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((stepIndex + 1) / RESUME_UPLOAD_STEPS.length) * 100;

  return (
    <>
      {/* ── Loading Overlay ── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-5 max-w-[320px] w-full text-center px-6">
            {/* Spinner */}
            <Spinner className="w-14 h-14" />

            {/* Title */}
            <Text as="h2" size="xl" weight="semibold" className="text-foreground">
              Analyzing Your Resume
            </Text>

            {/* Progress bar */}
            <div className="w-full flex flex-col gap-2">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Step dots */}
              <div className="flex items-center justify-center gap-1.5">
                {RESUME_UPLOAD_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-full transition-all duration-300',
                      i < stepIndex
                        ? 'w-1.5 h-1.5 bg-primary'
                        : i === stepIndex
                          ? 'w-2.5 h-2.5 bg-primary ring-2 ring-primary/20'
                          : 'w-1.5 h-1.5 bg-muted-foreground/25'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Current step text */}
            <Text size="sm" className="text-muted-foreground">
              {RESUME_UPLOAD_STEPS[stepIndex]}
            </Text>
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

        {/* Submit */}
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

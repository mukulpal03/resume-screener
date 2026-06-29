'use client';

import { useForm } from 'react-hook-form';
import UploadResumeCard from './upload/upload-resume-card';
import JDTextarea from './input/jd-textarea';
import AppButton from './common/app-button';
import Text from './typography/text';
import type { FormValues } from '@repo/types';
import { useResume } from '../hooks/use-resume';
import { AnalysisOverlay } from './analysis-overlay';
import { validateResumeFlow } from '../lib/resume-validation';
import { FREE_MONTHLY_ANALYSES } from '../constants/home';
import { toast } from 'sonner';

export default function ResumeUploadForm() {
  const { loading, stepIndex, uploadAndAnalyze } = useResume();

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      resume: null,
      jobDescription: '',
    },
  });

  const resumeFile = watch('resume');
  const jobDescription = watch('jobDescription');

  const onSubmit = async () => {
    const error = validateResumeFlow(resumeFile, jobDescription);
    if (error) {
      toast.error(error);
      return;
    }

    await uploadAndAnalyze(resumeFile, jobDescription);
  };

  return (
    <>
      <AnalysisOverlay loading={loading} stepIndex={stepIndex} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <UploadResumeCard onUpload={async (file) => setValue('resume', file)} />
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
            Sign in required · {FREE_MONTHLY_ANALYSES} free analyses per month · Results saved to
            your account
          </Text>
        </div>
      </form>
    </>
  );
}

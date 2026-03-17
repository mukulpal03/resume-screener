'use client';

import { useForm } from 'react-hook-form';
import { UploadResumeCard, JDTextarea, AppButton } from '@repo/ui';
import { uploadResume } from '.././services/resume.service';
import { validateResumeFlow } from '.././lib/resume-validation';
import { toast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import type { FormValues } from '@repo/types';

export default function ResumeUploadForm() {
  const router = useRouter();

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      resume: null,
      jobDescription: '',
    },
  });

  const resumeFile = watch('resume');
  const jobDescription = watch('jobDescription');

  const handleFileupload = async (file: File) => {
    setValue('resume', file);
  };

  const onSubmit = async () => {
    const error = validateResumeFlow(resumeFile, jobDescription);

    if (error) {
      toast.error(error);
      return;
    }

    try {
      if (resumeFile) {
        await uploadResume(resumeFile, jobDescription);
        toast.success('Resume Parsed Successfully');
        router.push('/results');
      }
    } catch {
      toast.error('Failed to upload resume');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <UploadResumeCard onUpload={handleFileupload} />

        <JDTextarea
          value={jobDescription}
          onChange={(value) => setValue('jobDescription', value)}
        />
      </div>

      <div className="mt-10 flex justify-center">
        <AppButton type="submit" size="md">
          Analyze Resume
        </AppButton>
      </div>
    </form>
  );
}

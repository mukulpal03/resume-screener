'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from '@repo/ui';
import { useApi } from '../lib/api';
import { ApiError } from '../lib/api-error';
import { RESUME_UPLOAD_STEPS } from '../constants/resume';

export function useResume() {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const { fetchFromApi } = useApi();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const uploadAndAnalyze = async (file: File | null, jobDescription: string) => {
    if (!isSignedIn) {
      toast.error('Please sign in to analyze a resume');
      router.push('/sign-in');
      return;
    }

    if (!file) {
      toast.error('Please upload a resume first');
      return;
    }

    try {
      setLoading(true);
      setStepIndex(0);

      // Start simulated progress
      let currentStep = 0;
      intervalRef.current = setInterval(() => {
        if (currentStep < RESUME_UPLOAD_STEPS.length - 1) {
          currentStep++;
          setStepIndex(currentStep);
        }
      }, 800);

      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const result = await fetchFromApi('/resume/upload', {
        method: 'POST',
        body: formData,
      });

      cleanup();

      // Move to final step
      setStepIndex(RESUME_UPLOAD_STEPS.length - 1);

      // Store result temporarily if needed (old code did this)
      sessionStorage.setItem('resumeResult', JSON.stringify(result.result));

      // Small delay for UX
      await new Promise((res) => setTimeout(res, 500));

      router.push(`/results/${result.resultId}`);
    } catch (err) {
      cleanup();
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Failed to upload resume. Please try again.');
        console.error('Upload Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    stepIndex,
    uploadAndAnalyze,
  };
}

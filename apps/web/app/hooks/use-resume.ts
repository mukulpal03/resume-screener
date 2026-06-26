'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useResultsService } from '../services/results.service';
import { ApiError } from '../lib/api-error';

// Minimum ms each step must stay visible before the next one can show.
const MIN_STEP_MS = 700;

export function useResume() {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const { enqueueAnalysis } = useResultsService();
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();

  const activeReaderRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stepQueueRef = useRef<number[]>([]);
  const stepDrainTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);
  const navTimerRef = useRef<NodeJS.Timeout | null>(null);
  const analyzingStartRef = useRef<number>(0);
  const step3TransitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const highestEnqueuedRef = useRef<number>(0);

  const drainStepQueue = useCallback(() => {
    if (stepQueueRef.current.length === 0) {
      stepDrainTimerRef.current = null;
      return;
    }

    const next = stepQueueRef.current.shift()!;
    const elapsed = Date.now() - lastStepTimeRef.current;
    const delay = Math.max(0, MIN_STEP_MS - elapsed);

    stepDrainTimerRef.current = setTimeout(() => {
      currentStepRef.current = next;
      setStepIndex(next);
      lastStepTimeRef.current = Date.now();

      if (next === 3) {
        if (step3TransitionTimerRef.current) clearTimeout(step3TransitionTimerRef.current);
        step3TransitionTimerRef.current = setTimeout(() => {
          enqueueStepRef.current(4);
        }, 3500);
      }

      if (next >= 4) {
        if (step3TransitionTimerRef.current) {
          clearTimeout(step3TransitionTimerRef.current);
          step3TransitionTimerRef.current = null;
        }
      }

      drainStepQueue();
    }, delay);
  }, []);

  const enqueueStep = useCallback(
    (step: number) => {
      if (step <= highestEnqueuedRef.current) return;
      highestEnqueuedRef.current = step;

      stepQueueRef.current.push(step);
      if (!stepDrainTimerRef.current) {
        drainStepQueue();
      }
    },
    [drainStepQueue]
  );

  const enqueueStepRef = useRef<(step: number) => void>(enqueueStep);
  enqueueStepRef.current = enqueueStep;

  const scheduleNav = useCallback(
    (path: string, extraDelay = 0) => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);

      const pendingSteps = stepQueueRef.current.length;
      const elapsedOnCurrentStep = Date.now() - lastStepTimeRef.current;
      const remainingOnCurrent = Math.max(0, MIN_STEP_MS - elapsedOnCurrentStep);
      const totalDelay = remainingOnCurrent + pendingSteps * MIN_STEP_MS + extraDelay + 200;

      navTimerRef.current = setTimeout(() => {
        router.push(path);
      }, totalDelay);
    },
    [router]
  );

  const cleanup = useCallback(() => {
    if (activeReaderRef.current) {
      activeReaderRef.current.cancel().catch(() => {});
      activeReaderRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (stepDrainTimerRef.current) {
      clearTimeout(stepDrainTimerRef.current);
      stepDrainTimerRef.current = null;
    }
    if (navTimerRef.current) {
      clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
    if (step3TransitionTimerRef.current) {
      clearTimeout(step3TransitionTimerRef.current);
      step3TransitionTimerRef.current = null;
    }
    stepQueueRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

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
      currentStepRef.current = 0;
      highestEnqueuedRef.current = 0;
      lastStepTimeRef.current = Date.now();
      setStepIndex(0);
      if (step3TransitionTimerRef.current) {
        clearTimeout(step3TransitionTimerRef.current);
        step3TransitionTimerRef.current = null;
      }

      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const { jobId } = await enqueueAnalysis(formData);

      const token = await getToken();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/status/${jobId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error('Connection to analysis status stream failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body stream reader not available');
      activeReaderRef.current = reader;

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue;
          const dataStr = part.slice(6).trim();
          if (!dataStr) continue;

          let event;
          try {
            event = JSON.parse(dataStr);
          } catch {
            continue;
          }

          const { status, resultId, error } = event;

          if (status === 'queued') {
            enqueueStep(1);
          } else if (status === 'analyzing') {
            analyzingStartRef.current = Date.now();
            enqueueStep(2);
            enqueueStep(3);
          } else if (status === 'saving') {
            enqueueStep(4);
          } else if (status === 'done') {
            enqueueStep(4);
            scheduleNav(`/results/${resultId}`);
            return;
          } else if (status === 'failed') {
            cleanup();
            throw new Error(error || 'Analysis job failed');
          }
        }
      }

      throw new Error('Analysis connection closed unexpectedly');
    } catch (err) {
      cleanup();
      setLoading(false);
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error(
          err instanceof Error ? err.message : 'Failed to analyze resume. Please try again.'
        );
        console.error('Analysis Error:', err);
      }
    }
  };

  return { loading, stepIndex, uploadAndAnalyze };
}

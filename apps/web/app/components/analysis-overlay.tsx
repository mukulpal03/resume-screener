'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Text from './typography/text';
import { cn } from '../lib/utils';
import { RESUME_UPLOAD_STEPS } from '../constants/resume';

const STEP_SUB_MESSAGES: string[][] = [
  ['Sending your file to the server...', 'Preparing for analysis...'],
  ['Reading PDF structure...', 'Pulling out plain text...', 'Stripping formatting...'],
  ['Parsing the job requirements...', 'Identifying key skills...', 'Understanding the role...'],
  ['Scoring your experience...', 'Comparing keywords...', 'Checking skill overlap...'],
  ['Drafting improvement tips...', 'Ranking suggestions...', 'Finalising your report...'],
];

function useSubMessage(stepIndex: number, loading: boolean) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    setMsgIndex(0);
    if (!loading) return;
    const messages = STEP_SUB_MESSAGES[stepIndex];
    if (!messages || messages.length <= 1) return;

    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2200);
    return () => clearInterval(id);
  }, [stepIndex, loading]);

  return STEP_SUB_MESSAGES[stepIndex]?.[msgIndex] ?? '';
}

interface AnalysisOverlayProps {
  loading: boolean;
  stepIndex: number;
}

export function AnalysisOverlay({ loading, stepIndex }: AnalysisOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [showRefining, setShowRefining] = useState(false);
  const subMessage = useSubMessage(stepIndex, loading);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (loading && stepIndex === RESUME_UPLOAD_STEPS.length - 1) {
      timeout = setTimeout(() => {
        setShowRefining(true);
      }, 8000);
    } else {
      setShowRefining(false);
    }
    return () => clearTimeout(timeout);
  }, [loading, stepIndex]);

  if (!loading || !mounted) return null;

  const isLastStep = stepIndex === RESUME_UPLOAD_STEPS.length - 1;
  const progressPercent = Math.round(((stepIndex + 1) / RESUME_UPLOAD_STEPS.length) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col items-center gap-6 max-w-[340px] w-full text-center px-6"
        >
          {/* Spinner ring */}
          <div className="relative w-14 h-14 flex-shrink-0">
            <motion.div
              animate={{ scale: isLastStep ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border-[3px] border-primary/20"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: isLastStep ? 0.6 : 1, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent"
            />
            <motion.div
              animate={{
                scale: isLastStep ? [1, 1.25, 1] : [1, 1.1, 1],
                opacity: isLastStep ? [0.4, 0.9, 0.4] : [0.5, 0.8, 0.5],
              }}
              transition={{ repeat: Infinity, duration: isLastStep ? 1 : 2, ease: 'easeInOut' }}
              className="absolute inset-[20%] rounded-full bg-primary/20"
            />
            <motion.div
              animate={isLastStep ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
              className="absolute inset-[35%] rounded-full bg-primary"
            />
          </div>

          {/* Title + subtitle */}
          <div className="flex flex-col gap-1">
            <Text as="h2" size="xl" weight="semibold" className="text-foreground">
              Analyzing Your Resume
            </Text>
            <Text size="sm" className="text-muted-foreground">
              AI analysis usually takes 15–45 seconds
            </Text>
          </div>

          {/* Step list */}
          <div className="w-full flex flex-col gap-1.5">
            {RESUME_UPLOAD_STEPS.map((step, i) => {
              const isDone = i < stepIndex;
              const isActive = i === stepIndex;
              const isWaiting = loading && isActive && isLastStep;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: isWaiting ? 1.03 : 1,
                  }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 relative overflow-hidden',
                    isDone ? 'bg-primary/5' : isActive ? 'bg-primary/10' : 'bg-transparent',
                    isWaiting && 'ring-1 ring-primary/50'
                  )}
                >
                  {/* Strong pulsing background for active generation box */}
                  {isWaiting && (
                    <>
                      <motion.div
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-emerald-400/20 to-primary/20 pointer-events-none"
                      />
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                      />
                    </>
                  )}
                  {/* Step icon area */}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center relative z-10">
                    <AnimatePresence mode="popLayout">
                      {isDone ? (
                        <motion.svg
                          key="done"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-4 h-4 text-primary"
                          fill="none"
                          viewBox="0 0 16 16"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l3.5 3.5L13 4"
                          />
                        </motion.svg>
                      ) : isWaiting ? (
                        <motion.div
                          key="waiting"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-2.5 h-2.5 rounded-full bg-primary"
                        />
                      ) : isActive ? (
                        <motion.div
                          key="active"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1, rotate: 360 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ rotate: { repeat: Infinity, duration: 1, ease: 'linear' } }}
                          className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent"
                        />
                      ) : (
                        <motion.div
                          key="pending"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-2 h-2 rounded-full bg-muted-foreground/25"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step text */}
                  <div className="flex flex-col flex-1 relative z-10 min-w-0">
                    <Text
                      size="sm"
                      className={cn(
                        'text-left transition-colors duration-300',
                        isDone && 'text-primary/60 line-through decoration-primary/30',
                        isActive && 'text-foreground font-medium',
                        !isDone && !isActive && 'text-muted-foreground/40'
                      )}
                    >
                      {step}
                    </Text>
                    {/* Rotating sub-message under the active step */}
                    <AnimatePresence mode="wait">
                      {isActive && loading && !isLastStep && (
                        <motion.span
                          key={subMessage}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.35 }}
                          className="text-[11px] text-primary/60 font-normal mt-0.5 truncate"
                        >
                          {subMessage}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Waiting badge */}
                  <AnimatePresence>
                    {isWaiting && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                        className="relative z-10"
                      >
                        <Text
                          as="span"
                          size="xs"
                          className="flex-shrink-0 bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          waiting…
                        </Text>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full flex flex-col gap-1.5 mt-2">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={cn('h-full rounded-full', isLastStep ? 'bg-primary' : 'bg-primary')}
              />
              {isLastStep && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <Text size="xs" className="text-muted-foreground/60">
                {isLastStep ? (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    {showRefining
                      ? 'AI is refining the analysis for better accuracy...'
                      : 'Finalizing results...'}
                  </motion.span>
                ) : (
                  `Step ${stepIndex + 1} of ${RESUME_UPLOAD_STEPS.length}`
                )}
              </Text>
              <Text size="xs" className="text-muted-foreground/60 tabular-nums">
                {progressPercent}%
              </Text>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

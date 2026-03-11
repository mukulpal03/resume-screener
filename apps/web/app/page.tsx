'use client';
import { Navbar, UploadResumeCard, JDTextarea, Text, AppButton } from '@repo/ui';
import { validateResumeFlow } from './lib/resume-validation';
import { toast } from '@repo/ui';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // Temporary UI values (backend not ready yet)
  const resumeFile: File | null = null;
  const jobDescription = '';

  const handleAnalyze = () => {
    const error = validateResumeFlow(resumeFile, jobDescription);

    if (error) {
      toast.error(error);
      return;
    }

    // Redirect to results page
    router.push('/results');
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Text as="h1" size="6xl" weight="semibold" className="leading-tight">
            Improve Your Resume <br /> for Dream Jobs
          </Text>

          <Text size="lg" className="mt-4 text-muted-foreground">
            Upload your resume and paste the job description to analyze compatibility instantly.
          </Text>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <UploadResumeCard />
          <JDTextarea />
        </div>
        {/* Analyze Button */}
        <div className="mt-10 flex justify-center">
          <AppButton size="md" onClick={handleAnalyze}>
            Analyze Resume
          </AppButton>
        </div>
      </main>
    </>
  );
}

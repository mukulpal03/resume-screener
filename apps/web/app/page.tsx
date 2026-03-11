import { Navbar, UploadResumeCard, JDTextarea, Text } from '@repo/ui';

export default function Page() {
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
      </main>
    </>
  );
}

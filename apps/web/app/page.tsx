import { Navbar, UploadResumeCard, Text } from '@repo/ui';

export default function Page() {
  return (
    <>
      <Navbar />

      <div className="p-10 border bg-red-100 w-full text-center">
        <Text size="7xl">
          Improve Your Resume <br />
          for Dream Jobs
        </Text>
        <Text size="sm" className="text-muted-foreground mt-4">
          Upload your resume to get started
        </Text>
        <main className=" border border-black flex min-h-screen items-center justify-center p-24">
          <UploadResumeCard />
        </main>
      </div>
    </>
  );
}

import { Navbar } from '@repo/ui';
import { UploadResumeCard } from '@repo/ui';

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="p-10">
        Improve Your Resume <br />
        for Dream Jobs
      </div>
      <main className="flex min-h-screen items-center justify-center p-24">
        <UploadResumeCard />
      </main>
    </>
  );
}

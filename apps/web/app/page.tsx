import { Navbar, UploadResumeCard, Text } from '@repo/ui';

export default function Page() {
  return (
    <>
      <Navbar />

      <div className="p-10 text-center flex flex-col items-center justify-center gap-10">
        <Text as="h1" size="6xl" weight="semibold" className="leading-normal">
          Improve Your Resume <br />
          for Dream Jobs
        </Text>
        <div className="flex items-center justify-center gap-10 w-full max-w-4xl ">
          <UploadResumeCard />
        </div>
      </div>
    </>
  );
}

export async function uploadResume(file: File, jobDescription?: string) {
  const formData = new FormData();

  formData.append('resume', file);

  if (jobDescription) formData.append('jobDescription', jobDescription);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Resume upload failed');
  }

  return response.json();
}

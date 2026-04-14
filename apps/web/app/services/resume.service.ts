import { fetchFromApi } from '../lib/api';

export async function uploadResume(file: File, jobDescription?: string) {
  const formData = new FormData();

  formData.append('resume', file);

  if (jobDescription) formData.append('jobDescription', jobDescription);

  return fetchFromApi('/resume/upload', {
    method: 'POST',
    body: formData,
  });
}

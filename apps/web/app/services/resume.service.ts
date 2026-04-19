import { fetchFromApi } from '../lib/api';

export async function uploadResume(file: File, token: string | null, jobDescription?: string) {
  const formData = new FormData();

  formData.append('resume', file);

  if (jobDescription) formData.append('jobDescription', jobDescription);

  return fetchFromApi('/resume/upload', {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

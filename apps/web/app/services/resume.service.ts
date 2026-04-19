import { useApi } from '../lib/api';

export function useResumeService() {
  const { fetchFromApi } = useApi();

  const uploadResume = async (file: File, jobDescription?: string) => {
    const formData = new FormData();

    formData.append('resume', file);

    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    return fetchFromApi('/resume/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return { uploadResume };
}

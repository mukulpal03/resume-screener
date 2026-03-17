export interface Breakdown {
  skills_match: number;
  experience_relevance: number;
  education: number;
}

export interface ResultBreakdownProps {
  breakdown: Breakdown;
}

export type FormValues = {
  resume: File | null;
  jobDescription: string;
};

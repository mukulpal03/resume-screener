export interface Breakdown {
  skills_match: number;
  experience_relevance: number;
  education: number;
}

export interface ResultBreakdownProps {
  breakdown: Breakdown;
}

export type ResumeSection = 'Summary' | 'Experience' | 'Skills' | 'Projects' | 'Education';

export interface ResumeSuggestion {
  section: ResumeSection;
  issue: string;
  fix: string;
}

export interface ResumeResult {
  is_valid: boolean;
  job_title: string;
  candidate_name: string;
  overall_score: number;
  breakdown: Breakdown;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: ResumeSuggestion[];
  summary: string;
}

export type ResumeResponse = {
  success: boolean;
  characters: number;
  result: ResumeResult;
};

export interface ResultKeywordsProps {
  matched: string[];
  missing: string[];
}

// History types
export interface HistoryItem {
  id: number;
  jobTitle: string;
  candidateName: string;
  overallScore: number;
  skillsMatchScore: number;
  experienceRelevanceScore: number;
  educationScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: ResumeSuggestion[];
  summary: string;
  isValid: boolean;
  createdAt: string;
}

export interface HistoryResponse {
  history: HistoryItem[];
}

export interface SingleResultResponse {
  result: HistoryItem;
}

export type JobStatus = 'queued' | 'analyzing' | 'saving' | 'done' | 'failed';

export interface JobStatusEvent {
  status: JobStatus;
  resultId?: number;
  result?: ResumeResult;
  error?: string;
}

export interface EnqueueResponse {
  success: true;
  jobId: string;
}

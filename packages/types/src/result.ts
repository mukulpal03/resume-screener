export interface Breakdown {
  skills_match: number;
  experience_relevance: number;
  education: number;
}

export interface ResultBreakdownProps {
  breakdown: Breakdown;
}

export interface ResumeResult {
  job_title?: string;
  candidate_name?: string;
  overall_score: number;
  breakdown: Breakdown;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: {
    section: string;
    issue: string;
    fix: string;
  }[];
  summary?: string;
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
  jobTitle: string | null;
  candidateName: string | null;
  overallScore: number;
  skillsMatchScore: number;
  experienceRelevanceScore: number;
  educationScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: {
    section: string;
    issue: string;
    fix: string;
  }[];
  summary: string | null;
  createdAt: string;
}

export interface HistoryResponse {
  history: HistoryItem[];
}

export interface SingleResultResponse {
  result: HistoryItem;
}

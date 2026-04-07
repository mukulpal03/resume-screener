export interface Breakdown {
  skills_match: number;
  experience_relevance: number;
  education: number;
}

export interface ResultBreakdownProps {
  breakdown: Breakdown;
}

export interface ResumeResult {
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

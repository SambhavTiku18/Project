export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  createdAt: string;
}

export interface UserStats {
  totalResumes: number;
  totalAnalyses: number;
  averageScore: number;
  averageAtsScore: number;
  latestAnalysis?: AnalysisRecord | null;
}

export interface ResumeItem {
  id: string;
  originalFilename: string;
  fileType: 'pdf' | 'docx';
  fileSize: number;
  wordCount: number;
  pageCount?: number;
  analysisCount?: number;
  detectedSections?: string[];
  createdAt: string;
}

export interface SectionScore {
  name: string;
  score: number;
  status: 'strong' | 'adequate' | 'needs_improvement' | 'missing';
  feedback: string;
}

export interface BulletSuggestion {
  original: string;
  improved: string;
  reason: string;
  category: 'impact' | 'quantification' | 'action_verb' | 'technical_depth';
}

export interface SkillGapAnalysis {
  strong: string[];
  developing: string[];
  notFound: string[];
}

export interface JobMatchDetails {
  score: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  matchingSkills: string[];
  missingSkills: string[];
  advice: string;
}

export interface RecommendationsGroup {
  critical: string[];
  content: string[];
  ats: string[];
  formatting: string[];
  projects: string[];
  technical: string[];
}

export interface AnalysisResultData {
  overallScore: number;
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  sections: SectionScore[];
  skills: SkillGapAnalysis;
  jobMatch: JobMatchDetails;
  recommendations: RecommendationsGroup;
  bulletSuggestions: BulletSuggestion[];
  nextSteps: string[];
  analyzedAt: string;
  modelUsed: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  resumeId: string;
  resumeFilename: string;
  targetRole: string;
  jobDescription?: string;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  analysisResult: AnalysisResultData;
  createdAt: string;
}

export interface AnalysisSummaryItem {
  id: string;
  resumeId: string;
  resumeFilename: string;
  targetRole: string;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  createdAt: string;
}

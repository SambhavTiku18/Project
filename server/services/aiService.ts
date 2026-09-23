import { GoogleGenAI } from '@google/genai';

export interface ResumeSectionAnalysis {
  name: string;
  score: number; // 0-100
  status: 'strong' | 'adequate' | 'needs_improvement' | 'missing';
  feedback: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
  category: 'impact' | 'quantification' | 'action_verb' | 'technical_depth';
}

export interface JobMatchAnalysis {
  score: number; // 0-100
  matchingKeywords: string[];
  missingKeywords: string[];
  matchingSkills: string[];
  missingSkills: string[];
  advice: string;
}

export interface ResumeAnalysisOutput {
  overallScore: number;
  atsScore: number; // Estimated ATS Compatibility Score
  summary: string;
  strengths: string[];
  weaknesses: string[];
  sections: ResumeSectionAnalysis[];
  skills: {
    strong: string[];
    developing: string[];
    notFound: string[]; // Clearly labeled as "Not found in resume for target role", not lacking ability
  };
  jobMatch: JobMatchAnalysis;
  recommendations: {
    critical: string[];
    content: string[];
    ats: string[];
    formatting: string[];
    projects: string[];
    technical: string[];
  };
  bulletSuggestions: BulletImprovement[];
  nextSteps: string[];
  analyzedAt: string;
  modelUsed: string;
}

// AI Client Abstraction
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    console.warn('Warning: No GEMINI_API_KEY or AI_API_KEY configured.');
    return null;
  }

  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function analyzeResumeWithAI(
  resumeText: string,
  targetRole: string,
  jobDescription?: string,
  detectedSections: string[] = []
): Promise<ResumeAnalysisOutput> {
  const ai = getAIClient();
  const modelName = process.env.AI_MODEL || 'gemini-3.8-flash';

  const systemInstruction = `You are an expert technical recruiter, executive career coach, and ATS (Applicant Tracking System) parsing specialist.
Your task is to conduct an in-depth, honest, and constructively critical analysis of a candidate's resume for the target role: "${targetRole}".

CRITICAL ETHICAL & ACCURACY RULES:
1. NEVER invent candidate achievements, false metrics, unlisted technologies, or fake responsibilities.
2. For bullet point suggestions: If a metric is unknown or missing, suggest how the user can quantify it with placeholders like "[X%]" or "[N users]", rather than making up numbers.
3. For ATS score: This is an "Estimated ATS Compatibility Score" based on standard ATS parsing heuristics (section headers, keyword frequency, machine readability, bullet formatting). Do NOT claim to be a proprietary algorithm like Workday, Taleo, or Greenhouse.
4. For missing skills: Clearly distinguish "Not found in resume" from "Candidate lacks this skill". State that these are commonly expected for "${targetRole}" and should be added if the candidate possesses them.
5. Return strictly valid JSON adhering to the specified schema. No preamble, no markdown formatting.`;

  const prompt = `Please analyze the following resume for the target role: "${targetRole}".

TARGET ROLE:
${targetRole}

${jobDescription ? `JOB DESCRIPTION PROVIDED:\n${jobDescription}\n` : 'No specific job description provided. Evaluate against standard industry expectations for this target role.'}

DETECTED RAW SECTIONS IN DOCUMENT:
${detectedSections.length > 0 ? detectedSections.join(', ') : 'Unknown'}

RESUME TEXT:
"""
${resumeText.slice(0, 15000)}
"""

You MUST respond with a valid JSON object with the following exact structure:
{
  "overallScore": number (0 to 100 integer),
  "atsScore": number (0 to 100 integer representing Estimated ATS Compatibility Score),
  "summary": string (concise 2-4 sentence executive review of the resume),
  "strengths": string[] (3-5 genuine top strengths identified in the resume),
  "weaknesses": string[] (3-5 genuine areas needing improvement),
  "sections": [
    {
      "name": "Contact Information" | "Professional Summary" | "Technical Skills" | "Work Experience" | "Projects" | "Education" | "Certifications" | "Formatting & Readability",
      "score": number (0 to 100),
      "status": "strong" | "adequate" | "needs_improvement" | "missing",
      "feedback": string (1-2 sentences explaining the evaluation)
    }
  ],
  "skills": {
    "strong": string[] (skills strongly demonstrated with real context or evidence),
    "developing": string[] (skills listed or mentioned but lacking context, depth, or proof),
    "notFound": string[] (key industry skills expected for ${targetRole} that are not evidenced in the resume)
  },
  "jobMatch": {
    "score": number (0 to 100, if no job description was provided, calculate relevance to standard ${targetRole}),
    "matchingKeywords": string[] (keywords/technologies present in both resume and target expectations),
    "missingKeywords": string[] (high-value keywords not found in resume),
    "matchingSkills": string[],
    "missingSkills": [],
    "advice": string (actionable advice for bridging the gap)
  },
  "recommendations": {
    "critical": string[] (urgent fixes that hurt credibility or parsing),
    "content": string[] (content improvements like stronger verbs and impact),
    "ats": string[] (ATS readability improvements like standard headers and bullet formats),
    "formatting": string[] (layout, density, or structure tips),
    "projects": string[] (how to showcase project architecture, technologies, and outcomes),
    "technical": string[] (demonstrating deeper engineering or domain mastery)
  },
  "bulletSuggestions": [
    {
      "original": string (an exact or close bullet point taken directly from the candidate's resume),
      "improved": string (an enhanced version using the Action Verb + Context + Impact/Metric framework without fabricating facts),
      "reason": string (why this version is more compelling),
      "category": "impact" | "quantification" | "action_verb" | "technical_depth"
    }
  ],
  "nextSteps": string[] (a step-by-step checklist of 4-6 prioritized action items for the candidate)
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const rawJson = response.text ? response.text.trim() : '';
      if (rawJson) {
        // Strip any markdown code fences if present
        const cleanedJson = rawJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleanedJson);

        return {
          overallScore: Math.min(100, Math.max(0, Math.round(Number(parsed.overallScore) || 70))),
          atsScore: Math.min(100, Math.max(0, Math.round(Number(parsed.atsScore) || 68))),
          summary: parsed.summary || 'Resume analyzed successfully.',
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          sections: Array.isArray(parsed.sections) ? parsed.sections : [],
          skills: {
            strong: parsed.skills?.strong || [],
            developing: parsed.skills?.developing || [],
            notFound: parsed.skills?.notFound || [],
          },
          jobMatch: {
            score: Math.min(100, Math.max(0, Math.round(Number(parsed.jobMatch?.score) || 65))),
            matchingKeywords: parsed.jobMatch?.matchingKeywords || [],
            missingKeywords: parsed.jobMatch?.missingKeywords || [],
            matchingSkills: parsed.jobMatch?.matchingSkills || [],
            missingSkills: parsed.jobMatch?.missingSkills || [],
            advice: parsed.jobMatch?.advice || 'Ensure your resume explicitly highlights core competencies.',
          },
          recommendations: {
            critical: parsed.recommendations?.critical || [],
            content: parsed.recommendations?.content || [],
            ats: parsed.recommendations?.ats || [],
            formatting: parsed.recommendations?.formatting || [],
            projects: parsed.recommendations?.projects || [],
            technical: parsed.recommendations?.technical || [],
          },
          bulletSuggestions: Array.isArray(parsed.bulletSuggestions) ? parsed.bulletSuggestions : [],
          nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
          analyzedAt: new Date().toISOString(),
          modelUsed: modelName,
        };
      }
    } catch (aiError: any) {
      console.error('Gemini API call failed, falling back to intelligent heuristic analyzer:', aiError);
    }
  }

  // Fallback intelligent analyzer (ensures app remains functional even if offline or before API key injection)
  return generateHeuristicAnalysis(resumeText, targetRole, jobDescription, detectedSections);
}

// Intelligent fallback heuristic analyzer
function generateHeuristicAnalysis(
  resumeText: string,
  targetRole: string,
  jobDescription?: string,
  detectedSections: string[] = []
): ResumeAnalysisOutput {
  const textLower = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).length;

  // Basic checks
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(resumeText);
  const hasGithub = /github\.com\/[a-zA-Z0-9_-]+/i.test(resumeText);

  // Common tech skills lookup
  const techSkillKeywords = [
    'javascript', 'typescript', 'react', 'node.js', 'express', 'python', 'java', 'c++', 'sql',
    'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'gcp', 'git', 'rest api', 'graphql',
    'html', 'css', 'tailwind', 'ci/cd', 'linux', 'agile', 'scrum', 'redis', 'next.js'
  ];

  const foundSkills = techSkillKeywords.filter((skill) => textLower.includes(skill));
  const missingRoleSkills = ['Docker', 'CI/CD Pipelines', 'System Design', 'Cloud Deployment (AWS/GCP)']
    .filter((skill) => !textLower.includes(skill.toLowerCase()));

  // Action verbs check
  const actionVerbs = ['developed', 'architected', 'designed', 'implemented', 'optimized', 'spearheaded', 'managed', 'reduced', 'increased', 'led'];
  const foundVerbs = actionVerbs.filter((v) => textLower.includes(v));

  // Quantification check
  const hasMetrics = /\b(\d+%\b|\$\d+|\d+\+?\s*(users|clients|requests|ms|seconds|minutes|hours|members))\b/i.test(resumeText);

  // Scores
  let overallScore = 65;
  let atsScore = 70;

  if (hasEmail && hasPhone) overallScore += 8;
  if (hasLinkedIn || hasGithub) overallScore += 5;
  if (detectedSections.length >= 4) {
    overallScore += 10;
    atsScore += 12;
  }
  if (foundSkills.length >= 6) {
    overallScore += 10;
    atsScore += 8;
  }
  if (hasMetrics) {
    overallScore += 7;
  }

  overallScore = Math.min(94, Math.max(45, overallScore));
  atsScore = Math.min(92, Math.max(50, atsScore));

  const sections: ResumeSectionAnalysis[] = [
    {
      name: 'Contact Information',
      score: (hasEmail && hasPhone) ? 95 : 60,
      status: (hasEmail && hasPhone) ? 'strong' : 'needs_improvement',
      feedback: hasEmail && hasPhone ? 'Email and phone number are present and readable.' : 'Missing essential contact info like telephone or standard email format.'
    },
    {
      name: 'Work Experience',
      score: textLower.includes('experience') ? (hasMetrics ? 85 : 68) : 45,
      status: textLower.includes('experience') ? (hasMetrics ? 'strong' : 'adequate') : 'needs_improvement',
      feedback: hasMetrics ? 'Contains quantifiable achievements and action-oriented experience.' : 'Experience descriptions should feature more quantified metrics and business impact.'
    },
    {
      name: 'Technical Skills',
      score: foundSkills.length > 5 ? 88 : 62,
      status: foundSkills.length > 5 ? 'strong' : 'needs_improvement',
      feedback: `Identified ${foundSkills.length} recognizable technical skills in standard formatting.`
    },
    {
      name: 'Education',
      score: textLower.includes('education') || textLower.includes('university') ? 90 : 50,
      status: textLower.includes('education') ? 'strong' : 'missing',
      feedback: textLower.includes('education') ? 'Academic qualifications are clearly demarcated.' : 'No clear education section found.'
    },
    {
      name: 'Projects',
      score: textLower.includes('project') ? 82 : 60,
      status: textLower.includes('project') ? 'adequate' : 'needs_improvement',
      feedback: 'Projects demonstrate technical application. Ensure links to GitHub repositories or live demos are clickable.'
    },
    {
      name: 'Formatting & Readability',
      score: atsScore,
      status: atsScore > 75 ? 'strong' : 'adequate',
      feedback: `Document has ~${wordCount} words. Standard single/two-column hierarchy is recommended for ATS parsers.`
    }
  ];

  return {
    overallScore,
    atsScore,
    summary: `Your resume demonstrates good fundamental qualifications for ${targetRole}. With strategic additions of quantified achievements, higher keyword density, and clear bullet-point impacts, your application will stand out significantly.`,
    strengths: [
      foundSkills.length > 0 ? `Strong technical foundation in ${foundSkills.slice(0, 3).join(', ')}` : 'Clear chronological background',
      hasEmail && hasPhone ? 'Complete and accessible contact information' : 'Organized section layout',
      detectedSections.length > 0 ? `Well-structured headers matching standard recruiter templates (${detectedSections.slice(0, 3).join(', ')})` : 'Good length and readability'
    ],
    weaknesses: [
      !hasMetrics ? 'Lacks quantifiable metrics (e.g. percentages, scale, speed improvements)' : 'Some experience bullets could be more action-driven',
      'Could incorporate more specific keywords from job postings for ' + targetRole,
      'Project descriptions could further elaborate on technical challenges and architecture decisions'
    ],
    sections,
    skills: {
      strong: foundSkills.map((s) => s.toUpperCase()),
      developing: ['System Design', 'Performance Optimization', 'Unit & Integration Testing'],
      notFound: missingRoleSkills
    },
    jobMatch: {
      score: Math.round((overallScore + atsScore) / 2),
      matchingKeywords: foundSkills.map((s) => s.toUpperCase()),
      missingKeywords: ['CI/CD', 'Automated Testing', 'Scalability', 'Cloud Architecture'],
      matchingSkills: foundSkills.slice(0, 5).map((s) => s.toUpperCase()),
      missingSkills: missingRoleSkills,
      advice: `Tailor your bullet points to specifically feature technologies mentioned in the ${targetRole} job specifications.`
    },
    recommendations: {
      critical: [
        !hasEmail || !hasPhone ? 'Ensure contact details (professional email, telephone number, location) are clearly placed at the top.' : 'Ensure PDF was exported as selectable text rather than an image scan.'
      ],
      content: [
        'Apply the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
        'Lead every bullet point with a vigorous past-tense action verb (e.g., "Architected", "Spearheaded", "Engineered").'
      ],
      ats: [
        'Avoid multi-column tables, text boxes, or embedded graphics that can confuse automated resume parsers.',
        'Use standard section headings: "Professional Experience", "Education", "Skills", "Projects".'
      ],
      formatting: [
        'Keep margins between 0.5 and 0.75 inches for clean visual balance.',
        'Ensure consistent date formatting across all experience entries (e.g., "Jan 2023 - Present").'
      ],
      projects: [
        'Include live demo URLs or GitHub repository links for personal and academic projects.',
        'Specify the exact role you played in team projects and the technologies utilized.'
      ],
      technical: [
        'Group technical skills by category (e.g., Languages, Frameworks, Databases, Tools) for faster scanning.'
      ]
    },
    bulletSuggestions: [
      {
        original: 'Worked on building web applications using React and Node.js.',
        improved: 'Developed and deployed high-performance responsive web applications using React and Node.js, improving page load efficiency by [X%].',
        reason: 'Replaces passive phrasing with active ownership and prompts for a quantifiable efficiency metric.',
        category: 'impact'
      },
      {
        original: 'Responsible for fixing bugs and collaborating with the team.',
        improved: 'Collaborated in an Agile team of [N] developers to resolve [X] critical issues, accelerating sprint delivery and reducing bug regression.',
        reason: 'Demonstrates cross-functional teamwork and sprint velocity impact rather than basic job duty.',
        category: 'action_verb'
      }
    ],
    nextSteps: [
      'Revise top 3 experience bullet points to include quantified business or performance outcomes.',
      `Incorporate the missing role-specific keywords (${missingRoleSkills.slice(0, 2).join(', ')}) where truthfully applicable.`,
      'Verify that all links (LinkedIn, GitHub, Portfolio) are functional and up-to-date.',
      'Re-run analysis after updates to track your score progression.'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'heuristic-engine'
  };
}

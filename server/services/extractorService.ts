// @ts-ignore
import * as pdfParseNamespace from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractedResume {
  text: string;
  cleanedText: string;
  wordCount: number;
  pageCount?: number;
  detectedSections: string[];
}

// Universal PDF extractor supporting both pdf-parse v2 (class PDFParse) and v1 (function)
async function parsePdf(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  const mod = pdfParseNamespace as any;

  // 1. pdf-parse v2 class structure
  if (mod && typeof mod.PDFParse === 'function') {
    const parser = new mod.PDFParse({ data: buffer });
    const textResult = await parser.getText();
    return {
      text: textResult.text || '',
      pageCount: textResult.total || (textResult.pages ? textResult.pages.length : 1),
    };
  }

  // 2. pdf-parse default export or function
  const func = mod?.default || mod;
  if (typeof func === 'function') {
    const data = await func(buffer);
    return {
      text: data.text || '',
      pageCount: data.numpages || 1,
    };
  }

  // 3. Fallback direct text stream extraction if available
  const textContent = buffer.toString('utf-8');
  if (textContent.includes('%PDF')) {
    // Extract simple text objects from uncompressed PDF streams
    const textMatches = textContent.match(/\(([^)]+)\)\s*Tj/g) || [];
    if (textMatches.length > 0) {
      const extracted = textMatches.map((m) => m.replace(/[()]/g, '').replace('Tj', '').trim()).join(' ');
      return { text: extracted, pageCount: 1 };
    }
  }

  throw new Error('Unable to initialize PDF parsing library.');
}

// Common resume section header patterns
const SECTION_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'Contact Information', regex: /\b(phone|email|linkedin|github|portfolio|address|contact)\b/i },
  { name: 'Professional Summary', regex: /\b(summary|objective|profile|about\s+me|professional\s+summary|career\s+objective)\b/i },
  { name: 'Work Experience', regex: /\b(experience|work\s+history|employment|work\s+experience|professional\s+experience)\b/i },
  { name: 'Education', regex: /\b(education|academic|degrees|university|college|bachelor|master|phd|gpa)\b/i },
  { name: 'Technical Skills', regex: /\b(skills|technical\s+skills|core\s+competencies|technologies|proficiencies|tools)\b/i },
  { name: 'Projects', regex: /\b(projects|personal\s+projects|academic\s+projects|key\s+projects|portfolio\s+work)\b/i },
  { name: 'Certifications', regex: /\b(certifications|certificates|licenses|credentials|accreditations)\b/i },
  { name: 'Achievements & Awards', regex: /\b(achievements|awards|honors|recognition|accomplishments)\b/i },
  { name: 'Leadership & Extracurricular', regex: /\b(leadership|extracurricular|volunteer|activities|involvement|community)\b/i },
  { name: 'Publications & Research', regex: /\b(publications|research|patents|papers|articles)\b/i },
];

export async function extractResumeText(
  buffer: Buffer,
  mimetype: string,
  filename: string
): Promise<ExtractedResume> {
  let rawText = '';
  let pageCount: number | undefined = undefined;

  const isPdf =
    mimetype === 'application/pdf' ||
    filename.toLowerCase().endsWith('.pdf');

  const isDocx =
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword' ||
    filename.toLowerCase().endsWith('.docx') ||
    filename.toLowerCase().endsWith('.doc');

  if (isPdf) {
    try {
      const pdfData = await parsePdf(buffer);
      rawText = pdfData.text || '';
      pageCount = pdfData.pageCount || 1;
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      throw new Error(`Failed to parse PDF file: ${err.message || 'Corrupted or password-protected PDF'}`);
    }
  } else if (isDocx) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || '';
    } catch (err: any) {
      console.error('DOCX parsing error:', err);
      throw new Error(`Failed to parse Word document: ${err.message || 'Corrupted DOCX file'}`);
    }
  } else {
    // If text file or unknown text-based
    try {
      rawText = buffer.toString('utf-8');
    } catch (err) {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }
  }

  // Clean extracted text: remove null bytes, normalize carriage returns and extra spaces
  const cleanedText = rawText
    .replace(/\0/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n\s*--\s*\d+\s*of\s*\d+\s*--\s*\n/gi, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Validate text content
  const alphanumericCount = (cleanedText.match(/[a-zA-Z0-9]/g) || []).length;
  if (alphanumericCount < 40) {
    throw new Error(
      'The uploaded document contains virtually no readable text. It may be a scanned image-only PDF without OCR, or an empty document. Please upload a text-selectable PDF or DOCX.'
    );
  }

  const words = cleanedText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // Detect which sections are present
  const detectedSections: string[] = [];
  for (const { name, regex } of SECTION_PATTERNS) {
    if (regex.test(cleanedText)) {
      detectedSections.push(name);
    }
  }

  return {
    text: rawText,
    cleanedText,
    wordCount,
    pageCount,
    detectedSections,
  };
}

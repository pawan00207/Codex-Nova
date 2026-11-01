export interface LanguageConfig {
  id: string;
  name: string;
  monacoLang: string;
  version: string;
  extension: string;
  boilerplate: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    sampleStdin?: string;
  }[];
  offlineCapable: boolean;
  category: 'Popular' | 'Systems' | 'Scripting' | 'Web' | 'Data & DB';
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb: number;
  language: string;
  version: string;
  success: boolean;
}

export interface AIFixResult {
  rootCause: string;
  fixedCode: string;
  explanation: string[];
  diffSummary: string;
  preventionTip: string;
}

export interface ConceptItem {
  name: string;
  description: string;
  commonMistake: string;
}

export interface LineExplanation {
  lines: string;
  purpose: string;
  explanation: string;
}

export interface ExplainResult {
  summary: string;
  timeComplexity: string;
  spaceComplexity: string;
  complexityReasoning: string;
  concepts: ConceptItem[];
  lineByLine: LineExplanation[];
  whyItWorks: string;
  alternativeApproach: string;
}

export type EditorTheme = 'vs-dark' | 'cyberpunk' | 'light' | 'amoled';

export interface CodeProject {
  id: string;
  name: string;
  language: string;
  code: string;
  stdin: string;
  updatedAt: number;
}

export interface ProjectFile {
  id: string;
  name: string;
  languageId: string;
  content: string;
  isModified?: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput?: string;
  actualOutput?: string;
  status?: 'idle' | 'running' | 'passed' | 'failed';
}

export interface ExecutionHistoryItem {
  id: string;
  timestamp: number;
  language: string;
  code: string;
  stdin: string;
  result: ExecutionResult;
}

// Chat related types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  cveData?: CVEDetail;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// CVE related types
export interface CVEDetail {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Description[];
  metrics?: Metrics;
  weaknesses?: Weakness[];
  configurations?: Configuration[];
  references?: Reference[];
}

export interface Description {
  lang: string;
  value: string;
}

export interface Metrics {
  cvssMetricV31?: CVSSMetricV31[];
  cvssMetricV30?: CVSSMetricV30[];
  cvssMetricV2?: CVSSMetricV2[];
}

export interface CVSSMetricV31 {
  type: string;
  cvssData: CVSSDataV31;
}

export interface CVSSDataV31 {
  version: string;
  vectorString: string;
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: string;
}

export interface CVSSMetricV30 {
  type: string;
  cvssData: CVSSDataV30;
}

export interface CVSSDataV30 {
  version: string;
  vectorString: string;
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: string;
}

export interface CVSSMetricV2 {
  type: string;
  cvssData: CVSSDataV2;
}

export interface CVSSDataV2 {
  version: string;
  vectorString: string;
  accessVector: string;
  accessComplexity: string;
  authentication: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
}

export interface Weakness {
  type: string;
  source?: Source;
  description: Description[];
}

export interface Source {
  id: string;
  name: string;
}

export interface Configuration {
  nodes: Node[];
}

export interface Node {
  operator: string;
  negate: boolean;
  cpeMatch?: CPEMatch[];
}

export interface CPEMatch {
  vulnerable: boolean;
  criteria: string;
  matchCriteriaId: string;
}

export interface Reference {
  url: string;
  source?: string;
  tags?: string[];
}

// NVD API Response types
export interface NVDCVEApiResponse {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: string;
  vulnerabilities: Vulnerability[];
}

export interface Vulnerability {
  cve: CVEDetail;
}

// Settings related types
export interface AppSettings {
  theme: 'dark' | 'light';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

// Groq API related types
export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatRequest {
  messages: GroqMessage[];
  model: string;
  temperature: number;
  max_tokens: number;
  stream?: boolean;
}

export interface GroqChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GroqChoice[];
  usage: {
    prompt_tokens: number;
    prompt_time: number;
    completion_tokens: number;
    completion_time: number;
    total_tokens: number;
    total_time: number;
  };
  system_fingerprint: string;
  x_groq: {
    id: string;
  };
}

export interface GroqChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
  logprobs: null | any;
}

// API related types (legacy, kept for compatibility)
export interface ChatRequest {
  messages: Message[];
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface CVEAnalysisRequest {
  cveId: string;
  cveData?: CVEDetail;
  query?: string;
}

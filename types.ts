export interface PromptInjectionResult {
  detected: boolean;
  confidence: number;
  description: string;
}

export interface HarmfulIntentResult {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'safe';
  description: string;
}

export interface PiiDetectionResult {
  found: boolean;
  types: string[];
  maskedPrompt: string;
}

export interface AnalysisResponse {
  promptInjection: PromptInjectionResult;
  harmfulIntent: HarmfulIntentResult;
  piiDetection: PiiDetectionResult;
  timestamp: string;
}

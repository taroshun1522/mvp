// -- Instructor --

export type InstructorId = "emma" | "james" | "sophia";

export interface Instructor {
  id: InstructorId;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  imageSrc: string;
  topic: string;
  personaConfig: PersonaConfig;
}

export interface PersonaConfig {
  name: string;
  avatarId: string;
  voiceId: string;
  llmId: string;
  systemPrompt: string;
  maxSessionLengthSeconds: number;
  skipGreeting: boolean;
  voiceDetectionOptions: {
    speechEnhancementLevel: number;
    endOfSpeechSensitivity: number;
  };
}

// -- Error Tracking (Client Tools) --

export type ErrorCategory = "grammar" | "vocabulary" | "expression" | "pronunciation_hint";

export interface ErrorEntry {
  original: string;
  corrected: string;
  explanation: string;
  category: ErrorCategory;
  timestamp: number;
}

// -- Feedback --

export type ErrorSeverity = "minor" | "moderate" | "major";
export type OverallLabel = "Great" | "Good" | "Keep Practicing";

export interface FeedbackError {
  original: string;
  corrected: string;
  explanation: string;
  category: "grammar" | "vocabulary" | "expression";
  severity: ErrorSeverity;
}

export interface NaturalExpression {
  used: string;
  comment: string;
}

export interface FeedbackData {
  overallScore: number;
  overallLabel: OverallLabel;
  summary: string;
  errors: FeedbackError[];
  strengths: string[];
  suggestions: string[];
  naturalExpressions: NaturalExpression[];
}

// -- API Request/Response --

export interface SessionRequest {
  instructorId: InstructorId;
}

export interface SessionResponse {
  sessionToken: string;
}

export interface FeedbackRequest {
  conversationHistory: { role: string; content: string }[];
  errors: ErrorEntry[];
}

// -- sessionStorage --

export interface LessonStorageData {
  conversationHistory: { role: string; content: string }[];
  errors: ErrorEntry[];
}

/**
 * Types definition for the law firm application.
 */

export interface ConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  caseType: 'Sucesión' | 'Divorcio' | 'Consulta General';
  message: string;
  createdAt: string;
  status: 'pendiente' | 'revisado' | 'respondido';
  aiAnalysis?: string;
  aiClassification?: string;
  lawyerNotes?: string;
}

export interface CaseAnalysis {
  category: 'Sucesión' | 'Divorcio' | 'Consulta General';
  urgency: 'Alta' | 'Media' | 'Baja';
  summary: string;
  keyPoints: string[];
  recommendedSteps: string[];
  suggestedQuestions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

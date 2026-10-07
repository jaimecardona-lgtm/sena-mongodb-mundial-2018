export interface AIChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

export interface AIChatResponse {
  status: string;
  request_id: string;
  answer: string;
  model: string;
  tools_used: string[];
  evidence: any;
}

const AI_API_BASE =
  import.meta.env.VITE_AI_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:8000' : '');

export const aiApi = {
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    const response = await fetch(`${AI_API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI service error: ${error}`);
    }

    return response.json();
  },

  async health() {
    try {
      const response = await fetch(`${AI_API_BASE}/api/ai/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};

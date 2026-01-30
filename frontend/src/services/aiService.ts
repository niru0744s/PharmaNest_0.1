import api from './api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

export interface AIResponse {
    success: boolean;
    reply: string;
}

export interface HistoryResponse {
    success: boolean;
    history: ChatMessage[];
}

export const aiService = {
    getAdvice: async (message: string, history: ChatMessage[] = []): Promise<AIResponse> => {
        const response = await api.post('/ai/chat', { message, history });
        return response.data;
    },

    getHistory: async (): Promise<HistoryResponse> => {
        const response = await api.get('/ai/history');
        return response.data;
    }
};

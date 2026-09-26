import api from './api';
import { API_BASE_URL } from '../utils/constants';

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

interface StreamAdviceOptions {
    onMeta?: (meta: { cached?: boolean }) => void;
    onChunk?: (chunk: string) => void;
    onDone?: (reply: string) => void;
}

const buildAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    };
};

export const aiService = {
    getAdvice: async (message: string, history: ChatMessage[] = []): Promise<AIResponse> => {
        const response = await api.post('/ai/chat', { message, history });
        return response.data;
    },

    streamAdvice: async (
        message: string,
        history: ChatMessage[] = [],
        options: StreamAdviceOptions = {}
    ): Promise<AIResponse> => {
        const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
            method: 'POST',
            headers: buildAuthHeaders(),
            body: JSON.stringify({ message, history })
        });

        if (!response.ok || !response.body) {
            throw new Error('Streaming request failed');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent = '';
        let finalReply = '';

        const processLine = (line: string) => {
            const trimmed = line.trim();
            if (!trimmed) {
                currentEvent = '';
                return;
            }

            if (trimmed.startsWith('event:')) {
                currentEvent = trimmed.slice(6).trim();
                return;
            }

            if (!trimmed.startsWith('data:')) return;

            const payloadRaw = trimmed.slice(5).trim();
            if (!payloadRaw) return;

            try {
                const payload = JSON.parse(payloadRaw);
                if (currentEvent === 'meta') {
                    options.onMeta?.(payload);
                } else if (currentEvent === 'chunk') {
                    const chunkText = payload?.text || '';
                    if (chunkText) {
                        finalReply += chunkText;
                        options.onChunk?.(chunkText);
                    }
                } else if (currentEvent === 'done') {
                    finalReply = payload?.reply || finalReply;
                    options.onDone?.(finalReply);
                } else if (currentEvent === 'error') {
                    throw new Error(payload?.message || 'Streaming failed');
                }
            } catch (error) {
                if (currentEvent === 'error') {
                    throw error;
                }
            }
        };

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            lines.forEach(processLine);
        }

        if (buffer) {
            processLine(buffer);
        }

        if (!finalReply.trim()) {
            throw new Error('Empty streaming response');
        }

        return {
            success: true,
            reply: finalReply
        };
    },

    getHistory: async (): Promise<HistoryResponse> => {
        const response = await api.get('/ai/history');
        return response.data;
    }
};

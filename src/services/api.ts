import { User, ResumeItem, AnalysisRecord, AnalysisSummaryItem, UserStats } from '../types';

const TOKEN_KEY = 'resumeiq_auth_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to JSON if body is NOT FormData
  if (!(options.body instanceof FormData) && !('Content-Type' in (headers as Record<string, string>))) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: `Network error or invalid server response (${response.status})`,
  }));

  if (!response.ok || data.success === false) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  auth: {
    register: (payload: { name: string; email: string; password: string; confirmPassword?: string }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    login: (payload: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    getMe: () =>
      request<{ success: boolean; user: User; stats: UserStats }>('/auth/me'),

    logout: () => {
      tokenStorage.clear();
      return request<{ success: boolean }>('/auth/logout', { method: 'POST' }).catch(() => ({ success: true }));
    },
  },

  resumes: {
    upload: (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      return request<{ success: boolean; resume: ResumeItem }>('/resumes/upload', {
        method: 'POST',
        body: formData,
      });
    },

    getAll: () =>
      request<{ success: boolean; resumes: ResumeItem[] }>('/resumes'),

    getById: (id: string) =>
      request<{ success: boolean; resume: ResumeItem & { extractedText: string } }>(`/resumes/${id}`),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/resumes/${id}`, {
        method: 'DELETE',
      }),
  },

  analysis: {
    run: (payload: { resumeFile?: File; resumeId?: string; targetRole: string; jobDescription?: string }) => {
      if (payload.resumeFile) {
        const formData = new FormData();
        formData.append('resume', payload.resumeFile);
        formData.append('targetRole', payload.targetRole);
        if (payload.jobDescription) {
          formData.append('jobDescription', payload.jobDescription);
        }
        return request<{ success: boolean; analysis: AnalysisRecord }>('/analysis', {
          method: 'POST',
          body: formData,
        });
      } else {
        return request<{ success: boolean; analysis: AnalysisRecord }>('/analysis', {
          method: 'POST',
          body: JSON.stringify({
            resumeId: payload.resumeId,
            targetRole: payload.targetRole,
            jobDescription: payload.jobDescription,
          }),
        });
      }
    },

    getAll: () =>
      request<{ success: boolean; analyses: AnalysisSummaryItem[] }>('/analysis'),

    getById: (id: string) =>
      request<{ success: boolean; analysis: AnalysisRecord }>(`/analysis/${id}`),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/analysis/${id}`, {
        method: 'DELETE',
      }),
  },

  profile: {
    get: () =>
      request<{ success: boolean; profile: User; stats: UserStats }>('/profile'),

    update: (payload: { name?: string; targetRole?: string }) =>
      request<{ success: boolean; profile: User }>('/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),

    deleteAccount: () =>
      request<{ success: boolean; message: string }>('/profile', {
        method: 'DELETE',
      }),
  },
};

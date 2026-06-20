const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (name: string, email: string, password: string) =>
      request<{ user: User; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
  },
  users: {
    me: () => request<User>('/users/me'),
    update: (data: Partial<User>) =>
      request<User>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
    get: (id: string) => request<User>(`/users/${id}`),
  },
  clubs: {
    list: () => request<Club[]>('/clubs'),
    get: (id: string) => request<Club>(`/clubs/${id}`),
    create: (data: Partial<Club>) =>
      request<Club>('/clubs', { method: 'POST', body: JSON.stringify(data) }),
    join: (id: string) => request(`/clubs/${id}/join`, { method: 'POST' }),
    leave: (id: string) => request(`/clubs/${id}/leave`, { method: 'DELETE' }),
    members: (id: string) => request<User[]>(`/clubs/${id}/members`),
    posts: (id: string) => request<Post[]>(`/clubs/${id}/posts`),
    post: (id: string, content: string) =>
      request<Post>(`/clubs/${id}/posts`, { method: 'POST', body: JSON.stringify({ content }) }),
  },
  messages: {
    clubMessages: (clubId: string) => request<Message[]>(`/messages/club/${clubId}`),
    sendClub: (clubId: string, content: string) =>
      request<Message>(`/messages/club/${clubId}`, { method: 'POST', body: JSON.stringify({ content }) }),
    dmList: () => request<DMConversation[]>('/messages/dm-list'),
    dm: (userId: string) => request<Message[]>(`/messages/dm/${userId}`),
    sendDm: (userId: string, content: string) =>
      request<Message>(`/messages/dm/${userId}`, { method: 'POST', body: JSON.stringify({ content }) }),
  },
  runs: {
    start: (data?: { club_id?: string; title?: string }) =>
      request<Run>('/runs/start', { method: 'POST', body: JSON.stringify(data || {}) }),
    end: (id: string, data: { distance: number; duration: number; route: RoutePoint[] }) =>
      request<Run>(`/runs/${id}/end`, { method: 'PATCH', body: JSON.stringify(data) }),
    my: () => request<Run[]>('/runs/my'),
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  total_distance: number;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  location?: string;
  owner_id: string;
  owner_name?: string;
  member_count: number;
  is_private: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name?: string;
  club_id?: string;
  dm_user_id?: string;
  content: string;
  created_at: string;
}

export interface DMConversation {
  other_user: string;
  other_name: string;
  last_message: string;
  last_at: string;
}

export interface Post {
  id: string;
  club_id: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
}

export interface Run {
  id: string;
  user_id: string;
  title: string;
  distance?: number;
  duration?: number;
  pace?: number;
  started_at: string;
  ended_at?: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  created_at: string;
  user_metadata?: {
    name?: string;
    [key: string]: any;
  };
}

export interface Post {
  id: string;
  userId: string;
  roomId: string;
  topicId: string;
  title?: string;
  content: string;
  created_at: string;
  author?: User;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  created_at: string;
  topics_count?: number;
  posts_count?: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  roomId?: string;
  created_at: string;
  posts_count?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at?: string;
  topics_count?: number;
  posts_count?: number;
}

export interface Message {
  id: string;
  content: string;
  user_id?: string;
  room_id?: string;
  created_at?: string;
  author?: User;
}

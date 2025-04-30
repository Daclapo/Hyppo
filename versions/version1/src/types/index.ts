export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface Post {
  id: string;
  userId: string;
  roomId: string;
  topicId: string;
  content: string;
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  created_at: string;
}
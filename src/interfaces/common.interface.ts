export interface UserProfile {
    id: number;
    name: string;
    email: string;
    follower_count: number;
    following_count: number;
}

export interface User {
  id: number;
  name: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
};

export interface Murmur {
  id: number;
  text: string;
  likes_count: number;
  is_liked: boolean;
  user: User;
  created_at: string;
};
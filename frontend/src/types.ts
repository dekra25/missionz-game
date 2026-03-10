export type User = {
  id: number;
  email: string;
  full_name: string;
  provider: string;
  role: string;
};

export type PlayerProfile = {
  id: number;
  user_id: number;
  nickname: string;
  age_group: '5-8' | '9-12' | '13-17' | '18-22';
  parent_email: string | null;
  parent_email_verified: boolean;
  xp: number;
  coins: number;
  level: number;
  stage: string;
  streak_days: number;
};

export type Mission = {
  id: number;
  title: string;
  description: string;
  age_group: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  coins_reward: number;
  status: 'available' | 'active' | 'completed';
};

export type Stats = {
  nickname: string;
  age_group: string;
  xp: number;
  coins: number;
  level: number;
  stage: string;
  completed_missions: number;
  streak_days: number;
};

export type LeaderboardRow = {
  rank: number;
  player_id: number;
  nickname: string;
  xp: number;
  level: number;
  stage: string;
};

export type ParentRow = {
  player_id: number;
  nickname: string;
  age_group: string;
  xp: number;
  coins: number;
  level: number;
  stage: string;
  completed_missions: number;
};

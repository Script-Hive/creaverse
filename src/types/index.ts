// Common types for Creaverse DAO

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  reputation: number;
  level: number;
  points: number;
  badges: Badge[];
  walletAddress?: string;
  createdAt: Date;
  bio?: string;
}

export type UserRole = "member" | "creator" | "contributor" | "moderator" | "admin";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: Date;
}

// DAO Governance Types
export interface Proposal {
  id: string;
  title: string;
  description: string;
  author: User;
  category: ProposalCategory;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorum: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  discussionCount: number;
  executionDetails?: string;
}

export type ProposalCategory = 
  | "treasury" 
  | "governance" 
  | "community" 
  | "development" 
  | "partnership" 
  | "other";

export type ProposalStatus = 
  | "draft" 
  | "active" 
  | "passed" 
  | "rejected" 
  | "executed" 
  | "cancelled";

export interface Vote {
  id: string;
  proposalId: string;
  voter: User;
  choice: "for" | "against" | "abstain";
  weight: number;
  reason?: string;
  timestamp: Date;
}

// AI Tools Types
export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  toolType: AIToolType;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export type AIToolType = 
  | "text-generator" 
  | "prompt-assistant" 
  | "project-copilot" 
  | "image-prompt";

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  owner: User;
  contributors: User[];
  status: ProjectStatus;
  category: string;
  tasks: ProjectTask[];
  createdAt: Date;
  updatedAt: Date;
  coverImage?: string;
  tags: string[];
}

export type ProjectStatus = "planning" | "in-progress" | "review" | "completed" | "archived";

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  assignee?: User;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
}

// Community Types
export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  replies: Reply[];
  likes: number;
  views: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  likes: number;
  createdAt: Date;
}

// Rewards Types
export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  contributions: number;
  streak: number;
}

export interface RewardActivity {
  id: string;
  userId: string;
  type: RewardActivityType;
  points: number;
  description: string;
  timestamp: Date;
}

export type RewardActivityType = 
  | "proposal_created" 
  | "vote_cast" 
  | "discussion_started" 
  | "reply_posted" 
  | "project_completed" 
  | "badge_earned"
  | "daily_login"
  | "content_created";

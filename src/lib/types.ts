export type UserRole = "admin" | "manager" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImg?: string;
  createdAt: Date;
}

export type IndustryTag = "Fashion" | "Bags" | "Shoes" | "Beauty";
export type ProcessTag = "Planning" | "Design" | "Production" | "Commerce";

export interface AppCard {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  detailDescription?: string;
  link: string;
  industryTags: IndustryTag[];
  processTags: ProcessTag[];
  createdBy: string;
  createdAt: Date;
  hasGeminiDemo?: boolean;
}

export type BoardType = "notice" | "forum" | "job" | "article";

export interface BoardPost {
  id: string;
  type: BoardType;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isPinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

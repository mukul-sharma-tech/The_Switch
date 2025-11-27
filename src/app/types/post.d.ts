
type Author = string;
type Comment = string;

export interface Post {
  _id: string;
  text: string;
  photo?: string;
  video?: string;
  createdAt: string;
  author: Author;
  likes: string[];
  savedBy: string[];
  comments: Comment[];
  topics?: string[]; // add optional fields
  tags?: string[];
  gender? : string;
}

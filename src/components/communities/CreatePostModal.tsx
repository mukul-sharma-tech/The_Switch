'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreatePostForm } from '@/components/posts/CreatePostForm';

interface Post {
  _id: string;
  author?: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  text: string;
  photo?: string;
  video?: string;
  topics: string[];
  tags: string[];
  likes: string[];
  comments: unknown[];
  savedBy: string[];
  createdAt: string;
  space?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  communitySlug?: string;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
  communitySlug,
}: CreatePostModalProps) {
  const handlePostCreated = (post: {
    _id: string;
    text: string;
    photo?: string;
    video?: string;
    topics: string[];
    tags: string[];
    space: string;
    author: { _id: string; name: string; username: string; profileImage?: string; };
    createdAt: string;
  }) => {
    // Cast to full Post type since API returns complete post object
    onPostCreated(post as Post);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CreatePostForm
            onPostCreated={handlePostCreated}
            communitySlug={communitySlug}
            hideSpaceSelector={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}


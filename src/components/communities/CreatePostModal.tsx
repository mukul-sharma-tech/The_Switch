'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreatePostForm } from '@/components/posts/CreatePostForm';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
  communitySlug?: string;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
  communitySlug,
}: CreatePostModalProps) {
  const handlePostCreated = (post: any) => {
    onPostCreated(post);
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


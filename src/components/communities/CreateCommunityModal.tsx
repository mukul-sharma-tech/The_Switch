'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (community: any) => void;
}

export function CreateCommunityModal({
  isOpen,
  onClose,
  onCommunityCreated,
}: CreateCommunityModalProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    interests: '',
    isPublic: true,
    allowMemberPosts: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('You must be logged in to create a community');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Community name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const interestsArray = formData.interests
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          interests: interestsArray,
          isPublic: formData.isPublic,
          allowMemberPosts: formData.allowMemberPosts,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create community');
      }

      const newCommunity = await res.json();
      toast.success('Community created successfully!');
      onCommunityCreated(newCommunity);
      setFormData({
        name: '',
        description: '',
        category: 'general',
        interests: '',
        isPublic: true,
        allowMemberPosts: true,
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create community');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Community</DialogTitle>
          <DialogDescription>
            Create a new community feed where people can join and share content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Tech Enthusiasts, My Company"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this community about?"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              disabled={isSubmitting}
            >
              <option value="general">General</option>
              <option value="creator">Creator</option>
              <option value="organization">Organization</option>
              <option value="company">Company</option>
              <option value="school">School</option>
              <option value="college">College</option>
            </select>
          </div>

          <div>
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="e.g., coding, design, music"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic" className="cursor-pointer">
              Public Community
            </Label>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allowMemberPosts" className="cursor-pointer">
              Allow Members to Post
            </Label>
            <Switch
              id="allowMemberPosts"
              checked={formData.allowMemberPosts}
              onCheckedChange={(checked) => setFormData({ ...formData, allowMemberPosts: checked })}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Community'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


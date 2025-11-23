'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Users, UserPlus, UserMinus, Settings, Plus, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CreatePostModal } from '@/components/communities/CreatePostModal';
import { PostDetailModal } from '@/components/posts/PostDetailModal';
import Image from 'next/image';

interface Community {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  interests?: string[];
  isPublic?: boolean;
  allowMemberPosts?: boolean;
  memberCount?: number;
  postCount?: number;
  coverImage?: string;
  icon?: string;
  creator?: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  members?: Array<{
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  }>;
}

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
  comments: any[];
  savedBy: string[];
  createdAt: string;
  space?: string;
}

export default function CommunityPage() {
  const params = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchCommunity();
      fetchPosts();
    }
  }, [params.slug, session]);

  const fetchCommunity = async () => {
    try {
      const res = await fetch(`/api/communities/${params.slug}`);
      if (res.ok) {
        const data = await res.json();
        setCommunity(data);
        setIsMember(
          data.members?.some((m: any) => m._id === session?.user?.id) || false
        );
        setIsCreator(data.creator?._id === session?.user?.id);
      } else {
        toast.error('Community not found');
      }
    } catch (error) {
      toast.error('Failed to load community');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/communities/${params.slug}/posts`);
      if (res.ok) {
        const data = await res.json();
        console.log(`Fetched ${data.length} posts for community ${params.slug}`);
        setPosts(data);
      } else {
        const errorData = await res.json();
        console.error('Error fetching posts:', errorData);
        toast.error('Failed to load posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const handleJoin = async () => {
    if (!session) {
      toast.error('Please log in to join communities');
      return;
    }

    setIsJoining(true);
    try {
      const res = await fetch(`/api/communities/${params.slug}/join`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Joined community successfully!');
        fetchCommunity();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to join community');
      }
    } catch (error) {
      toast.error('Failed to join community');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!session) return;

    setIsJoining(true);
    try {
      const res = await fetch(`/api/communities/${params.slug}/leave`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Left community successfully');
        fetchCommunity();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to leave community');
      }
    } catch (error) {
      toast.error('Failed to leave community');
    } finally {
      setIsJoining(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    if (community) {
      setCommunity({ ...community, postCount: (community.postCount || 0) + 1 });
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const openPostModal = (index: number) => {
    setSelectedPostIndex(index);
    setIsModalOpen(true);
  };

  const handleLike = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (!session?.user?.id) {
      toast.error('Please log in to like posts');
      return;
    }

    const isLiked = post.likes.includes(session.user.id);
    const updatedPost = { ...post, likes: isLiked ? post.likes.filter(id => id !== session.user.id) : [...post.likes, session.user.id] };

    handlePostUpdate(updatedPost);

    try {
      const res = await fetch(`/api/posts/${post._id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Server failed to process like.');
    } catch {
      handlePostUpdate(post);
      toast.error('Failed to update like.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Community not found
      </div>
    );
  }

  const canPost = isCreator || (isMember && community.allowMemberPosts);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Community Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {community.coverImage && (
              <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                <Image
                  src={community.coverImage}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{community.name}</h1>
                  {community.description && (
                    <p className="text-muted-foreground mt-2">{community.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {community.category && (
                      <Badge variant="secondary">{community.category}</Badge>
                    )}
                    {community.interests?.map((interest, i) => (
                      <Badge key={i} variant="outline">#{interest}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.memberCount || 0} members
                    </span>
                    <span>{community.postCount || 0} posts</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isCreator && (
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  )}
                  {isMember ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLeave}
                      disabled={isJoining || isCreator}
                    >
                      {isJoining ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <UserMinus className="w-4 h-4 mr-2" />
                      )}
                      Leave
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleJoin}
                      disabled={isJoining}
                    >
                      {isJoining ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4 mr-2" />
                      )}
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Button */}
      {canPost && (
        <div className="flex justify-end">
          <Button onClick={() => setIsCreatePostModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No posts yet. {canPost ? 'Be the first to post!' : 'Join to see posts.'}
            </CardContent>
          </Card>
        ) : (
          posts.map((post, index) => (
            <Card
              key={post._id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => openPostModal(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={post.author?.profileImage} />
                    <AvatarFallback>
                      {post.author?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author?.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {post.text && <p className="mb-3">{post.text}</p>}
                {post.photo && (
                  <Image
                    src={post.photo}
                    alt="Post"
                    width={800}
                    height={600}
                    className="rounded-lg mb-3 max-h-[60vh] w-full object-contain"
                  />
                )}
                {post.video && (
                  <video
                    src={post.video}
                    className="rounded-lg mb-3 max-h-[60vh] w-full"
                    controls
                  />
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary">#{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-muted-foreground border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 hover:text-destructive"
                    onClick={(e) => handleLike(e, post)}
                    disabled={!session}
                  >
                    <Heart
                      size={16}
                      className={
                        session?.user?.id && post.likes.includes(session.user.id)
                          ? 'text-destructive fill-current'
                          : ''
                      }
                    />
                    {post.likes.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPostModal(index);
                    }}
                  >
                    <MessageCircle size={16} />
                    {post.comments?.length || 0}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      {canPost && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onPostCreated={handlePostCreated}
          communitySlug={params.slug}
        />
      )}

      {/* Post Detail Modal */}
      {posts.length > 0 && (
        <PostDetailModal
          posts={posts.map(post => ({
            ...post,
            topics: post.topics || [],
            tags: post.tags || [],
          }))}
          startIndex={selectedPostIndex}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostUpdate={handlePostUpdate}
        />
      )}
    </div>
  );
}


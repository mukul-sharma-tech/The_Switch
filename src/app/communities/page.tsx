'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Users, Search, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreateCommunityModal } from '@/components/communities/CreateCommunityModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Community {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  interests?: string[];
  isPublic?: boolean;
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
}

export default function CommunitiesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joiningIds, setJoiningIds] = useState<Set<string>>(new Set());

  const categories = ['all', 'general', 'creator', 'organization', 'company', 'school', 'college'];

  useEffect(() => {
    fetchAllCommunities();
    if (session) {
      fetchJoinedCommunities();
    }
  }, [session]);

  const fetchAllCommunities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/communities');
      if (res.ok) {
        const data = await res.json();
        // Filter to show only public communities
        const publicCommunities = data.filter((c: Community) => c.isPublic !== false);
        setCommunities(publicCommunities);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJoinedCommunities = async () => {
    try {
      const res = await fetch('/api/communities/user/joined');
      if (res.ok) {
        const data = await res.json();
        setJoinedCommunities(data);
      }
    } catch (error) {
      console.error('Error fetching joined communities:', error);
    }
  };

  const handleJoin = async (community: Community) => {
    if (!session) {
      toast.error('Please log in to join communities');
      return;
    }

    setJoiningIds(prev => new Set(prev).add(community._id));
    try {
      const res = await fetch(`/api/communities/${community.slug}/join`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success(`Joined ${community.name}!`);
        fetchJoinedCommunities();
        // Update the community in the list
        setCommunities(prev => prev.map(c => 
          c._id === community._id 
            ? { ...c, memberCount: (c.memberCount || 0) + 1 }
            : c
        ));
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to join community');
      }
    } catch {
      toast.error('Failed to join community');
    } finally {
      setJoiningIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(community._id);
        return newSet;
      });
    }
  };

  const handleCommunityCreated = (newCommunity: Community) => {
    setCommunities(prev => [newCommunity, ...prev]);
    if (session) {
      fetchJoinedCommunities();
    }
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = !searchQuery || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.interests?.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const isJoined = (communityId: string) => {
    return joinedCommunities.some(c => c._id === communityId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground mt-1">
            Discover and join communities based on your interests
          </p>
        </div>
        {session && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Community
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search communities by name, description, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="discover" className="w-full">
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          {session && (
            <TabsTrigger value="joined">
              My Communities ({joinedCommunities.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          {filteredCommunities.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {searchQuery || selectedCategory !== 'all'
                  ? 'No communities found matching your search.'
                  : 'No public communities available yet.'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities.map((community) => {
                const joined = isJoined(community._id);
                const isJoining = joiningIds.has(community._id);
                
                return (
                  <Card
                    key={community._id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => router.push(`/communities/${community.slug}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {community.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={community.icon}
                              alt={community.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">
                              {community.name}
                            </CardTitle>
                            {community.category && (
                              <Badge variant="secondary" className="mt-1 capitalize">
                                {community.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {community.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {community.description}
                        </p>
                      )}
                      {community.interests && community.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {community.interests.slice(0, 3).map((interest, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              #{interest}
                            </Badge>
                          ))}
                          {community.interests.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{community.interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {community.memberCount || 0} members
                        </span>
                        <span>{community.postCount || 0} posts</span>
                      </div>
                      {session && (
                        <Button
                          variant={joined ? 'outline' : 'default'}
                          size="sm"
                          className="w-full mt-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!joined) {
                              handleJoin(community);
                            } else {
                              router.push(`/communities/${community.slug}`);
                            }
                          }}
                          disabled={isJoining}
                        >
                          {isJoining ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Joining...
                            </>
                          ) : joined ? (
                            'View Community'
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Join
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {session && (
          <TabsContent value="joined" className="space-y-4">
            {joinedCommunities.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  You haven&apos;t joined any communities yet. Discover communities above!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedCommunities.map((community) => (
                  <Card
                    key={community._id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => router.push(`/communities/${community.slug}`)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {community.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={community.icon}
                            alt={community.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {community.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {community.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {community.memberCount || 0} members
                        </span>
                        <span>{community.postCount || 0} posts</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/communities/${community.slug}`);
                        }}
                      >
                        View Community
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Create Community Modal */}
      {session && (
        <CreateCommunityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCommunityCreated={handleCommunityCreated}
        />
      )}
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateCommunityModal } from './CreateCommunityModal';

interface Community {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  memberCount?: number;
  icon?: string;
  creator?: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
}

export function CommunitiesSidebar() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await fetch('/api/communities/user/joined');
        if (res.ok) {
          const data = await res.json();
          setCommunities(data);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleCommunityCreated = (newCommunity: Community) => {
    setCommunities(prev => [newCommunity, ...prev]);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Communities
          </h3>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            title="Create Community"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : communities.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            No communities yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-1">
            {communities.map((community) => {
              const isActive = pathname === `/communities/${community.slug}`;
              return (
                <Link
                  key={community._id}
                  href={`/communities/${community.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {community.icon ? (
                    <img
                      src={community.icon}
                      alt={community.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-5 h-5" />
                  )}
                  <span className="truncate flex-1">{community.name}</span>
                  {community.memberCount !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {community.memberCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCommunityCreated={handleCommunityCreated}
      />
    </>
  );
}


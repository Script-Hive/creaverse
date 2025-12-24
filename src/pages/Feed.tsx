import { AppLayout } from "@/components/layout";
import { PostCard } from "@/components/post";
import { MediaPostCard } from "@/components/media/MediaPostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { usePosts } from "@/hooks/usePosts";
import { MessageCircle, RefreshCw, Loader2, AlertCircle, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { useUnreadMessageCount } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Post } from "@/types";

export default function Feed() {
  const { user } = useAuth();
  const { data: unreadCount = 0 } = useUnreadMessageCount();
  
  // Use only real posts from database
  const { data: posts, isLoading, error, refetch, isFetching } = usePosts();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'instagram' | 'list'>('instagram');
  
  // Cache for previously loaded posts to show during background loading
  const [cachedPosts, setCachedPosts] = useState<Post[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasPreviousData = useRef(false);

  // Debug logging
  console.log("🔍 Feed Debug:", {
    user: user?.id,
    postsCount: posts?.length,
    isLoading,
    error: error?.message,
    isFetching
  });

  // Update cached posts when new data arrives
  useEffect(() => {
    if (posts && posts.length > 0) {
      setCachedPosts(posts);
      hasPreviousData.current = true;
      
      // Mark initial load as complete once we have data
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [posts, isInitialLoad]);

  // Use real posts or cached posts during loading
  const postsToDisplay = (() => {
    // Use current posts if available
    if (posts && posts.length > 0) {
      return posts;
    }
    
    // If we're loading and have cached posts, show cached posts
    if (isLoading && cachedPosts.length > 0) {
      return cachedPosts;
    }
    
    // Otherwise return null/empty
    return null;
  })();

  // Determine loading state for UI
  const showInitialLoader = isInitialLoad && isLoading && !hasPreviousData.current;
  const showBackgroundLoader = !isInitialLoad && (isFetching || isRefreshing) && hasPreviousData.current;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AppLayout>
      <div className="lg:py-6">
        {/* Messages Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {user ? "Your Feed" : "Discover Creative Content"}
            </h2>
            {postsToDisplay && postsToDisplay.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {postsToDisplay.length} posts
              </Badge>
            )}
            <Badge variant="success" className="text-xs">
              Live
            </Badge>
            {/* Background loading indicator */}
            {showBackgroundLoader && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Updating...
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={cn(
                "w-4 h-4",
                isRefreshing && "animate-spin"
              )} />
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </Button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'instagram' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('instagram')}
                className="h-8 px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {user ? (
              <Link to="/messages">
                <Button variant="outline" size="sm" className="relative gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Messages</span>
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 min-w-[20px] flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="gap-2">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Initial Loading State - only show when no cached data */}
        {showInitialLoader && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading your feed...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !postsToDisplay?.length && !showInitialLoader && (
          <Card className="m-4 border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
              <h3 className="font-semibold text-destructive mb-2">
                {user ? "Failed to load feed" : "Unable to load content"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user 
                  ? (error instanceof Error ? error.message : "Something went wrong")
                  : "We're having trouble loading the public feed. This might be a temporary issue."
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                {!user && (
                  <Link to="/auth">
                    <Button size="sm">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State - only show when no posts and not loading */}
        {!showInitialLoader && !error && (!postsToDisplay || postsToDisplay.length === 0) && (
          <Card className="m-4">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">
                {user ? "No posts yet" : "Welcome to Creaverse"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user 
                  ? "Be the first to share something amazing with the community!"
                  : "Discover amazing creative content from our community. Sign in to create and share your own posts!"
                }
              </p>
              {user ? (
                <Link to="/create">
                  <Button>Create Your First Post</Button>
                </Link>
              ) : (
                <div className="flex gap-2 justify-center">
                  <Link to="/auth">
                    <Button>Sign In</Button>
                  </Link>
                  <Link to="/create">
                    <Button variant="outline">Browse as Guest</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Feed - show posts even during background loading */}
        {!showInitialLoader && postsToDisplay && postsToDisplay.length > 0 && (
          <>
            {/* Subtle background refresh indicator */}
            {showBackgroundLoader && (
              <div className="bg-primary/5 border-b border-primary/10 p-2 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-primary/80">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating feed in background...</span>
                </div>
              </div>
            )}
            
            {/* Posts */}
            <div className={cn(
              viewMode === 'instagram' 
                ? "space-y-6 max-w-lg mx-auto" 
                : "divide-y divide-border",
              // Add subtle opacity during background loading to indicate refresh
              showBackgroundLoader && "opacity-95 transition-opacity duration-300"
            )}>
              {postsToDisplay.map((post) => (
                viewMode === 'instagram' ? (
                  <MediaPostCard 
                    key={post.id} 
                    post={post} 
                    autoPlay={true}
                    showFullControls={true}
                  />
                ) : (
                  <PostCard key={post.id} post={post} />
                )
              ))}
            </div>

            {/* Footer info */}
            <div className="p-4 text-center text-xs text-muted-foreground border-t border-border">
              <div className="flex items-center justify-center gap-2">
                <span>{postsToDisplay.length} posts loaded</span>
                <Badge variant="success" className="text-[10px] px-1.5 py-0.5">Live data</Badge>
                {showBackgroundLoader && (
                  <>
                    <span>•</span>
                    <span className="text-primary/80">Refreshing...</span>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

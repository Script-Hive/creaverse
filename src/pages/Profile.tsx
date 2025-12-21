import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, mockPosts, currentUser } from "@/data/mockData";
import { 
  Settings, 
  Grid3X3, 
  Bookmark, 
  Star,
  BadgeCheck,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Coins,
  Trophy,
  Edit
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCategoryGradient } from "@/data/categories";

export default function Profile() {
  const { username } = useParams();
  
  // Find user or use current user
  const user = username 
    ? mockUsers.find(u => u.username === username) || mockUsers[0]
    : currentUser;
  
  const userPosts = mockPosts.filter(p => p.author.id === user.id);
  const isOwnProfile = !username || username === currentUser.username;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <AppLayout>
      <div className="lg:py-6">
        {/* Profile Header */}
        <div className="p-4 lg:p-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            {/* Avatar */}
            <div className={cn(
              "w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center text-3xl md:text-5xl font-bold flex-shrink-0 mx-auto md:mx-0",
              "bg-gradient-to-br",
              getCategoryGradient(user.categories?.[0] || "art")
            )}>
              {user.displayName.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {/* Username & Actions */}
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{user.username}</h1>
                  {user.isVerified && (
                    <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />
                  )}
                  <Badge variant={user.role === "creator" ? "glow" : "secondary"} className="capitalize">
                    {user.role}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Profile
                      </Button>
                      <Link to="/settings">
                        <Button variant="ghost" size="icon-sm">
                          <Settings className="w-5 h-5" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button variant="glow" size="sm">Follow</Button>
                      <Button variant="outline" size="sm">Message</Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <p className="font-bold">{userPosts.length}</p>
                  <p className="text-xs text-muted-foreground">posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{formatNumber(user.followers)}</p>
                  <p className="text-xs text-muted-foreground">followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{formatNumber(user.following)}</p>
                  <p className="text-xs text-muted-foreground">following</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <p className="font-semibold">{user.displayName}</p>
                {user.bio && <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>}
              </div>

              {/* Token Stats */}
              <div className="flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl bg-muted/50 w-fit mx-auto md:mx-0">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">{formatNumber(user.tokensEarned)}</span>
                  <span className="text-xs text-muted-foreground">earned</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-warning" />
                  <span className="text-sm font-semibold">{user.reputation}</span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {user.categories && user.categories.length > 0 && (
          <div className="px-4 pb-4 flex items-center gap-2 justify-center md:justify-start">
            {user.categories.map((cat) => (
              <Link key={cat} to={`/category/${cat}`}>
                <Badge variant="outline" className="capitalize">
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-center border-b border-border rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="posts" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3"
            >
              <Grid3X3 className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3"
            >
              <Star className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3"
            >
              <Bookmark className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-0.5">
                {userPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="relative aspect-square overflow-hidden group"
                  >
                    <img 
                      src={post.mediaUrl} 
                      alt=""
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Grid3X3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-1">No Posts Yet</h3>
                <p className="text-sm text-muted-foreground">When you create posts, they will appear here.</p>
                {isOwnProfile && (
                  <Link to="/create">
                    <Button variant="glow" className="mt-4">Create First Post</Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <div className="py-16 text-center">
              <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No Reviews Yet</h3>
              <p className="text-sm text-muted-foreground">Reviews you write will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="py-16 text-center">
              <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No Saved Posts</h3>
              <p className="text-sm text-muted-foreground">Save posts to view them later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

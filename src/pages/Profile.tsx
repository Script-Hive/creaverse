import { AppLayout } from "@/components/layout";
import { 
  ProfileHeader, 
  StoryHighlights, 
  ProfileTabs, 
  WalletSection 
} from "@/components/profile";
import { Badge } from "@/components/ui/badge";
import { mockUsers, mockPosts, currentUser } from "@/data/mockData";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { username } = useParams();
  
  // Find user or use current user
  const user = username 
    ? mockUsers.find(u => u.username === username) || mockUsers[0]
    : currentUser;
  
  const userPosts = mockPosts.filter(p => p.author.id === user.id);
  const isOwnProfile = !username || username === currentUser.username;

  const handleFollow = () => {
    toast.success(`You are now following ${user.displayName}`);
  };

  const handleMessage = () => {
    toast.info("Messaging coming soon!");
  };

  const handleAddHighlight = () => {
    toast.info("Add highlight feature coming soon!");
  };

  return (
    <AppLayout>
      <div className="lg:py-4">
        {/* Profile Header */}
        <ProfileHeader 
          user={user}
          isOwnProfile={isOwnProfile}
          onFollow={handleFollow}
          onMessage={handleMessage}
        />

        {/* Categories */}
        {user.categories && user.categories.length > 0 && (
          <div className="px-4 pb-2 flex items-center gap-2 justify-center md:justify-start flex-wrap">
            {user.categories.map((cat) => (
              <Link key={cat} to={`/category/${cat}`}>
                <Badge 
                  variant="outline" 
                  className="capitalize hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Story Highlights */}
        <StoryHighlights 
          highlights={[]} 
          isOwnProfile={isOwnProfile}
          onAddHighlight={handleAddHighlight}
        />

        {/* Wallet Section (show for own profile or verified creators) */}
        {(isOwnProfile || user.isVerified) && (
          <WalletSection user={user} isOwnProfile={isOwnProfile} />
        )}

        {/* Tabbed Content */}
        <ProfileTabs 
          posts={userPosts.length > 0 ? userPosts : mockPosts.slice(0, 6)} 
          isOwnProfile={isOwnProfile}
        />
      </div>
    </AppLayout>
  );
}

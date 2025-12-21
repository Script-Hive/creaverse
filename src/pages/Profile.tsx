import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { 
  ProfileHeader, 
  StoryHighlights, 
  ProfileTabs, 
  WalletSection,
  EditProfileModal 
} from "@/components/profile";
import { Badge } from "@/components/ui/badge";
import { mockUsers, mockPosts, currentUser } from "@/data/mockData";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useUserCreatorType, useUpdateUserSubcategories } from "@/hooks/useCategories";

export default function Profile() {
  const { username } = useParams();
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  // Find user or use current user
  const user = username 
    ? mockUsers.find(u => u.username === username) || mockUsers[0]
    : currentUser;
  
  const userPosts = mockPosts.filter(p => p.author.id === user.id);
  const isOwnProfile = !username || username === currentUser.username;

  // Fetch user's creator type from database
  const { creatorTypeDisplay, subcategories, isLoading: creatorTypeLoading } = useUserCreatorType(user.id);
  const updateSubcategories = useUpdateUserSubcategories();

  // Get primary subcategory's category name
  const primarySubcategory = subcategories?.find(us => us.is_primary) || subcategories?.[0];
  const categoryName = primarySubcategory?.subcategory?.category?.name;

  const handleFollow = () => {
    toast.success(`You are now following ${user.displayName}`);
  };

  const handleMessage = () => {
    toast.info("Messaging coming soon!");
  };

  const handleAddHighlight = () => {
    toast.info("Add highlight feature coming soon!");
  };

  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (data: any) => {
    try {
      // Update user subcategories if changed
      if (data.subcategoryIds?.length > 0) {
        await updateSubcategories.mutateAsync({
          userId: user.id,
          subcategoryIds: data.subcategoryIds,
          primarySubcategoryId: data.primarySubcategoryId,
        });
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <AppLayout>
      <div className="lg:py-4">
        {/* Profile Header */}
        <ProfileHeader 
          user={user}
          isOwnProfile={isOwnProfile}
          creatorTypeDisplay={creatorTypeDisplay}
          categoryName={categoryName}
          onFollow={handleFollow}
          onMessage={handleMessage}
          onEditProfile={handleEditProfile}
        />

        {/* Categories - show database subcategories if available */}
        {subcategories && subcategories.length > 0 ? (
          <div className="px-4 pb-2 flex items-center gap-2 justify-center md:justify-start flex-wrap">
            {subcategories.map((us) => (
              <Link key={us.id} to={`/category/${us.subcategory?.category?.name?.toLowerCase()}`}>
                <Badge 
                  variant={us.is_primary ? "default" : "outline"}
                  className="capitalize hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {us.subcategory?.name}
                </Badge>
              </Link>
            ))}
          </div>
        ) : user.categories && user.categories.length > 0 && (
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

        {/* Edit Profile Modal */}
        {isOwnProfile && (
          <EditProfileModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            user={user}
            onSave={handleSaveProfile}
          />
        )}
      </div>
    </AppLayout>
  );
}

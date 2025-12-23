import { AppLayout } from "@/components/layout";
import { PostCard } from "@/components/post";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockPosts } from "@/data/mockData";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUnreadMessageCount } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";

export default function Feed() {
  const { user } = useAuth();
  const { data: unreadCount = 0 } = useUnreadMessageCount();

  return (
    <AppLayout>
      <div className="lg:py-6">
        {/* Messages Header */}
        {user && (
          <div className="bg-card border-b border-border p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Feed</h2>
            <Link to="/messages">
              <Button variant="outline" size="sm" className="relative gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Messages</span>
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
          </div>
        )}

        {/* Feed */}
        <div className="divide-y divide-border">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

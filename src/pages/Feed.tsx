import { AppLayout } from "@/components/layout";
import { PostCard, StoriesBar } from "@/components/post";
import { mockPosts, mockUsers } from "@/data/mockData";

export default function Feed() {
  return (
    <AppLayout>
      <div className="lg:py-6">
        {/* Stories */}
        <StoriesBar users={mockUsers} />

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

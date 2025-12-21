import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { mockPosts, mockReviews, mockUsers } from "@/data/mockData";
import { getCategoryGradient } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Star,
  Coins,
  BadgeCheck,
  Send,
  ThumbsUp
} from "lucide-react";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === id) || mockPosts[0];
  const reviews = mockReviews.filter(r => r.postId === id);
  
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved to collection");
  };

  const handleComment = () => {
    if (comment.trim()) {
      toast.success("Comment posted!");
      setComment("");
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 p-4">
            <Link to="/feed">
              <Button variant="ghost" size="icon-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">Post</h1>
          </div>
        </div>

        {/* Post */}
        <article>
          {/* Author Header */}
          <div className="flex items-center justify-between p-4">
            <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white",
                `bg-gradient-to-br ${getCategoryGradient(post.category)}`
              )}>
                {post.author.displayName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{post.author.displayName}</span>
                  {post.author.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>@{post.author.username}</span>
                  <span>·</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {post.isTokenized && (
                <Badge variant="glow" className="text-[10px] px-2 py-0.5">
                  <Coins className="w-3 h-3 mr-1" />
                  {post.tokenReward} tokens
                </Badge>
              )}
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Media */}
          <div className="relative aspect-square bg-muted overflow-hidden">
            <img 
              src={post.mediaUrl} 
              alt={post.content.slice(0, 50)}
              className="w-full h-full object-cover"
            />
            
            {post.mediaType === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-foreground fill-foreground ml-1" />
                </div>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge 
                className={cn(
                  "bg-gradient-to-r text-white border-0 text-xs",
                  getCategoryGradient(post.category)
                )}
              >
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLike}
                className={cn(isLiked && "text-destructive")}
              >
                <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Link to={`/post/${post.id}/review`}>
                <Button variant="glow" size="sm" className="text-xs">
                  <Star className="w-4 h-4 mr-1" />
                  Write Review
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSave}
                className={cn(isSaved && "text-primary")}
              >
                <Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 pb-2 flex items-center gap-4">
            <p className="text-sm font-semibold">{formatNumber(likes)} likes</p>
            <p className="text-sm text-muted-foreground">{formatNumber(post.comments)} comments</p>
            <p className="text-sm text-muted-foreground">{formatNumber(post.reviews)} reviews</p>
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            <p className="text-sm">
              <Link to={`/profile/${post.author.username}`} className="font-semibold mr-1.5 hover:underline">
                {post.author.username}
              </Link>
              {post.content}
            </p>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map(tag => (
                  <Link key={tag} to={`/explore?tag=${tag}`}>
                    <span className="text-xs text-primary hover:underline">#{tag}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="border-t border-border">
            <div className="p-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-warning fill-warning" />
                Reviews ({reviews.length})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {reviews.map(review => (
                <div key={review.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                        {review.author.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{review.author.displayName}</span>
                        {review.author.isVerified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-primary fill-primary/20" />
                        )}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-3 h-3",
                                i < review.rating 
                                  ? "text-warning fill-warning" 
                                  : "text-muted-foreground"
                              )} 
                            />
                          ))}
                        </div>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-[10px]">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/90">{review.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="w-3 h-3" />
                          {review.likes}
                        </button>
                        <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
                        {review.tokensEarned > 0 && (
                          <Badge variant="secondary" className="text-[10px]">
                            <Coins className="w-3 h-3 mr-1" />
                            +{review.tokensEarned}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment Input */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                Y
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[40px] max-h-[120px] pr-12 resize-none"
              />
              <Button 
                variant="ghost" 
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

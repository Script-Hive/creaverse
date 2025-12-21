import { forwardRef } from "react";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Star,
  Coins,
  BadgeCheck,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryGradient } from "@/data/categories";

interface PostCardProps {
  post: Post;
}

export const PostCard = forwardRef<HTMLElement, PostCardProps>(({ post }, ref) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const contentPreview = post.content.length > 150 && !showFullContent
    ? post.content.slice(0, 150) + "..."
    : post.content;

  return (
    <article className="bg-card border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
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
      <Link to={`/post/${post.id}`}>
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img 
            src={post.mediaUrl} 
            alt={post.content.slice(0, 50)}
            className="w-full h-full object-cover"
          />
          
          {post.mediaType === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/20">
              <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
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

          {/* Review Count */}
          {post.reviews > 0 && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="glass" className="text-xs backdrop-blur-md">
                <Star className="w-3 h-3 mr-1 text-warning fill-warning" />
                {post.reviews} reviews
              </Badge>
            </div>
          )}
        </div>
      </Link>

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
            <Send className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Link to={`/post/${post.id}/review`}>
            <Button variant="outline" size="sm" className="text-xs">
              <Star className="w-4 h-4 mr-1" />
              Review
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
      <div className="px-4 pb-2">
        <p className="text-sm font-semibold">{formatNumber(likes)} likes</p>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm">
          <Link to={`/profile/${post.author.username}`} className="font-semibold mr-1.5 hover:underline">
            {post.author.username}
          </Link>
          {contentPreview}
          {post.content.length > 150 && !showFullContent && (
            <button 
              onClick={() => setShowFullContent(true)}
              className="text-muted-foreground ml-1 hover:text-foreground"
            >
              more
            </button>
          )}
        </p>
      </div>

      {/* Comments Preview */}
      {post.comments > 0 && (
        <Link to={`/post/${post.id}`} className="block px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            View all {formatNumber(post.comments)} comments
          </p>
        </Link>
      )}
    </article>
  );
});

PostCard.displayName = "PostCard";

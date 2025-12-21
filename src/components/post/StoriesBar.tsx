import { User } from "@/types";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StoriesBarProps {
  users: User[];
}

export function StoriesBar({ users }: StoriesBarProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
        {/* Your Story */}
        <Link to="/create" className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/50">
              <span className="text-2xl">+</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Your story</span>
        </Link>

        {/* User Stories */}
        {users.map((user) => (
          <Link 
            key={user.id} 
            to={`/profile/${user.username}`}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-primary">
                <div className="w-full h-full rounded-full bg-card p-0.5">
                  <div className={cn(
                    "w-full h-full rounded-full flex items-center justify-center text-sm font-bold",
                    "bg-gradient-to-br from-secondary to-accent"
                  )}>
                    {user.displayName.charAt(0)}
                  </div>
                </div>
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px]">✓</span>
                </div>
              )}
            </div>
            <span className="text-xs text-foreground truncate max-w-[64px]">
              {user.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

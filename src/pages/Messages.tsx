import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockUsers } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Edit,
  Send,
  MoreHorizontal,
  Phone,
  Video,
  Image as ImageIcon,
  Smile,
  BadgeCheck
} from "lucide-react";
import { useAutoTranslate } from "@/hooks/useTranslation";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  user: typeof mockUsers[0];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

const mockConversations: Conversation[] = mockUsers.slice(0, 5).map((user, index) => ({
  id: `conv-${index}`,
  user,
  lastMessage: [
    "Hey! Love your latest post 🔥",
    "Thanks for the review!",
    "Are you coming to the event?",
    "Let's collaborate on something",
    "Great work on the proposal!",
  ][index],
  lastMessageTime: new Date(Date.now() - index * 3600000),
  unreadCount: index === 0 ? 2 : index === 2 ? 1 : 0,
  messages: [
    {
      id: "1",
      senderId: user.id,
      content: "Hey there! 👋",
      timestamp: new Date(Date.now() - 86400000),
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      content: "Hi! How are you?",
      timestamp: new Date(Date.now() - 85000000),
      isRead: true,
    },
    {
      id: "3",
      senderId: user.id,
      content: [
        "Hey! Love your latest post 🔥",
        "Thanks for the review!",
        "Are you coming to the event?",
        "Let's collaborate on something",
        "Great work on the proposal!",
      ][index],
      timestamp: new Date(Date.now() - index * 3600000),
      isRead: index !== 0 && index !== 2,
    },
  ],
}));

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { t } = useAutoTranslate([
    "Messages",
    "Search messages",
    "Type a message...",
    "Online",
    "Your Messages",
    "Select a conversation to start messaging",
    "Hey there! 👋",
    "Hi! How are you?",
    "Hey! Love your latest post 🔥",
    "Thanks for the review!",
    "Are you coming to the event?",
    "Let's collaborate on something",
    "Great work on the proposal!"
  ]);

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    // In a real app, this would send the message
    setMessageInput("");
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] flex">
        {/* Conversations List */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card",
          selectedConversation && "hidden md:flex"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">{t("Messages")}</h1>
              <Button variant="ghost" size="icon-sm">
                <Edit className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Search messages")}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                    selectedConversation?.id === conv.id && "bg-muted"
                  )}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        {conv.user.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">{conv.user.displayName}</span>
                        {conv.user.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-primary fill-primary/20 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {timeAgo(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm truncate",
                        conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {t(conv.lastMessage)}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2 h-5 min-w-[20px] flex items-center justify-center p-0 text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className={cn(
            "flex-1 flex flex-col bg-background",
            !selectedConversation && "hidden md:flex"
          )}>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  ←
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    {selectedConversation.user.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{selectedConversation.user.displayName}</span>
                    {selectedConversation.user.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
                    )}
                  </div>
                  <p className="text-xs text-success">{t("Online")}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => {
                  const isOwn = message.senderId === "current";
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      )}>
                        <p className="text-sm">{t(message.content)}</p>
                        <p className={cn(
                          "text-[10px] mt-1",
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {timeAgo(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={t("Type a message...")}
                    className="pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button 
                  variant="glow" 
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/30">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">{t("Your Messages")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Select a conversation to start messaging")}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

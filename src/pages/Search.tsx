import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  TrendingUp,
  Users,
  FileText,
  Hash,
  X,
  Film,
  Palette,
  Code,
  BookOpen,
  Leaf,
  Music2,
  ArrowRight,
  Sparkles,
  Clock
} from "lucide-react";

// Mock data for search results
const trendingTopics = [
  { tag: "AIArt", posts: 1234 },
  { tag: "Web3Gaming", posts: 892 },
  { tag: "NFTCollectors", posts: 756 },
  { tag: "FilmMaking", posts: 634 },
  { tag: "MusicProduction", posts: 521 },
  { tag: "DigitalArt", posts: 489 },
];

const suggestedCreators = [
  { id: "1", name: "Sarah Chen", username: "sarahcreates", avatar: "", followers: 12400, category: "art" },
  { id: "2", name: "Marcus Thompson", username: "marcusmusic", avatar: "", followers: 8900, category: "music" },
  { id: "3", name: "Emma Rodriguez", username: "emmadirects", avatar: "", followers: 7200, category: "cinema" },
  { id: "4", name: "Alex Kim", username: "alextech", avatar: "", followers: 5600, category: "tech" },
];

const recentSearches = ["digital art tutorial", "web3 development", "music production", "indie films"];

const categoryConfig: Record<string, { icon: React.ElementType; gradient: string }> = {
  cinema: { icon: Film, gradient: "from-red-500 to-orange-500" },
  art: { icon: Palette, gradient: "from-purple-500 to-pink-500" },
  tech: { icon: Code, gradient: "from-blue-500 to-cyan-500" },
  books: { icon: BookOpen, gradient: "from-amber-500 to-yellow-500" },
  nature: { icon: Leaf, gradient: "from-green-500 to-emerald-500" },
  music: { icon: Music2, gradient: "from-indigo-500 to-violet-500" },
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [recentSearchList, setRecentSearchList] = useState(recentSearches);

  const clearRecentSearch = (search: string) => {
    setRecentSearchList(prev => prev.filter(s => s !== search));
  };

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-6 px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-primary" />
            Search
          </h1>
          <p className="text-muted-foreground">Discover creators, posts, and topics</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search creators, posts, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-6 text-lg rounded-xl border-2 focus:border-primary"
          />
          {hasQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>
        </Tabs>

        <AnimatePresence mode="wait">
          {!hasQuery ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Recent Searches */}
              {recentSearchList.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      Recent Searches
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRecentSearchList([])}
                      className="text-muted-foreground"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearchList.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="py-2 px-4 cursor-pointer hover:bg-primary/20 flex items-center gap-2"
                        onClick={() => setSearchQuery(search)}
                      >
                        {search}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearRecentSearch(search);
                          }}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Topics
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={topic.tag}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setSearchQuery(`#${topic.tag}`)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Hash className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">#{topic.tag}</p>
                              <p className="text-xs text-muted-foreground">
                                {topic.posts.toLocaleString()} posts
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Suggested Creators */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Suggested Creators
                </h2>
                <div className="space-y-3">
                  {suggestedCreators.map((creator, index) => {
                    const config = categoryConfig[creator.category] || categoryConfig.art;
                    const Icon = config.icon;
                    
                    return (
                      <motion.div
                        key={creator.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link to={`/profile/${creator.username}`}>
                          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 border-2 border-border">
                                  <AvatarImage src={creator.avatar} />
                                  <AvatarFallback className={`bg-gradient-to-br ${config.gradient} text-white`}>
                                    {creator.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{creator.name}</p>
                                    <Badge variant="outline" className="text-xs">
                                      <Icon className="w-3 h-3 mr-1" />
                                      {creator.category}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">@{creator.username}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{(creator.followers / 1000).toFixed(1)}K</p>
                                <p className="text-xs text-muted-foreground">followers</p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Browse Categories */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Browse Categories
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(categoryConfig).map(([category, config], index) => {
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link to={`/category/${category}`}>
                          <Card className="cursor-pointer hover:scale-105 transition-transform overflow-hidden group">
                            <CardContent className={`p-4 bg-gradient-to-br ${config.gradient} text-white`}>
                              <Icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                              <p className="font-medium capitalize">{category}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <SearchIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Searching for "{searchQuery}"</h3>
              <p className="text-muted-foreground">
                Search functionality will display results from the database here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
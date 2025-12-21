import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Upload,
  Coins,
  Users,
  X,
  Clapperboard,
  Palette,
  Code,
  BookOpen,
  Leaf,
  Music2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";
import { ContentCategory } from "@/types";
import { toast } from "sonner";

const mediaTypes = [
  { id: "image", label: "Image", icon: Image, accept: "image/*" },
  { id: "video", label: "Video", icon: Video, accept: "video/*" },
  { id: "audio", label: "Audio", icon: Music, accept: "audio/*" },
  { id: "document", label: "Document", icon: FileText, accept: ".pdf,.doc,.docx" },
];

const categoryIcons: Record<ContentCategory, React.ComponentType<{ className?: string }>> = {
  cinema: Clapperboard,
  art: Palette,
  tech: Code,
  books: BookOpen,
  nature: Leaf,
  music: Music2,
};

export default function Create() {
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string>("image");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isTokenized, setIsTokenized] = useState(false);
  const [tokenReward, setTokenReward] = useState(100);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!content.trim()) {
      toast.error("Please add a description");
      return;
    }
    if (!previewUrl) {
      toast.error("Please upload media");
      return;
    }
    
    toast.success("Post created successfully!", {
      description: "Your content is now live on Creaverse"
    });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create New Post</h1>
          <p className="text-muted-foreground">Share your creative work with the community</p>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Select Category</Label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    `bg-gradient-to-br ${cat.gradient}`
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Type Selection */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Media Type</Label>
          <div className="flex gap-2">
            {mediaTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedMediaType(type.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  selectedMediaType === type.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                <type.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload */}
        <Card variant="glass" className="mb-6">
          <CardContent className="p-6">
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  onClick={() => setPreviewUrl(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <span className="text-lg font-medium mb-1">Upload Media</span>
                <span className="text-sm text-muted-foreground">
                  Drag & drop or click to browse
                </span>
                <input
                  type="file"
                  accept={mediaTypes.find(t => t.id === selectedMediaType)?.accept}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <div className="mb-6">
          <Label htmlFor="content" className="text-base font-semibold mb-3 block">
            Description
          </Label>
          <Textarea
            id="content"
            placeholder="Tell us about your creative work..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-card"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                #{tag}
                <button onClick={() => handleRemoveTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="bg-card"
          />
        </div>

        {/* Tokenization */}
        <Card variant="gradient" className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Tokenize Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn tokens when users engage
                  </p>
                </div>
              </div>
              <Button
                variant={isTokenized ? "default" : "outline"}
                onClick={() => setIsTokenized(!isTokenized)}
              >
                {isTokenized ? "Enabled" : "Enable"}
              </Button>
            </div>

            {isTokenized && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <Label className="text-sm mb-2 block">Token Reward Pool</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={tokenReward}
                      onChange={(e) => setTokenReward(Number(e.target.value))}
                      className="w-32 bg-background"
                    />
                    <span className="text-muted-foreground">tokens for reviewers</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    Early reviewers earn more tokens!
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Save Draft
          </Button>
          <Button variant="glow" className="flex-1" onClick={handleSubmit}>
            Publish Post
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

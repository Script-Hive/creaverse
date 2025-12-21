import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Upload,
  Coins,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCategories, useSubcategories, Subcategory } from "@/hooks/useCategories";
import { useCreatePost } from "@/hooks/usePosts";
import { Database } from "@/integrations/supabase/types";
import { motion, AnimatePresence } from "framer-motion";

type MediaType = Database["public"]["Enums"]["media_type"];
type CreatorType = Database["public"]["Enums"]["creator_type"];

const mediaTypes: { id: MediaType; label: string; icon: React.ComponentType<{ className?: string }>; accept: string }[] = [
  { id: "image", label: "Image", icon: Image, accept: "image/*" },
  { id: "video", label: "Video", icon: Video, accept: "video/*" },
  { id: "audio", label: "Audio", icon: Music, accept: "audio/*" },
  { id: "document", label: "Document", icon: FileText, accept: ".pdf,.doc,.docx" },
];

export default function Create() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>("image");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isTokenized, setIsTokenized] = useState(false);
  const [tokenReward, setTokenReward] = useState(100);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch categories and subcategories from database
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(selectedCategoryId || undefined);
  
  const createPost = useCreatePost();

  // Update selected subcategory when subcategory ID changes
  useEffect(() => {
    if (selectedSubcategoryId && subcategories) {
      const sub = subcategories.find(s => s.id === selectedSubcategoryId);
      setSelectedSubcategory(sub || null);
    } else {
      setSelectedSubcategory(null);
    }
  }, [selectedSubcategoryId, subcategories]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategoryId("");
    setSelectedSubcategory(null);
  }, [selectedCategoryId]);

  // Get selected category data
  const selectedCategory = categories?.find(c => c.id === selectedCategoryId);

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
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!selectedCategoryId || !selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!selectedSubcategoryId) {
      toast.error("Please select a subcategory");
      return;
    }
    if (!content.trim()) {
      toast.error("Please add a description");
      return;
    }
    if (!previewUrl && !isDraft) {
      toast.error("Please upload media");
      return;
    }

    // Map category name to creator_type enum
    const categoryName = selectedCategory.name.toLowerCase() as CreatorType;
    
    try {
      await createPost.mutateAsync({
        title: content.substring(0, 100), // Use first 100 chars as title
        content,
        category: categoryName,
        subcategory_id: selectedSubcategoryId,
        media_type: selectedMediaType,
        media_url: previewUrl || undefined,
        tags,
        is_tokenized: isTokenized,
        token_reward: isTokenized ? tokenReward : 0,
        is_published: !isDraft,
      });

      toast.success(isDraft ? "Draft saved!" : "Post published successfully!", {
        description: isDraft 
          ? "Your draft has been saved" 
          : "Your content is now live on Creaverse"
      });

      // Reset form
      if (!isDraft) {
        setSelectedCategoryId("");
        setSelectedSubcategoryId("");
        setContent("");
        setTags([]);
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsTokenized(false);
        setTokenReward(100);
      }
    } catch (error: any) {
      toast.error("Failed to create post", {
        description: error.message || "Please try again"
      });
    }
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
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Choose a category"} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color || 'hsl(var(--primary))' }}
                    />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory Selection - Only show when category is selected */}
        <AnimatePresence mode="wait">
          {selectedCategoryId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Label className="text-base font-semibold mb-3 block">Select Subcategory</Label>
              <Select 
                value={selectedSubcategoryId} 
                onValueChange={setSelectedSubcategoryId}
                disabled={subcategoriesLoading}
              >
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder={subcategoriesLoading ? "Loading subcategories..." : "Choose a subcategory"} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  {subcategories?.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      <div className="flex flex-col items-start">
                        <span>{subcategory.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {subcategory.creator_type_display}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {subcategories?.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No subcategories available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creator Type Display - Auto-filled based on subcategory */}
        <AnimatePresence mode="wait">
          {selectedSubcategory && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Post Type / Creator Type</Label>
                      <p className="text-lg font-semibold text-primary">
                        {selectedSubcategory.creator_type_display}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Type Selection */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Media Type</Label>
          <div className="flex flex-wrap gap-2">
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
                {selectedMediaType === "image" ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                ) : selectedMediaType === "video" ? (
                  <video 
                    src={previewUrl} 
                    controls
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                ) : selectedMediaType === "audio" ? (
                  <div className="w-full p-8 bg-muted rounded-lg flex flex-col items-center gap-4">
                    <Music className="w-16 h-16 text-muted-foreground" />
                    <audio src={previewUrl} controls className="w-full" />
                  </div>
                ) : (
                  <div className="w-full p-8 bg-muted rounded-lg flex flex-col items-center gap-4">
                    <FileText className="w-16 h-16 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
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

            <AnimatePresence>
              {isTokenized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-border"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Validation Messages */}
        {(!selectedCategoryId || !selectedSubcategoryId) && (
          <Card className="mb-6 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <p className="text-sm text-yellow-500">
                  {!selectedCategoryId 
                    ? "Please select a category to continue" 
                    : "Please select a subcategory to continue"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handleSubmit(true)}
            disabled={createPost.isPending}
          >
            {createPost.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save Draft
          </Button>
          <Button 
            variant="glow" 
            className="flex-1" 
            onClick={() => handleSubmit(false)}
            disabled={createPost.isPending || !selectedCategoryId || !selectedSubcategoryId}
          >
            {createPost.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Publish Post
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

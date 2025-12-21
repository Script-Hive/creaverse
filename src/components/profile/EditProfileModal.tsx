import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { CategorySubcategorySelector } from "@/components/category/CategorySubcategorySelector";
import { User } from "@/types";
import { toast } from "sonner";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSave?: (data: ProfileFormData) => void;
}

export interface ProfileFormData {
  displayName: string;
  username: string;
  bio: string;
  avatar?: string;
  subcategoryIds: string[];
  primarySubcategoryId?: string;
}

export function EditProfileModal({ open, onOpenChange, user, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: user.displayName,
    username: user.username,
    bio: user.bio || "",
    avatar: user.avatar,
    subcategoryIds: [],
    primarySubcategoryId: undefined,
  });

  const handleSubcategoryChange = (subcategoryIds: string[], primaryId?: string) => {
    setFormData(prev => ({
      ...prev,
      subcategoryIds,
      primarySubcategoryId: primaryId,
    }));
  };

  const handleSave = () => {
    if (!formData.displayName.trim()) {
      toast.error("Display name is required");
      return;
    }
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    onSave?.(formData);
    onOpenChange(false);
    toast.success("Profile updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and creator type
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative group">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="text-2xl">
                  {formData.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Your display name"
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                  @
                </span>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="rounded-l-none"
                  placeholder="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell people about yourself..."
                rows={3}
              />
            </div>
          </div>

          {/* Category & Subcategory Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Creator Type</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select your category and specialization (up to 3)
            </p>
            <CategorySubcategorySelector
              selectedSubcategories={formData.subcategoryIds}
              primarySubcategoryId={formData.primarySubcategoryId}
              onSelectionChange={handleSubcategoryChange}
              maxSelections={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

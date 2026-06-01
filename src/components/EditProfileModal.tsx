import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile, isOpen]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please pick an image.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Too large", description: "Image must be under 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);
      await updateProfile({ avatar_url: publicUrl });
      toast({ title: "Photo updated", description: "Profile picture saved." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message ?? "Try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !username.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and username are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await updateProfile({
      name: name.trim(),
      username: username.trim(),
      bio: bio.trim() || null,
    });
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Username might be taken.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      onClose();
    }
  };

  const initial = (name || username || "U").charAt(0).toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover + Avatar */}
          <div className="relative">
            <div className="w-full h-24 bg-muted rounded-lg" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploading}
                className="relative w-14 h-14 rounded-full bg-primary flex items-center justify-center border-4 border-background cursor-pointer group overflow-hidden"
                aria-label="Change profile photo"
              >
                {avatarUrl ? (
                  <Avatar className="w-full h-full">
                    <AvatarImage src={avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground">{initial}</AvatarFallback>
                  </Avatar>
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-100 transition-opacity">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="font-semibold text-foreground mb-4">Personal Details</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/50 border-border"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-muted-foreground">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-muted/50 border-border"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-muted-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="bg-muted/50 border-border min-h-[80px] resize-none"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;

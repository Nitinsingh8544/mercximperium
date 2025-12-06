import { useState } from "react";
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
import { Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const defaultUsername = user?.email?.split("@")[0] || "";
  const defaultName = defaultUsername.charAt(0).toUpperCase() + defaultUsername.slice(1) + " " + "User";
  
  const [name, setName] = useState(defaultName);
  const [username, setUsername] = useState(defaultUsername);
  const [bio, setBio] = useState("");

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="relative">
            <div className="w-full h-24 bg-muted rounded-lg" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center border-4 border-background cursor-pointer group">
                <Camera className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
              </div>
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-muted-foreground">
                Bio <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="bg-muted/50 border-border min-h-[80px] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;

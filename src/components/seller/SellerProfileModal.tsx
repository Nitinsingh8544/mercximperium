import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, X, Star } from "lucide-react";
import ShareProfileModal from "./ShareProfileModal";
import MessageChatModal from "./MessageChatModal";

interface SellerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  sellerImage?: string;
  sellerRating?: number;
}

const SellerProfileModal = ({
  isOpen,
  onClose,
  sellerName,
  sellerImage,
  sellerRating = 4.8,
}: SellerProfileModalProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const sellerInitial = sellerName.charAt(0).toUpperCase();

  const sellerStats = {
    followers: "12.5K",
    following: "234",
    sales: "1.2K",
  };

  const sellerProducts = [
    { id: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", price: "$120" },
    { id: 2, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200", price: "$95" },
    { id: 3, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200", price: "$150" },
    { id: 4, image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200", price: "$85" },
    { id: 5, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200", price: "$110" },
    { id: 6, image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200", price: "$200" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 bg-card border-border overflow-hidden">
          {/* Header with cover */}
          <div className="relative h-24 bg-gradient-to-r from-secondary/30 to-primary/20">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-foreground/70 hover:text-foreground hover:bg-background/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="px-6 pb-6 -mt-12">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-card">
                <AvatarImage src={sellerImage} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {sellerInitial}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Rating */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-foreground">{sellerName}</h2>
                <div className="flex items-center gap-1 text-secondary">
                  <Star className="h-4 w-4 fill-secondary" />
                  <span className="text-sm">{sellerRating} Rating</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-muted-foreground text-sm mb-4">
              Premium seller | Authentic products only | Fast shipping 📦
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <p className="text-foreground font-bold">{sellerStats.followers}</p>
                <p className="text-muted-foreground text-xs">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-foreground font-bold">{sellerStats.following}</p>
                <p className="text-muted-foreground text-xs">Following</p>
              </div>
              <div className="text-center">
                <p className="text-foreground font-bold">{sellerStats.sales}</p>
                <p className="text-muted-foreground text-xs">Sales</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button 
                variant="outline" 
                className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsChatModalOpen(true)}
              >
                Message
              </Button>
              <Button 
                className={`flex-1 ${isFollowing ? 'bg-primary/70 hover:bg-primary/80' : 'bg-primary hover:bg-primary/90'} text-primary-foreground`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-secondary/30 text-secondary hover:bg-secondary/10"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="w-full bg-muted">
                <TabsTrigger 
                  value="products" 
                  className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {sellerProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer"
                    >
                      <img 
                        src={product.image} 
                        alt="Product" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <span className="text-white text-xs font-semibold">{product.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="text-center text-muted-foreground py-8">
                  <Star className="w-8 h-8 mx-auto mb-2 fill-secondary text-secondary" />
                  <p className="text-sm">4.8 average from 256 reviews</p>
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-4">
                <div className="text-muted-foreground text-sm space-y-2">
                  <p>Joined: March 2022</p>
                  <p>Location: Los Angeles, CA</p>
                  <p>Response time: Usually within 1 hour</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userName={sellerName}
      />

      <MessageChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        userName={sellerName}
        userInitial={sellerInitial}
        userImage={sellerImage}
      />
    </>
  );
};

export default SellerProfileModal;
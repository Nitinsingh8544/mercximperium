import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, MoreHorizontal, Star, Camera } from "lucide-react";
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

  // Mock data for the seller
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
        <DialogContent className="max-w-md p-0 bg-[#1a3a3a] border-[#8B4513]/30 overflow-hidden">
          {/* Header with cover */}
          <div className="relative h-24 bg-gradient-to-r from-[#2d5a5a] to-[#1a3a3a]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="px-6 pb-6 -mt-12">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-[#1a3a3a]">
                <AvatarImage src={sellerImage} />
                <AvatarFallback className="bg-[#8B4513] text-white text-2xl font-bold">
                  {sellerInitial}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 bg-[#8B4513] rounded-full text-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Name and Rating */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-white">{sellerName}</h2>
                <div className="flex items-center gap-1 text-[#20b2aa]">
                  <Star className="h-4 w-4 fill-[#20b2aa]" />
                  <span className="text-sm">{sellerRating} Rating</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[#a0c4c4] text-sm mb-4">
              Premium sneaker seller | Authentic products only | Fast shipping 📦
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <p className="text-white font-bold">{sellerStats.followers}</p>
                <p className="text-[#a0c4c4] text-xs">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{sellerStats.following}</p>
                <p className="text-[#a0c4c4] text-xs">Following</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{sellerStats.sales}</p>
                <p className="text-[#a0c4c4] text-xs">Sales</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button 
                variant="outline" 
                className="flex-1 border-[#20b2aa] text-[#20b2aa] hover:bg-[#20b2aa] hover:text-white bg-transparent"
                onClick={() => setIsChatModalOpen(true)}
              >
                Message
              </Button>
              <Button 
                className={`flex-1 ${isFollowing ? 'bg-[#8B4513]/50 hover:bg-[#8B4513]/70' : 'bg-[#8B4513] hover:bg-[#8B4513]/90'} text-white`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="border border-[#20b2aa]/30 text-[#20b2aa] hover:bg-[#20b2aa]/10"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="w-full bg-[#2d5a5a] border-[#20b2aa]/20">
                <TabsTrigger 
                  value="products" 
                  className="flex-1 data-[state=active]:bg-[#20b2aa] data-[state=active]:text-white text-[#a0c4c4]"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="flex-1 data-[state=active]:bg-[#20b2aa] data-[state=active]:text-white text-[#a0c4c4]"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="flex-1 data-[state=active]:bg-[#20b2aa] data-[state=active]:text-white text-[#a0c4c4]"
                >
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {sellerProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="relative aspect-square rounded-lg overflow-hidden bg-[#2d5a5a] group cursor-pointer"
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
                <div className="text-center text-[#a0c4c4] py-8">
                  <Star className="w-8 h-8 mx-auto mb-2 fill-[#20b2aa] text-[#20b2aa]" />
                  <p className="text-sm">4.8 average from 256 reviews</p>
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-4">
                <div className="text-[#a0c4c4] text-sm space-y-2">
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

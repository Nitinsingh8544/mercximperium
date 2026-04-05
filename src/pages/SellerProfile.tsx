import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Share, MessageCircle, ShoppingBag } from "lucide-react";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import ShareProfileModal from "@/components/seller/ShareProfileModal";
import MessageChatModal from "@/components/seller/MessageChatModal";
import { useFollows } from "@/hooks/useFollows";
import ProductDetailModal from "@/components/livestream/ProductDetailModal";

const sellerProducts = [
  { id: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", title: "Premium Running Sneakers", price: 120, originalPrice: 160, currency: "$" },
  { id: 2, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", title: "Classic White Sneakers", price: 95, originalPrice: 130, currency: "$" },
  { id: 3, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", title: "Urban Street Sneakers", price: 150, originalPrice: 200, currency: "$" },
  { id: 4, image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400", title: "Retro High Tops", price: 85, originalPrice: 120, currency: "$" },
  { id: 5, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400", title: "Limited Edition Air Max", price: 110, originalPrice: 150, currency: "$" },
  { id: 6, image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400", title: "Sport Performance Shoes", price: 200, originalPrice: 260, currency: "$" },
  { id: 7, image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400", title: "Casual Day Sneakers", price: 75, originalPrice: 100, currency: "$" },
  { id: 8, image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400", title: "Colorful Running Shoes", price: 130, originalPrice: 170, currency: "$" },
];

const sellerReviews = [
  { id: 1, user: "Alex M.", rating: 5, text: "Amazing quality! The sneakers are exactly as described. Fast shipping too.", date: "2 days ago" },
  { id: 2, user: "Sarah K.", rating: 4, text: "Great seller, very responsive. Product was in perfect condition.", date: "1 week ago" },
  { id: 3, user: "Mike R.", rating: 5, text: "Best sneaker seller on the platform. Will definitely buy again!", date: "2 weeks ago" },
  { id: 4, user: "Jenny L.", rating: 4, text: "Good experience overall. Packaging could be better but product is authentic.", date: "3 weeks ago" },
  { id: 5, user: "David P.", rating: 5, text: "Received exactly what I ordered. Premium quality, highly recommend.", date: "1 month ago" },
];

const SellerProfile = () => {
  const { sellerName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(sellerName || "");
  const { isFollowing, toggleFollow } = useFollows();
  const following = isFollowing(decodedName);

  const [shareOpen, setShareOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof sellerProducts[0] | null>(null);

  const sellerInitial = decodedName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />

      <div className="pt-32 sm:pt-28 md:pt-20 px-4 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-foreground hover:bg-muted mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Profile Header */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Cover */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-secondary/30 to-primary/20" />

            {/* Profile info */}
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-card shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {sellerInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 sm:pb-1">
                  <h1 className="text-2xl font-bold text-foreground">{decodedName}</h1>
                  <div className="flex items-center gap-1 text-secondary mt-1">
                    <Star className="h-4 w-4 fill-secondary" />
                    <span className="text-sm font-medium">4.8 Rating</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Premium seller | Authentic products only | Fast shipping 📦
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6 mb-6">
                <div className="text-center">
                  <p className="text-foreground font-bold text-lg">12.5K</p>
                  <p className="text-muted-foreground text-xs">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-foreground font-bold text-lg">234</p>
                  <p className="text-muted-foreground text-xs">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-foreground font-bold text-lg">1.2K</p>
                  <p className="text-muted-foreground text-xs">Sales</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button
                  className={`${following ? "bg-primary/70 hover:bg-primary/80" : "bg-primary hover:bg-primary/90"} text-primary-foreground`}
                  onClick={() => toggleFollow(decodedName, "shop_live")}
                >
                  {following ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-secondary/30 text-secondary hover:bg-secondary/10"
                  onClick={() => setShareOpen(true)}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <div className="mt-6 bg-card rounded-xl border border-border p-6">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="w-full bg-muted mb-6">
                <TabsTrigger value="products" className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <Star className="w-4 h-4 mr-2" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="about" className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {sellerProducts.map((product) => (
                    <div
                      key={product.id}
                      className="relative rounded-xl overflow-hidden border border-border bg-muted group cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="aspect-square">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-primary">{product.currency}{product.price}</span>
                          <span className="text-xs text-muted-foreground line-through">{product.currency}{product.originalPrice}</span>
                        </div>
                        <Button size="sm" className="w-full mt-2 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">4.8</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">256 reviews</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[
                        { stars: 5, pct: 78 },
                        { stars: 4, pct: 15 },
                        { stars: 3, pct: 5 },
                        { stars: 2, pct: 1 },
                        { stars: 1, pct: 1 },
                      ].map((r) => (
                        <div key={r.stars} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-3">{r.stars}</span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full" style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual reviews */}
                  {sellerReviews.map((review) => (
                    <div key={review.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground text-sm">{review.user}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Seller Info</h4>
                      <div className="text-sm text-muted-foreground space-y-1.5">
                        <p>📅 Joined: March 2022</p>
                        <p>📍 Location: Los Angeles, CA</p>
                        <p>⏱ Response time: Usually within 1 hour</p>
                        <p>📦 Ships within: 1-2 business days</p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Policies</h4>
                      <div className="text-sm text-muted-foreground space-y-1.5">
                        <p>✅ Returns accepted within 30 days</p>
                        <p>✅ Free shipping on orders over $100</p>
                        <p>✅ Authenticity guaranteed</p>
                        <p>✅ Secure payment processing</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">About the Seller</h4>
                    <p className="text-sm text-muted-foreground">
                      Passionate about sneakers and streetwear. We curate the finest selection of authentic footwear from top brands worldwide. Every item is verified for authenticity before shipping. Our mission is to make premium sneakers accessible to everyone with competitive pricing and excellent customer service.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Sneakers", "Streetwear", "Authentic", "Premium", "Nike", "Adidas", "Jordan"].map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-border text-muted-foreground">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ShareProfileModal isOpen={shareOpen} onClose={() => setShareOpen(false)} userName={decodedName} />
      <MessageChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} userName={decodedName} userInitial={sellerInitial} />
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        sellerName={decodedName}
      />
    </div>
  );
};

export default SellerProfile;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import SellerProfileModal from "@/components/seller/SellerProfileModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedSeller, setSelectedSeller] = useState<{ name: string; image?: string } | null>(null);
  
  const liveStreams = [
    { id: 1, host: "sneakerhub", title: "Premium Sneakers Drop 🔥", viewers: 177, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400" },
    { id: 2, host: "streetwearking", title: "Limited Edition Streetwear", viewers: 291, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" },
    { id: 3, host: "collectibles_pro", title: "Rare Collectibles + Giveaway", viewers: 122, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" },
    { id: 4, host: "fashionfinds", title: "Designer Fashion Sale 🛍️", viewers: 94, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" },
    { id: 5, host: "vintagevault", title: "Vintage Treasures Collection", viewers: 135, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400" },
    { id: 6, host: "urbanstyle", title: "Urban Style Essentials", viewers: 88, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" },
    { id: 7, host: "techgadgets", title: "Latest Tech Gadgets 📱", viewers: 203, image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400" },
    { id: 8, host: "jewelryqueen", title: "Handmade Jewelry Collection", viewers: 156, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" },
    { id: 9, host: "booklover", title: "Rare Book Finds 📚", viewers: 67, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" },
    { id: 10, host: "fitnessgear", title: "Premium Gym Equipment", viewers: 189, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" },
    { id: 11, host: "artcollector", title: "Original Art Pieces 🎨", viewers: 112, image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400" },
    { id: 12, host: "gamingzone", title: "Gaming Setup Sale", viewers: 245, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400" },
    { id: 13, host: "homedecore", title: "Modern Home Decor ✨", viewers: 78, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
    { id: 14, host: "watchexpert", title: "Luxury Watch Collection", viewers: 167, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 15, host: "plantparent", title: "Rare Plants & Succulents 🌱", viewers: 134, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400" },
    { id: 16, host: "musicstore", title: "Vinyl Records & Instruments", viewers: 98, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400" },
  ];

  const handleSellerClick = (e: React.MouseEvent, host: string) => {
    e.stopPropagation();
    setSelectedSeller({ name: host });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Hi there! 👋
          </h1>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 shrink-0">
            <div className="space-y-2">
              <Link to="/dashboard" className="block px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-medium">
                For You
              </Link>
              <Link to="/followed" className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                Followed Hosts
              </Link>
              <Link to="/browse" className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                Browse Categories
              </Link>
            </div>
          </aside>

          {/* Live Streams Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {liveStreams.map((stream) => (
                <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate(`/live/${stream.id}`)}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={stream.image} 
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-600 text-white border-0">
                      Live · {stream.viewers}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => handleSellerClick(e, stream.host)}
                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 hover:bg-primary/30 hover:ring-2 hover:ring-secondary transition-all"
                      >
                        <span className="text-sm font-semibold text-primary">
                          {stream.host.charAt(0).toUpperCase()}
                        </span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={(e) => handleSellerClick(e, stream.host)}
                          className="font-medium text-sm text-foreground truncate block hover:text-secondary transition-colors text-left"
                        >
                          {stream.host}
                        </button>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {stream.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seller Profile Modal */}
      {selectedSeller && (
        <SellerProfileModal
          isOpen={!!selectedSeller}
          onClose={() => setSelectedSeller(null)}
          sellerName={selectedSeller.name}
          sellerImage={selectedSeller.image}
        />
      )}
    </div>
  );
};

export default Dashboard;
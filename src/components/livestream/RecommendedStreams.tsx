import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stream {
  id: number;
  host: string;
  title: string;
  viewers: number;
  image: string;
}

interface RecommendedStreamsProps {
  currentStreamId?: number;
}

const RecommendedStreams = ({ currentStreamId }: RecommendedStreamsProps) => {
  const navigate = useNavigate();

  const allStreams: Stream[] = [
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
  ];

  // Filter out current stream and get 6 recommendations
  const recommendedStreams = allStreams
    .filter(stream => stream.id !== currentStreamId)
    .slice(0, 6);

  return (
    <div className="mt-8 pb-8">
      <h2 className="text-xl font-bold text-foreground mb-4">Similar Streams</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {recommendedStreams.map((stream) => (
          <Card 
            key={stream.id} 
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
            onClick={() => navigate(`/live/${stream.id}`)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={stream.image} 
                alt={stream.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-600 text-white border-0 text-xs">
                Live · {stream.viewers}
              </Badge>
            </div>
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {stream.host.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-foreground truncate">
                    {stream.host}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {stream.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedStreams;

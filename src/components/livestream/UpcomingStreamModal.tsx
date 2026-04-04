import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Package, User } from "lucide-react";
import SellerProfileModal from "@/components/seller/SellerProfileModal";

interface UpcomingStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: {
    id: number;
    host: string;
    title: string;
    image: string;
  } | null;
}

const UpcomingStreamModal = ({ isOpen, onClose, stream }: UpcomingStreamModalProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showSellerProfile, setShowSellerProfile] = useState(false);

  const [scheduledTime] = useState(() => {
    const ms = (Math.floor(Math.random() * 3) + 1) * 3600000 + Math.floor(Math.random() * 60) * 60000;
    return Date.now() + ms;
  });

  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      const diff = Math.max(0, scheduledTime - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isOpen, scheduledTime]);

  if (!stream) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  const sampleProducts = [
    "Premium Running Sneakers",
    "Classic All-White Collection",
    "Urban Street Sneakers",
    "Retro High Tops",
    "Limited Edition Air Max",
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Upcoming Stream</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Thumbnail */}
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <img src={stream.image} alt={stream.title} className="w-full h-full object-cover" />
              <Badge className="absolute top-2 left-2 bg-purple-600 hover:bg-purple-600 text-white border-0">
                Upcoming
              </Badge>
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                {[
                  { label: "HRS", value: pad(timeLeft.hours) },
                  { label: "MIN", value: pad(timeLeft.minutes) },
                  { label: "SEC", value: pad(timeLeft.seconds) },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-2">
                    {i > 0 && <span className="text-xl font-bold text-muted-foreground">:</span>}
                    <div className="text-center">
                      <div className="bg-muted rounded-lg px-3 py-2 min-w-[48px]">
                        <span className="text-2xl font-bold text-foreground">{unit.value}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{unit.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Title & Host with Seller Avatar */}
            <div className="flex items-center gap-3">
              <Avatar
                className="h-12 w-12 shrink-0 cursor-pointer border-2 border-border hover:border-primary transition-colors"
                onClick={() => setShowSellerProfile(true)}
              >
                <AvatarFallback className="bg-primary/20 text-primary">
                  {stream.host.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-lg">{stream.title} 🏷️</h3>
                <p className="text-sm text-muted-foreground">
                  Hosted by <span className="font-medium text-foreground">{stream.host}</span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-xs"
                onClick={() => setShowSellerProfile(true)}
              >
                + Follow
              </Button>
            </div>

            {/* Products description */}
            <div className="bg-muted rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Products to be featured</span>
              </div>
              <ul className="space-y-1">
                {sampleProducts.map((product, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SellerProfileModal
        isOpen={showSellerProfile}
        onClose={() => setShowSellerProfile(false)}
        sellerName={stream.host}
      />
    </>
  );
};

export default UpcomingStreamModal;

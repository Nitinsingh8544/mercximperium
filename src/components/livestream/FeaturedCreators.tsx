import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFollows } from "@/hooks/useFollows";
import { allStreams } from "@/data/streamData";
import { ScrollArea } from "@/components/ui/scroll-area";
import UpcomingStreamModal from "./UpcomingStreamModal";

interface CreatorStatus {
  name: string;
  avatar?: string;
  status: "live" | "upcoming" | "offline";
  scheduledAt?: Date;
  streamId?: number;
}

const getCreatorStatus = (sellerName: string): { status: "live" | "upcoming" | "offline"; scheduledAt?: Date; avatar?: string; streamId?: number } => {
  const stream = allStreams.find(
    (s) => s.host.toLowerCase() === sellerName.toLowerCase() || s.host === sellerName
  );

  if (!stream) return { status: "offline" };

  const isLive = stream.streamDate.toLowerCase().includes("live now");
  const isRecent = stream.streamDate.includes("hour") || stream.streamDate.includes("minute");

  if (isLive) {
    return { status: "live", avatar: stream.hostAvatar || stream.image, streamId: stream.id };
  }
  if (isRecent) {
    const minutesFromNow = Math.random() * 120 + 10;
    return {
      status: "upcoming",
      scheduledAt: new Date(Date.now() + minutesFromNow * 60000),
      avatar: stream.hostAvatar || stream.image,
      streamId: stream.id,
    };
  }
  return { status: "offline", avatar: stream.hostAvatar || stream.image, streamId: stream.id };
};

interface FeaturedCreatorsProps {
  onCreatorSelect?: (streamId: number) => void;
  activeStreamId?: number;
}

const FeaturedCreators = ({ onCreatorSelect, activeStreamId }: FeaturedCreatorsProps) => {
  const { followedSellers } = useFollows();
  const navigate = useNavigate();
  const [upcomingStream, setUpcomingStream] = useState<{ id: number; host: string; title: string; image: string } | null>(null);

  const creators: CreatorStatus[] = useMemo(() => {
    const followed = followedSellers.map((name) => {
      const info = getCreatorStatus(name);
      return { name, ...info };
    });

    const defaultNames = allStreams
      .filter((s) => !followedSellers.some((f) => f.toLowerCase() === s.host.toLowerCase()))
      .slice(0, 6)
      .map((s) => {
        const info = getCreatorStatus(s.host);
        return { name: s.host, ...info };
      });

    const all = [...followed, ...defaultNames];

    return all.sort((a, b) => {
      const priority = { live: 0, upcoming: 1, offline: 2 };
      if (priority[a.status] !== priority[b.status]) return priority[a.status] - priority[b.status];
      if (a.status === "upcoming" && b.status === "upcoming" && a.scheduledAt && b.scheduledAt) {
        return a.scheduledAt.getTime() - b.scheduledAt.getTime();
      }
      return 0;
    });
  }, [followedSellers]);

  const handleCreatorClick = (creator: CreatorStatus) => {
    if (creator.status === "live" && creator.streamId) {
      onCreatorSelect?.(creator.streamId);
    } else if (creator.status === "upcoming") {
      const stream = allStreams.find(s => s.id === creator.streamId);
      setUpcomingStream({
        id: creator.streamId || 0,
        host: creator.name,
        title: stream?.title || `${creator.name}'s Upcoming Stream`,
        image: creator.avatar || stream?.image || "",
      });
    } else {
      navigate(`/seller/${encodeURIComponent(creator.name)}`);
    }
  };

  const getRingClass = (status: "live" | "upcoming" | "offline", isActive: boolean) => {
    if (isActive) return "ring-2 ring-primary ring-offset-2 ring-offset-background";
    if (status === "live") return "ring-2 ring-red-500 ring-offset-2 ring-offset-background animate-pulse";
    if (status === "upcoming") return "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background";
    return "ring-1 ring-border";
  };

  const getStatusLabel = (status: "live" | "upcoming" | "offline") => {
    if (status === "live") return "LIVE";
    if (status === "upcoming") return "Soon";
    return null;
  };

  const isHighlighted = (status: "live" | "upcoming" | "offline") => {
    return status === "live" || status === "upcoming";
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border h-full flex flex-col">
        <div className="p-3 border-b border-border flex-shrink-0">
          <h2 className="font-bold text-foreground text-sm">Following</h2>
        </div>

        <ScrollArea className="flex-1 [&>div>div]:!block [&_[data-radix-scroll-area-scrollbar]]:!opacity-100 [&_[data-radix-scroll-area-scrollbar]]:w-1.5">
          <div className="p-2 space-y-1">
            {creators.length === 0 && (
              <p className="text-xs text-muted-foreground p-2 text-center">
                Follow creators to see them here.
              </p>
            )}
            {creators.map((creator, idx) => {
              const isActive = creator.streamId === activeStreamId;
              const statusLabel = getStatusLabel(creator.status);
              const highlighted = isHighlighted(creator.status);

              return (
                <button
                  key={`${creator.name}-${idx}`}
                  onClick={() => handleCreatorClick(creator)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left group hover:bg-muted ${
                    isActive ? "bg-muted" : ""
                  } ${!highlighted && !isActive ? "opacity-50" : ""}`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar
                      className={`h-10 w-10 transition-all duration-300 ${getRingClass(creator.status, isActive)}`}
                    >
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                        {creator.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {statusLabel && (
                      <span
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                          creator.status === "live"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-400 text-yellow-900"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium truncate transition-colors ${
                        creator.status === "live"
                          ? "text-red-500"
                          : isActive
                          ? "text-primary"
                          : highlighted
                          ? "text-foreground group-hover:text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {creator.name}
                    </p>
                    {creator.status === "upcoming" && creator.scheduledAt && (
                      <p className="text-[10px] text-muted-foreground">
                        Starts in {Math.round((creator.scheduledAt.getTime() - Date.now()) / 60000)}m
                      </p>
                    )}
                    {creator.status === "live" && (
                      <p className="text-[10px] text-red-400">Streaming now</p>
                    )}
                    {creator.status === "offline" && (
                      <p className="text-[10px] text-muted-foreground">Offline</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <UpcomingStreamModal
        isOpen={!!upcomingStream}
        onClose={() => setUpcomingStream(null)}
        stream={upcomingStream}
      />

    </>
  );
};

export default FeaturedCreators;

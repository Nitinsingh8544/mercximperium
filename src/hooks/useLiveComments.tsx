import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";

export interface LiveComment {
  id: string;
  user_id: string;
  stream_id: string;
  message: string;
  username: string | null;
  created_at: string;
}

export const useLiveComments = (streamId: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("live_comments")
        .select("*")
        .eq("stream_id", streamId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;
      setComments((data as LiveComment[]) || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [streamId]);

  useEffect(() => {
    fetchComments();

    // Subscribe to realtime
    const channel = supabase
      .channel(`live-comments-${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_comments",
          filter: `stream_id=eq.${streamId}`,
        },
        (payload) => {
          setComments((prev) => [...prev, payload.new as LiveComment]);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [streamId, fetchComments]);

  const sendComment = async (message: string) => {
    if (!user || !message.trim()) return;

    const { error } = await supabase.from("live_comments").insert({
      user_id: user.id,
      stream_id: streamId,
      message: message.trim(),
      username: profile?.username || profile?.name || user.email?.split("@")[0] || "User",
    });

    if (error) {
      console.error("Error sending comment:", error);
    }
  };

  return { comments, loading, sendComment };
};

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface ChatProfile {
  user_id: string;
  username: string | null;
  name: string | null;
  avatar_url: string | null;
}

export interface Conversation {
  partner: ChatProfile;
  lastMessage: DirectMessage;
  unread: number;
}

export const useDirectMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: msgs } = await supabase
      .from("direct_messages")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const byPartner = new Map<string, { last: DirectMessage; unread: number }>();
    for (const m of msgs as DirectMessage[]) {
      const partnerId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      const existing = byPartner.get(partnerId);
      const unreadInc = !m.read && m.recipient_id === user.id ? 1 : 0;
      if (!existing) {
        byPartner.set(partnerId, { last: m, unread: unreadInc });
      } else {
        existing.unread += unreadInc;
      }
    }

    const partnerIds = Array.from(byPartner.keys());
    let profiles: ChatProfile[] = [];
    if (partnerIds.length) {
      const { data: pData } = await supabase
        .from("profiles")
        .select("user_id, username, name, avatar_url")
        .in("user_id", partnerIds);
      profiles = (pData as ChatProfile[]) || [];
    }

    const convs: Conversation[] = partnerIds.map((pid) => ({
      partner:
        profiles.find((p) => p.user_id === pid) || {
          user_id: pid,
          username: "user",
          name: "User",
          avatar_url: null,
        },
      lastMessage: byPartner.get(pid)!.last,
      unread: byPartner.get(pid)!.unread,
    }));

    convs.sort(
      (a, b) =>
        new Date(b.lastMessage.created_at).getTime() -
        new Date(a.lastMessage.created_at).getTime()
    );

    setConversations(convs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("dm-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "direct_messages" },
        () => loadConversations()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadConversations]);

  return { conversations, loading, reload: loadConversations };
};

export const useConversation = (partnerId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user || !partnerId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
    setMessages((data as DirectMessage[]) || []);
    setLoading(false);

    // mark received as read
    await supabase
      .from("direct_messages")
      .update({ read: true })
      .eq("sender_id", partnerId)
      .eq("recipient_id", user.id)
      .eq("read", false);
  }, [user, partnerId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user || !partnerId) return;
    const channel = supabase
      .channel(`dm-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages" },
        (payload) => {
          const m = payload.new as DirectMessage;
          if (
            (m.sender_id === user.id && m.recipient_id === partnerId) ||
            (m.sender_id === partnerId && m.recipient_id === user.id)
          ) {
            setMessages((prev) =>
              prev.some((x) => x.id === m.id) ? prev : [...prev, m]
            );
            if (m.recipient_id === user.id) {
              supabase
                .from("direct_messages")
                .update({ read: true })
                .eq("id", m.id)
                .then(() => {});
            }
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerId]);

  const send = async (content: string) => {
    if (!user || !partnerId || !content.trim()) return;
    await supabase.from("direct_messages").insert({
      sender_id: user.id,
      recipient_id: partnerId,
      content: content.trim(),
    });
  };

  return { messages, loading, send, reload: load };
};

export const searchUsers = async (query: string, excludeUserId?: string) => {
  const q = query.trim();
  if (!q) return [] as ChatProfile[];
  let req = supabase
    .from("profiles")
    .select("user_id, username, name, avatar_url")
    .or(`username.ilike.%${q}%,name.ilike.%${q}%`)
    .limit(10);
  const { data } = await req;
  let results = (data as ChatProfile[]) || [];
  if (excludeUserId) results = results.filter((p) => p.user_id !== excludeUserId);
  return results;
};

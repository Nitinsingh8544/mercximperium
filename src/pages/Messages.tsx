import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { MessageSquare, Search, Send, ArrowLeft, Loader2, Bell, ImageIcon, Smile, X, Paperclip } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  useDirectMessages,
  useConversation,
  searchUsers,
  uploadChatMedia,
  ChatProfile,
} from "@/hooks/useDirectMessages";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const initialUserId = params.get("user");
  const initialUsername = params.get("username");

  const { conversations, loading } = useDirectMessages();
  const { unread: unreadNotifs } = useNotifications();
  const [activePartner, setActivePartner] = useState<ChatProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [draft, setDraft] = useState("");
  const [pendingMedia, setPendingMedia] = useState<{ file: File; preview: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, send } = useConversation(activePartner?.user_id ?? null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Bootstrap from URL params (?user=ID or ?username=NAME)
  useEffect(() => {
    const bootstrap = async () => {
      if (activePartner) return;
      if (initialUserId) {
        const { data } = await supabase
          .from("profiles")
          .select("user_id, username, name, avatar_url")
          .eq("user_id", initialUserId)
          .maybeSingle();
        if (data) setActivePartner(data as ChatProfile);
      } else if (initialUsername) {
        const { data } = await supabase
          .from("profiles")
          .select("user_id, username, name, avatar_url")
          .eq("username", initialUsername)
          .maybeSingle();
        if (data) setActivePartner(data as ChatProfile);
      }
    };
    bootstrap();
  }, [initialUserId, initialUsername, activePartner]);

  // Search users (debounced)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      const res = await searchUsers(q, user?.id);
      setSearchResults(res);
      setSearching(false);
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery, user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, activePartner?.user_id]);

  const filteredConvs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.partner.username?.toLowerCase().includes(q) ||
        c.partner.name?.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const openChat = (p: ChatProfile) => {
    setActivePartner(p);
    setSearchQuery("");
    setSearchResults([]);
    setParams({ user: p.user_id });
  };

  const handleSend = async () => {
    if ((!draft.trim() && !pendingMedia) || !activePartner || !user) return;
    const text = draft;
    const media = pendingMedia;
    setDraft("");
    setPendingMedia(null);
    let uploaded: { url: string; type: "image" | "video" } | null = null;
    if (media) {
      setUploading(true);
      uploaded = await uploadChatMedia(media.file, user.id);
      setUploading(false);
      if (!uploaded) {
        toast.error("Failed to upload media");
        return;
      }
      URL.revokeObjectURL(media.preview);
    }
    await send(text, uploaded);
  };

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File too large (max 25MB)");
      return;
    }
    setPendingMedia({ file, preview: URL.createObjectURL(file) });
  };

  const handleEmoji = (emoji: EmojiClickData) => {
    setDraft((d) => d + emoji.emoji);
  };

  const initials = (p: ChatProfile) =>
    (p.username || p.name || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <AuthenticatedHeader />

      <div className="container mx-auto px-2 sm:px-4 pt-20 sm:pt-24 pb-4 relative z-10">
        <div className="flex h-[calc(100vh-7rem)] rounded-xl border border-border bg-card/60 backdrop-blur overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`${
              activePartner ? "hidden md:flex" : "flex"
            } w-full md:w-80 flex-col border-r border-border`}
          >
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold text-foreground">Messages</h1>
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-foreground" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-0 right-0 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifs > 9 ? "9+" : unreadNotifs}
                    </span>
                  )}
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search username to chat..."
                  className="pl-9 bg-muted/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Search results take over */}
              {searchQuery.trim() ? (
                <div>
                  {searching && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Searching...
                    </div>
                  )}
                  {!searching && searchResults.length === 0 && filteredConvs.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No users found for "{searchQuery}"
                    </div>
                  )}
                  {filteredConvs.length > 0 && (
                    <div className="py-2">
                      <p className="px-3 text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Chats
                      </p>
                      {filteredConvs.map((c) => (
                        <ConversationRow
                          key={c.partner.user_id}
                          active={activePartner?.user_id === c.partner.user_id}
                          onClick={() => openChat(c.partner)}
                          partner={c.partner}
                          preview={c.lastMessage.content}
                          unread={c.unread}
                          initials={initials(c.partner)}
                        />
                      ))}
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="py-2">
                      <p className="px-3 text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Users
                      </p>
                      {searchResults.map((p) => (
                        <button
                          key={p.user_id}
                          onClick={() => openChat(p)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 text-left"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={p.avatar_url || undefined} />
                            <AvatarFallback>{initials(p)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {p.name || p.username}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              @{p.username}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : loading ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  Loading...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                    <MessageSquare className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No messages yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Search a username above to start chatting.
                  </p>
                </div>
              ) : (
                conversations.map((c) => (
                  <ConversationRow
                    key={c.partner.user_id}
                    active={activePartner?.user_id === c.partner.user_id}
                    onClick={() => openChat(c.partner)}
                    partner={c.partner}
                    preview={c.lastMessage.content}
                    unread={c.unread}
                    initials={initials(c.partner)}
                  />
                ))
              )}
            </div>
          </aside>

          {/* Chat panel */}
          <section
            className={`${
              activePartner ? "flex" : "hidden md:flex"
            } flex-1 flex-col`}
          >
            {!activePartner ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                    <MessageSquare className="w-9 h-9 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Your messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Search a user to start a conversation.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 border-b border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => {
                      setActivePartner(null);
                      setParams({});
                    }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <button
                    className="flex items-center gap-3 flex-1 text-left"
                    onClick={() =>
                      navigate(`/u/${activePartner.username || activePartner.user_id}`)
                    }
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={activePartner.avatar_url || undefined} />
                      <AvatarFallback>{initials(activePartner)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {activePartner.name || activePartner.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{activePartner.username}
                      </p>
                    </div>
                  </button>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                  {messages.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground mt-8">
                      No messages yet. Say hi 👋
                    </p>
                  )}
                  {messages.map((m) => {
                    const mine = m.sender_id === user?.id;
                    const hasMedia = !!m.media_url;
                    const hasText = !!m.content?.trim();
                    return (
                      <div
                        key={m.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] overflow-hidden ${
                            hasMedia && !hasText
                              ? "rounded-2xl"
                              : `rounded-2xl ${
                                  mine
                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                    : "bg-muted text-foreground rounded-bl-sm"
                                } ${hasMedia ? "p-1" : "px-3 py-2"} text-sm`
                          }`}
                        >
                          {hasMedia && m.media_type === "image" && (
                            <img
                              src={m.media_url!}
                              alt="attachment"
                              className="rounded-xl max-h-72 w-auto object-cover"
                            />
                          )}
                          {hasMedia && m.media_type === "video" && (
                            <video
                              src={m.media_url!}
                              controls
                              className="rounded-xl max-h-72 w-auto"
                            />
                          )}
                          {hasText && (
                            <p className={`whitespace-pre-wrap break-words ${hasMedia ? "px-2 py-1.5" : ""}`}>
                              {m.content}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {pendingMedia && (
                  <div className="px-3 pt-2 border-t border-border">
                    <div className="inline-flex items-start gap-2 p-2 rounded-lg bg-muted/50 relative">
                      {pendingMedia.file.type.startsWith("video") ? (
                        <video src={pendingMedia.preview} className="h-20 w-20 object-cover rounded-md" />
                      ) : (
                        <img src={pendingMedia.preview} alt="preview" className="h-20 w-20 object-cover rounded-md" />
                      )}
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(pendingMedia.preview);
                          setPendingMedia(null);
                        }}
                        className="absolute -top-2 -right-2 bg-foreground text-background rounded-full p-0.5"
                        aria-label="Remove attachment"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-3 border-t border-border flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handlePickFile}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach media"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" aria-label="Emoji">
                        <Smile className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="p-0 border-0 w-auto">
                      <EmojiPicker
                        onEmojiClick={handleEmoji}
                        theme={Theme.AUTO}
                        height={360}
                        width={320}
                        searchDisabled={false}
                        skinTonesDisabled
                        previewConfig={{ showPreview: false }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`Message @${activePartner.username || "user"}`}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={(!draft.trim() && !pendingMedia) || uploading}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const ConversationRow = ({
  partner,
  preview,
  unread,
  active,
  onClick,
  initials,
}: {
  partner: ChatProfile;
  preview: string;
  unread: number;
  active: boolean;
  onClick: () => void;
  initials: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 ${
      active ? "bg-muted/60" : ""
    }`}
  >
    <Avatar className="w-11 h-11">
      <AvatarImage src={partner.avatar_url || undefined} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">
        {partner.name || partner.username}
      </p>
      <p
        className={`text-xs truncate ${
          unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"
        }`}
      >
        {preview}
      </p>
    </div>
    {unread > 0 && (
      <span className="bg-primary text-primary-foreground text-[10px] font-semibold rounded-full px-2 py-0.5">
        {unread}
      </span>
    )}
  </button>
);

export default Messages;

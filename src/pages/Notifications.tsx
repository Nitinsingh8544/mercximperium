import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Bell, Package, Tag, Gift, Percent, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, AppNotification } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const typeIcon = (t: string) => {
  switch (t) {
    case "order": return Package;
    case "offer": return Tag;
    case "reward": return Gift;
    case "discount": return Percent;
    default: return Bell;
  }
};

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Notifications = () => {
  const { notifications, loading, unread, markAllRead, markRead } = useNotifications();
  const navigate = useNavigate();

  // Auto-mark all as read when viewing the page (after a brief moment)
  useEffect(() => {
    if (unread > 0) {
      const t = setTimeout(() => markAllRead(), 1500);
      return () => clearTimeout(t);
    }
  }, [unread, markAllRead]);

  const renderList = (items: AppNotification[]) => {
    if (loading) {
      return <p className="text-center text-sm text-muted-foreground py-10">Loading...</p>;
    }
    if (items.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Nothing to see here...</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            All new notifications will appear in this tab. For now, you're all caught up!
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {items.map((n) => {
          const Icon = typeIcon(n.type);
          return (
            <button
              key={n.id}
              onClick={async () => {
                await markRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-colors hover:bg-muted/50 ${
                n.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                n.read ? "bg-muted" : "bg-primary/10"
              }`}>
                <Icon className={`w-5 h-5 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{timeAgo(n.created_at)}</span>
                </div>
                {n.body && <p className="text-sm text-muted-foreground mt-1">{n.body}</p>}
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
            </button>
          );
        })}
      </div>
    );
  };

  const orderItems = notifications.filter((n) => n.type === "order");
  const importantItems = notifications.filter((n) => n.type === "offer" || n.type === "reward" || n.type === "discount");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />

      <AuthenticatedHeader />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Notifications
          </h1>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <Check className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto mb-6 bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="important">Offers & Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderList(notifications)}</TabsContent>
          <TabsContent value="orders">{renderList(orderItems)}</TabsContent>
          <TabsContent value="important">{renderList(importantItems)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;

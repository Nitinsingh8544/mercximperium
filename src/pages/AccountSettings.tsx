import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  CreditCard, 
  MapPin, 
  User,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  MessageCircle,
  Gift,
  Users,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userName = user?.email?.split("@")[0] || "User";

  const [preferences, setPreferences] = useState({
    directMessages: true,
    receiveGifts: false,
    activityStatus: true,
    suggestAccount: true,
  });

  const sidebarItems = [
    { label: "General", isHeader: true },
    { icon: Settings, label: "Preferences", path: "/account-settings", active: true },
    { icon: CreditCard, label: "Payments", path: "/account-settings/payments" },
    { icon: MapPin, label: "Addresses", path: "/addresses" },
    { icon: User, label: "Account", path: "/account" },
    { label: "Help & Legal", isHeader: true },
    { icon: AlertTriangle, label: "User Reports", path: "/user-reports" },
    { icon: MessageSquare, label: "Contact Us", path: "/contact" },
  ];

  const privacySettings = [
    {
      icon: MessageCircle,
      title: "Direct Messages",
      description: "Turn this on if you'd like to receive direct messages from other users.",
      key: "directMessages" as const,
    },
    {
      icon: Gift,
      title: "Receive gifts",
      description: "Turn this on to be discoverable to receive gift purchases from other users.",
      key: "receiveGifts" as const,
    },
    {
      icon: Users,
      title: "Activity Status",
      description: "Turn this on if you'd like to share your activities with your friends.",
      key: "activityStatus" as const,
    },
    {
      icon: Eye,
      title: "Suggest account to others",
      description: "Your account will be suggested to your contacts.",
      key: "suggestAccount" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-border bg-card/50 p-4 hidden md:block">
          {/* User Profile */}
          <Link to="/profile-view" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {userInitial}
            </div>
            <div>
              <p className="font-medium text-foreground">{userName}</p>
              <p className="text-xs text-primary">View Profile</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              item.isHeader ? (
                <p key={index} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-4 pb-2 first:pt-0">
                  {item.label}
                </p>
              ) : (
                <Link
                  key={index}
                  to={item.path || "#"}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* Seller Hub Button */}
          <div className="mt-8">
            <Button 
              className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => navigate("/become-seller")}
            >
              <span className="text-lg">🏪</span>
              Seller Hub
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Preferences</h1>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
              <p className="text-sm text-muted-foreground">
                Select how you can interact with and be viewed by others.
              </p>
            </div>

            <div className="space-y-6">
              {privacySettings.map((setting) => (
                <div key={setting.key} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <setting.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{setting.title}</h3>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={preferences[setting.key]}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, [setting.key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;

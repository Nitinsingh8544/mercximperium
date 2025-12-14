import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  CreditCard, 
  MapPin, 
  User,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  Mail,
  Lock,
  UserX,
  Shield,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ChangeEmailModal from "@/components/account/ChangeEmailModal";
import ChangePasswordModal from "@/components/account/ChangePasswordModal";
import DeleteAccountModal from "@/components/account/DeleteAccountModal";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userName = user?.email?.split("@")[0] || "User";

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const sidebarItems = [
    { label: "General", isHeader: true },
    { icon: Settings, label: "Preferences", path: "/account-settings" },
    { icon: CreditCard, label: "Payments", path: "/account-settings/payments" },
    { icon: MapPin, label: "Addresses", path: "/addresses" },
    { icon: User, label: "Account", path: "/account", active: true },
    { label: "Help & Legal", isHeader: true },
    { icon: AlertTriangle, label: "User Reports", path: "/user-reports" },
    { icon: MessageSquare, label: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-border bg-card/50 p-4 hidden md:block">
          <Link to="/profile-view" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {userInitial}
            </div>
            <div>
              <p className="font-medium text-foreground">{userName}</p>
              <p className="text-xs text-primary">View Profile</p>
            </div>
          </Link>

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
          <h1 className="text-2xl font-bold text-foreground mb-6">Account</h1>

          {/* Buyer Settings */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Buyer Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Verified Buyer Status</p>
                    <p className="text-sm text-muted-foreground">Once verified you will be able to bid in any stream.</p>
                  </div>
                </div>
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  Verify With Photo ID
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Sales Tax Exemption Status</p>
                    <p className="text-sm text-muted-foreground">Save from paying tax on your purchases from Whatnot.</p>
                  </div>
                </div>
                <Button variant="outline">Set Up</Button>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Account Management</h2>
            
            <div className="space-y-1">
              <button 
                onClick={() => setIsEmailModalOpen(true)}
                className="w-full flex items-center justify-between py-4 px-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-medium text-foreground">Change Email</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-between py-4 px-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-medium text-foreground">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full flex items-center justify-between py-4 px-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <UserX className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-medium text-foreground">Delete Account</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <ChangeEmailModal open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen} />
      <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
      <DeleteAccountModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} />
    </div>
  );
};

export default Account;

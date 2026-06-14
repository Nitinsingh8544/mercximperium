import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Radio, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/browse", icon: ShoppingBag, label: "Browse" },
  { to: "/shop-live", icon: Radio, label: "Live" },
  { to: "/activity", icon: Heart, label: "Activity" },
  { to: "/profile-view", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  const isActive = (to: string) => {
    if (to === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(to);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = isActive(t.to);
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <t.icon
                  className={cn(
                    "w-5 h-5",
                    active && "stroke-[2.4]"
                  )}
                />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;

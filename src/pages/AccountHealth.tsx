import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Star,
  CheckCircle2,
  Award,
} from "lucide-react";
import appLogo from "@/assets/app-logo.jpg";

const AccountHealth = () => {
  const navigate = useNavigate();

  // Mock score — wire to real data later
  const score = 98;
  const status = "Excellent";

  const stats = [
    { label: "Policy Standing", value: "Clean", icon: ShieldCheck },
    { label: "Order Reliability", value: "100%", icon: CheckCircle2 },
    { label: "Buyer Rating", value: "4.9", icon: Star },
    { label: "Trust Tier", value: "Imperial", icon: Award },
  ];

  // Arc geometry
  const radius = 120;
  const circumference = Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <AuthenticatedHeader />

      <div className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-24 pb-10 relative z-10 max-w-5xl">
        {/* Header with back */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Account Health
          </h1>
        </div>

        {/* Hero card with logo + arc */}
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 mb-6">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary/30 shadow-lg">
                  <img
                    src={appLogo}
                    alt="MercxImperium"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary font-semibold">
                    MercxImperium
                  </p>
                  <p className="text-sm text-muted-foreground">Policy Standing</p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                You're in great shape
                <Sparkles className="w-5 h-5 text-primary" />
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your account follows our{" "}
                <button className="text-primary underline-offset-2 hover:underline">
                  Community Guidelines
                </button>
                . Violations would appear here for 180 days. Keep up the
                excellent activity to maintain your Imperial standing.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> No Violations
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-secondary/40 text-foreground font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> Rising Trust
                </span>
              </div>
            </div>

            {/* Animated arc gauge */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-[260px] h-[150px]">
                <svg
                  viewBox="0 0 280 160"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary-foreground))" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 20 140 A ${radius} ${radius} 0 0 1 260 140`}
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 20 140 A ${radius} ${radius} 0 0 1 260 140`}
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                    style={{
                      transition: "stroke-dasharray 1.2s ease-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">
                    {score}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="p-4 border-border bg-card/80 backdrop-blur hover:border-primary/40 transition-colors"
            >
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground mt-0.5">
                {s.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Violations panel */}
        <Card className="overflow-hidden border-border">
          <div className="grid grid-cols-5 px-4 sm:px-6 py-3 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Violation</span>
            <span>Impact</span>
            <span>Date</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary/20 shadow-md mb-4">
              <img
                src={appLogo}
                alt="MercxImperium"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-foreground">
              No violations on record
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              You're holding court with honour. Keep shipping on time and
              treating buyers kindly to stay Imperial.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountHealth;

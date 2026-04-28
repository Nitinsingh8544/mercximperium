import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCredits } from "@/hooks/useCredits";
import { ArrowLeft, Coins, Gift, ShoppingBag, Sparkles } from "lucide-react";

const Credits = () => {
  const navigate = useNavigate();
  const { credits, creditsToRupees } = useCredits();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <AuthenticatedHeader />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Credits</h1>
        </div>

        {/* Credits balance card */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 opacity-90 text-sm mb-2">
              <Coins className="h-4 w-4" />
              Credit Points
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl sm:text-5xl font-bold">
                {credits.toLocaleString("en-IN")}
              </span>
              <span className="text-base sm:text-lg opacity-90">
                ≈ ₹{creditsToRupees(credits).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-3">5 credits = ₹1 · Use credits at checkout for instant savings</p>
          </CardContent>
        </Card>

        {/* How credits work */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">How credits work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Gift className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Welcome bonus</p>
                <p className="text-xs text-muted-foreground">Every new user gets <span className="font-semibold text-foreground">1,000 credits</span> on sign-up.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <div className="h-9 w-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Earn more</p>
                <p className="text-xs text-muted-foreground">Earn <span className="font-semibold text-foreground">1 credit for every ₹5</span> you spend on MercxImperium.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Spend at checkout</p>
                <p className="text-xs text-muted-foreground">Apply credits at checkout — used credits are deducted from your balance.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/browse")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Shop & earn credits
          </Button>
          <Badge variant="outline" className="text-xs px-3 py-1.5">
            Credits never expire
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Credits;

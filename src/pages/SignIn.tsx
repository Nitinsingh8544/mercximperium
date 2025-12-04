import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Vibrant animated background matching landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-primary/15 animate-gradient bg-[length:200%_200%]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/50 via-secondary/20 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/50 via-primary/20 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-tr from-hero-brown/10 via-transparent to-hero-green/10 animate-gradient-shift" />
      
      <Header />
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20 flex items-center justify-center relative z-10">
        <Card className="w-full max-w-sm backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-xl sm:text-2xl">Log in</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Welcome back to MercxImperium</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Email Input */}
              <div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input with Toggle */}
              <div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Log In Button */}
              <Button variant="hero" className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Log in"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#007BFF] hover:underline font-medium">
                Sign up!
              </Link>
            </p>

            {/* Forgot Password Link */}
            <p className="text-center">
              <Link to="/forgot-password" className="text-sm text-[#007BFF] hover:underline">
                Forgot your password?
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;

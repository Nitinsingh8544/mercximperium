import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

interface Category {
  key: string;
  label: string;
  desc: string;
  subs: { key: string; label: string; desc: string }[];
}

const CATEGORIES: Category[] = [
  {
    key: "live_emergency",
    label: "Live Emergency",
    desc: "Active emergency involving death or serious bodily harm appears to be occurring",
    subs: [
      { key: "self_harm", label: "Self-harm or suicide", desc: "User threatening self-harm or suicide" },
      { key: "violence", label: "Violence or threats", desc: "Active violence or credible threats" },
    ],
  },
  {
    key: "inappropriate",
    label: "Inappropriate content",
    desc: "Explicit content, nudity, sharing private info",
    subs: [
      { key: "nudity", label: "Nudity or sexual content", desc: "Sexually explicit content" },
      { key: "hate", label: "Hate speech", desc: "Targeting based on identity" },
      { key: "private_info", label: "Sharing private info", desc: "Personal data without consent" },
    ],
  },
  {
    key: "prohibited",
    label: "Selling prohibited items",
    desc: "Illicit drugs, counterfeits, products not allowed on MercxImperium",
    subs: [
      { key: "counterfeit", label: "Counterfeit goods", desc: "Fake or replica products" },
      { key: "drugs", label: "Illegal drugs", desc: "Illicit substances" },
      { key: "weapons", label: "Weapons", desc: "Prohibited weapons or accessories" },
    ],
  },
  {
    key: "integrity",
    label: "Account Integrity",
    desc: "Account dedicated to impersonation, ban evasion, scams, or fraudulent activity",
    subs: [
      { key: "fraudulent_listing", label: "Fraudulent listing", desc: "Sellers may not use stolen photos in their listings, or list items they do not own or intend to fulfill." },
      { key: "enforcement_evasion", label: "Enforcement Evasion", desc: "Users may not attempt to evade bans, or sell, purchase, or share access to their accounts with others" },
      { key: "impersonation", label: "Impersonation", desc: "Users are prohibited from impersonating others, misrepresenting themselves, or otherwise engaging in deceptive account practices." },
      { key: "sensitive_info", label: "Asking for sensitive information", desc: "Attempt to obtain sensitive information or send deceptive links or messages." },
    ],
  },
  {
    key: "youth_safety",
    label: "Youth safety",
    desc: "Underage user or child safety concerns",
    subs: [
      { key: "underage", label: "Underage user", desc: "User appears to be a minor" },
      { key: "child_safety", label: "Child safety concern", desc: "Content endangering minors" },
    ],
  },
  {
    key: "product_abuse",
    label: "MercxImperium Product Abuse",
    desc: "Abuse of platform products, features, or processes",
    subs: [
      { key: "spam", label: "Spam or scams", desc: "Repeated unwanted messages or scams" },
      { key: "review_abuse", label: "Review abuse", desc: "Fake or manipulative reviews" },
    ],
  },
];

type Step = "category" | "sub" | "detail";

const ReportUserModal = ({ isOpen, onClose, username }: Props) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState<Category | null>(null);
  const [sub, setSub] = useState<Category["subs"][number] | null>(null);
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setStep("category");
    setCategory(null);
    setSub(null);
    setDetail("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!user || !category || !sub) return;
    setBusy(true);
    const { error } = await supabase.from("user_reports").insert({
      user_id: user.id,
      category: category.label,
      subject: sub.label,
      description: detail.trim() || sub.desc,
      related_user: username,
      status: "open",
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Report submitted", description: "Thanks — we'll review it shortly." });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => (!o ? handleClose() : null)}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-2 relative">
          {step !== "category" && (
            <button
              onClick={() => (step === "sub" ? setStep("category") : setStep("sub"))}
              className="absolute top-5 left-5 w-9 h-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
          )}
          <h3 className="text-center text-base font-semibold text-foreground">
            Report User "{username}"
          </h3>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {step === "category" && "Select a problem to report"}
            {step === "sub" && category?.label}
            {step === "detail" && sub?.label}
          </p>
        </div>

        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {step === "category" && (
            <ul className="divide-y divide-border">
              {CATEGORIES.map((c) => (
                <li key={c.key}>
                  <button
                    className="w-full text-left py-4 flex items-start justify-between gap-3 hover:opacity-80"
                    onClick={() => {
                      setCategory(c);
                      setStep("sub");
                    }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{c.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === "sub" && category && (
            <ul className="divide-y divide-border">
              {category.subs.map((s) => (
                <li key={s.key}>
                  <button
                    className="w-full text-left py-4 flex items-start justify-between gap-3 hover:opacity-80"
                    onClick={() => {
                      setSub(s);
                      setStep("detail");
                    }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{s.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === "detail" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Please provide additional information to submit your report.
              </p>
              <Textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Describe what happened…"
                className="min-h-[140px]"
                maxLength={1000}
              />
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-2 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleClose}
            disabled={busy}
          >
            Cancel
          </Button>
          {step === "detail" && (
            <Button
              className="flex-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={submit}
              disabled={busy || !detail.trim()}
            >
              Continue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserModal;

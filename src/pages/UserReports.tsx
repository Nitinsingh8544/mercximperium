import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Report {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  related_user: string | null;
  related_order_id: string | null;
  admin_response: string | null;
  created_at: string;
}

const CATEGORIES = [
  "Fraudulent Seller",
  "Inappropriate Content",
  "Harassment / Abuse",
  "Counterfeit Product",
  "Payment / Transaction Issue",
  "Order / Delivery Issue",
  "Technical Bug",
  "Other",
];

const STATUS_META: Record<string, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30" },
  in_review: { label: "In Review", className: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
  resolved: { label: "Resolved", className: "bg-green-500/15 text-green-700 border-green-500/30" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
};

const UserReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: "",
    subject: "",
    description: "",
    related_user: "",
    related_order_id: "",
  });

  const fetchReports = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.category || !form.subject || !form.description) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("user_reports").insert({
      user_id: user.id,
      category: form.category,
      subject: form.subject,
      description: form.description,
      related_user: form.related_user || null,
      related_order_id: form.related_order_id || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit report", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Report submitted", description: "Our team will review it shortly." });
    setForm({ category: "", subject: "", description: "", related_user: "", related_order_id: "" });
    setShowForm(false);
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      <div className="container mx-auto max-w-4xl px-4 pt-28 md:pt-24 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <AlertTriangle className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold flex-1">User Reports</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> New Report
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="p-5 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject *</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary" />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Provide details about the issue" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Related User (optional)</Label>
                  <Input value={form.related_user} onChange={(e) => setForm({ ...form, related_user: e.target.value })} placeholder="@username" />
                </div>
                <div>
                  <Label>Related Order ID (optional)</Label>
                  <Input value={form.related_order_id} onChange={(e) => setForm({ ...form, related_order_id: e.target.value })} placeholder="Order ID" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Report"}</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          {reports.length === 0 && !showForm && (
            <Card className="p-10 text-center text-muted-foreground">
              No reports yet. Click "New Report" to file one.
            </Card>
          )}
          {reports.map((r) => {
            const meta = STATUS_META[r.status] ?? STATUS_META.open;
            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{r.category}</div>
                    <h3 className="font-semibold truncate">{r.subject}</h3>
                  </div>
                  <Badge variant="outline" className={meta.className}>{meta.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.description}</p>
                {(r.related_user || r.related_order_id) && (
                  <div className="text-xs text-muted-foreground mt-2 flex gap-3">
                    {r.related_user && <span>User: {r.related_user}</span>}
                    {r.related_order_id && <span>Order: {r.related_order_id}</span>}
                  </div>
                )}
                {r.admin_response && (
                  <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                    <div className="text-xs font-semibold mb-1">Support Response</div>
                    {r.admin_response}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserReports;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_response: string | null;
  created_at: string;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30" },
  read: { label: "Read", className: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
  responded: { label: "Responded", className: "bg-green-500/15 text-green-700 border-green-500/30" },
};

const ContactUs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: profile?.name || profile?.username || f.name,
      email: user?.email || f.email,
    }));
  }, [user, profile]);

  const fetchMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user.id,
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Message sent", description: "We'll get back to you within 24-48 hours." });
    setForm({ ...form, subject: "", message: "" });
    fetchMessages();
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      <div className="container mx-auto max-w-5xl px-4 pt-28 md:pt-24 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <MessageSquare className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5">
              <h2 className="font-semibold mb-4">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Subject *</Label>
                  <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                </div>
                <div>
                  <Label>Message *</Label>
                  <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." />
                </div>
                <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            {messages.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Your conversations</h2>
                <div className="space-y-3">
                  {messages.map((m) => {
                    const meta = STATUS_META[m.status] ?? STATUS_META.new;
                    return (
                      <Card key={m.id} className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold">{m.subject}</h3>
                          <Badge variant="outline" className={meta.className}>{meta.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
                        {m.admin_response && (
                          <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                            <div className="text-xs font-semibold mb-1">Support Response</div>
                            {m.admin_response}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(m.created_at).toLocaleString()}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h2 className="font-semibold mb-4">Reach us directly</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <a href="mailto:support@mercximperium.com" className="text-muted-foreground hover:text-primary">
                      support@mercximperium.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <a href="tel:+911800000000" className="text-muted-foreground hover:text-primary">
                      +91 1800-000-000
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Office</div>
                    <p className="text-muted-foreground">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold mb-2">Support hours</h2>
              <p className="text-sm text-muted-foreground">
                Monday–Saturday<br />9:00 AM – 9:00 PM IST
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                We typically respond within 24-48 hours.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

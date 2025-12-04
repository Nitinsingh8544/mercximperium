import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";

const Messages = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Inbox
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost">
              <MessageSquare className="w-4 h-4 mr-2" />
              Compose
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <AlertDescription className="text-sm text-amber-900 dark:text-amber-200">
            ⓘ Messages from MercxImperium, employees of MercxImperium, or outside partners like postal carriers will never be sent here.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="newest" className="w-full">
          <TabsList className="w-full sm:w-auto mb-6 bg-muted">
            <TabsTrigger value="newest">Newest</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>

          <TabsContent value="newest" className="space-y-4">
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No messages
              </h3>
              <p className="text-sm text-muted-foreground">
                When you have messages, they'll appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            <div className="text-center py-20">
              <p className="text-muted-foreground">No purchase-related messages</p>
            </div>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <div className="text-center py-20">
              <p className="text-muted-foreground">No unread messages</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Messages;

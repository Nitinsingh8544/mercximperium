import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Bell } from "lucide-react";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
          Notifications
        </h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto mb-6 bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="buyer">Buyer</TabsTrigger>
            <TabsTrigger value="important">Important</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nothing to see here...
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                All new notifications will appear in this tab. For now, you're all caught up!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="buyer" className="space-y-4">
            <div className="text-center py-20">
              <p className="text-muted-foreground">No buyer notifications</p>
            </div>
          </TabsContent>

          <TabsContent value="important" className="space-y-4">
            <div className="text-center py-20">
              <p className="text-muted-foreground">No important notifications</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;

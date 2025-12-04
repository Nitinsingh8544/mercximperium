import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Users } from "lucide-react";

const Activity = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Activity
          </h1>
          <Button variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            Friends
          </Button>
        </div>

        <Tabs defaultValue="purchases" className="w-full">
          <TabsList className="w-full sm:w-auto mb-6 bg-muted">
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <Tabs defaultValue="orders">
                <TabsList className="bg-background">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="community">Community Boost</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No orders</p>
              <Button variant="outline" className="mt-6">
                Download Orders History
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No active bids</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your bids on items will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No offers</p>
              <p className="text-sm text-muted-foreground mt-2">
                Offers you make will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No saved items</p>
              <p className="text-sm text-muted-foreground mt-2">
                Save items you're interested in to view them later
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Activity;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Users, Trash2, ShoppingCart, ShoppingBag, Minus, Plus } from "lucide-react";
import { useAuctionBids } from "@/hooks/useAuctionBids";
import { useCart, type CartItem } from "@/hooks/useCart";

const Activity = () => {
  const navigate = useNavigate();
  const { wonBids } = useAuctionBids();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === cartItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(cartItems.map((i) => i.id)));
  };

  const cartItemToCheckoutItem = (item: CartItem) => ({
    title: item.product_title,
    image: item.product_image || "",
    price: Number(item.product_price),
    originalPrice: Number(item.product_original_price ?? item.product_price),
    currency: item.product_currency || "₹",
    quantity: item.quantity,
    sellerName: item.seller_name || "",
    color: "",
    size: "",
  });

  const handleBuySingle = (item: CartItem) => {
    navigate("/checkout", { state: cartItemToCheckoutItem(item) });
  };

  const handleBuySelected = () => {
    const items = cartItems.filter((i) => selectedIds.has(i.id)).map(cartItemToCheckoutItem);
    if (items.length === 0) return;
    navigate("/checkout", { state: { items } });
  };

  const selectedTotal = useMemo(
    () =>
      cartItems
        .filter((i) => selectedIds.has(i.id))
        .reduce((sum, i) => sum + Number(i.product_price) * i.quantity, 0),
    [cartItems, selectedIds]
  );

  const selectedCurrency = cartItems.find((i) => selectedIds.has(i.id))?.product_currency || "₹";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />

      <AuthenticatedHeader />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Activity</h1>
          <Button variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            Friends
          </Button>
        </div>

        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="w-full sm:w-auto mb-6 bg-muted">
            <TabsTrigger value="cart" className="gap-1">
              <ShoppingCart className="h-3.5 w-3.5" />
              My Cart
              {cartItems.length > 0 && (
                <span className="ml-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {cartItems.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add items from live streams to see them here</p>
              </div>
            ) : (
              <>
                {/* Multi-select toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="select-all"
                      checked={selectedIds.size === cartItems.length && cartItems.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium text-foreground cursor-pointer">
                      Select all ({cartItems.length})
                    </label>
                    {selectedIds.size > 0 && (
                      <span className="text-sm text-muted-foreground">
                        • {selectedIds.size} selected · {selectedCurrency}{selectedTotal.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handleBuySelected}
                    disabled={selectedIds.size === 0}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Buy Selected ({selectedIds.size})
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cartItems.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        isSelected={isSelected}
                        onToggleSelect={() => toggleSelect(item.id)}
                        onSellerClick={() => navigate(`/seller/${encodeURIComponent(item.seller_name!)}`)}
                        onQtyChange={(q) => updateQuantity(item.id, q)}
                        onRemove={() => removeFromCart(item.id)}
                        onBuy={() => handleBuySingle(item)}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {wonBids.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-2">Items you win in auctions will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wonBids.map((bid) => (
                  <Card key={bid.id} className="overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {bid.item_image && (
                        <img src={bid.item_image} alt={bid.item_name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-1">{bid.item_name}</h3>
                      {bid.item_description && (
                        <p className="text-xs text-muted-foreground mb-2">{bid.item_description}</p>
                      )}
                      <p className="text-lg font-bold text-secondary">₹{Number(bid.bid_amount).toLocaleString("en-IN")}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Won on {new Date(bid.created_at).toLocaleDateString()}
                      </p>
                      {bid.seller_name && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={bid.seller_image || undefined} />
                            <AvatarFallback className="text-xs bg-muted">
                              {bid.seller_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{bid.seller_name}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Activity;

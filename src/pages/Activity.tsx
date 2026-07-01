import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Trash2, ShoppingCart, ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  product_title: string;
  product_image: string | null;
  product_price: number;
  product_currency: string;
  quantity: number;
  seller_name: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  ordered: { label: "Ordered", className: "bg-muted text-foreground" },
  packed: { label: "Packed", className: "bg-secondary/20 text-secondary-foreground" },
  shipped: { label: "Shipped", className: "bg-primary/20 text-primary" },
  out_for_delivery: { label: "Out for Delivery", className: "bg-primary/20 text-primary" },
  delivered: { label: "Delivered", className: "bg-green-500/20 text-green-700 dark:text-green-400" },
  cancelled: { label: "Cancelled", className: "bg-destructive/20 text-destructive" },
};

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onSellerClick: () => void;
  onQtyChange: (quantity: number) => void;
  onRemove: () => void;
  onBuy: () => void;
}

const CartItemCard = ({
  item,
  isSelected,
  onToggleSelect,
  onSellerClick,
  onQtyChange,
  onRemove,
  onBuy,
}: CartItemCardProps) => {
  const images = useMemo(() => [item.product_image].filter(Boolean) as string[], [item.product_image]);
  const [imgIndex, setImgIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const goPrev = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setImgIndex((i) => (i + 1) % images.length);

  return (
    <Card className={`overflow-hidden transition-colors ${isSelected ? "border-primary ring-1 ring-primary" : ""}`}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <div className="absolute top-1.5 left-1.5 z-10 bg-background/90 rounded p-0.5">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} className="h-3.5 w-3.5" />
        </div>
        {images.length > 0 && (
          <img src={images[imgIndex]} alt={item.product_title} className="w-full h-full object-cover" />
        )}
        {hasMultiple && (
          <>
            <button type="button" onClick={goPrev} aria-label="Previous"
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full h-5 w-5 flex items-center justify-center shadow">
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button type="button" onClick={goNext} aria-label="Next"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full h-5 w-5 flex items-center justify-center shadow">
              <ChevronRight className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      <div className="h-px bg-border" />

      <CardContent className="p-2 space-y-1.5">
        {item.seller_name && (
          <button type="button" onClick={onSellerClick} className="flex items-center gap-1 group w-full">
            <Avatar className="h-4 w-4">
              <AvatarFallback className="text-[8px] bg-muted">
                {item.seller_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary group-hover:underline truncate">
              {item.seller_name}
            </span>
          </button>
        )}

        <h3 className="font-semibold text-foreground text-xs line-clamp-1">{item.product_title}</h3>

        <div className="flex items-center justify-between gap-1.5">
          <span className="text-xs font-bold text-secondary">
            {item.product_currency}{Number(item.product_price).toLocaleString()}
          </span>
          <div className="flex items-center border border-border rounded">
            <Button variant="ghost" size="icon" className="h-5 w-5"
              onClick={() => onQtyChange(item.quantity - 1)} disabled={item.quantity <= 1}>
              <Minus className="h-2.5 w-2.5" />
            </Button>
            <span className="w-5 text-center text-[10px] font-medium">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-5 w-5"
              onClick={() => onQtyChange(item.quantity + 1)}>
              <Plus className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-1.5 pt-1.5 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] text-destructive hover:text-destructive px-1" onClick={onRemove}>
            <Trash2 className="h-3 w-3 mr-1" /> Remove
          </Button>
          <Button size="sm" className="flex-1 h-7 text-[10px] bg-primary hover:bg-primary/90 text-primary-foreground px-1" onClick={onBuy}>
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Activity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
    })();
  }, [user]);

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

      <div className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-24 pb-8 relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Activity</h1>
        </div>

        <Tabs defaultValue="cart" className="w-full">
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <TabsList className="bg-muted">
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
          </div>

          <TabsContent value="cart" className="space-y-4">
            {cartItems.length > 0 && (
              <div className="flex items-center justify-end gap-2">
                {selectedIds.size > 0 && (
                  <Button onClick={handleBuySelected} size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Buy ({selectedIds.size}) · {selectedCurrency}{selectedTotal.toLocaleString()}
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-8" onClick={toggleSelectAll}>
                  {selectedIds.size === cartItems.length ? "Deselect All" : "Select"}
                </Button>
              </div>
            )}
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add items from live streams to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    onToggleSelect={() => toggleSelect(item.id)}
                    onSellerClick={() => navigate(`/seller/${encodeURIComponent(item.seller_name!)}`)}
                    onQtyChange={(q) => updateQuantity(item.id, q)}
                    onRemove={() => removeFromCart(item.id)}
                    onBuy={() => handleBuySingle(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-8">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-2">Items you buy will appear here</p>
              </div>
            ) : (
              <>
                {(() => {
                  const activeOrders = orders.filter((o) => o.status !== "delivered");
                  const deliveredOrders = orders.filter((o) => o.status === "delivered");
                  return (
                    <>
                      <section className="space-y-3">
                        <h2 className="text-lg font-semibold text-foreground">Active Orders</h2>
                        {activeOrders.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No active orders.</p>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {activeOrders.map((order) => {
                              const meta = STATUS_META[order.status] || STATUS_META.ordered;
                              return (
                                <Card
                                  key={order.id}
                                  className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                  <div className="relative aspect-square overflow-hidden bg-muted">
                                    {order.product_image && (
                                      <img src={order.product_image} alt={order.product_title} className="w-full h-full object-cover" />
                                    )}
                                    <Badge className={`absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 border-0 ${meta.className}`}>
                                      {meta.label}
                                    </Badge>
                                  </div>
                                  <CardContent className="p-2">
                                    <h3 className="font-semibold text-foreground text-xs line-clamp-1">{order.product_title}</h3>
                                    <p className="text-sm font-bold text-secondary mt-0.5">
                                      {order.product_currency}{Number(order.total_amount).toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground mt-0.5">
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    {order.seller_name && (
                                      <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-border">
                                        <Avatar className="h-4 w-4">
                                          <AvatarFallback className="text-[8px] bg-muted">
                                            {order.seller_name.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-[10px] text-muted-foreground truncate">{order.seller_name}</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </section>

                      <section className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-foreground">Delivered Orders</h2>
                          {deliveredOrders.length > 0 && (
                            <span className="text-xs text-muted-foreground">{deliveredOrders.length} item{deliveredOrders.length > 1 ? "s" : ""}</span>
                          )}
                        </div>
                        {deliveredOrders.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No delivered orders yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {deliveredOrders.map((order) => {
                              const deliveredAt = new Date(order.updated_at || order.created_at);
                              return (
                                <Card
                                  key={order.id}
                                  className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                  <div className="flex items-stretch gap-3 p-2">
                                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                                      {order.product_image && (
                                        <img src={order.product_image} alt={order.product_title} className="w-full h-full object-cover" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                      <div>
                                        <div className="flex items-start justify-between gap-2">
                                          <h3 className="font-semibold text-foreground text-sm line-clamp-1">{order.product_title}</h3>
                                          <Badge className={`shrink-0 text-[9px] px-1.5 py-0.5 border-0 ${STATUS_META.delivered.className}`}>
                                            Delivered
                                          </Badge>
                                        </div>
                                        {order.seller_name && (
                                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                            Sold by {order.seller_name}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-end justify-between gap-2 mt-1.5">
                                        <div className="text-[11px] text-muted-foreground">
                                          <p>Qty: <span className="text-foreground font-medium">{order.quantity}</span></p>
                                          <p>
                                            Delivered on{" "}
                                            <span className="text-foreground font-medium">
                                              {deliveredAt.toLocaleDateString()} · {deliveredAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                          </p>
                                        </div>
                                        <span className="text-sm font-bold text-secondary whitespace-nowrap">
                                          {order.product_currency}{Number(order.total_amount).toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    </>
                  );
                })()}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Activity;

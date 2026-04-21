import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Users, Trash2, ShoppingCart, ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuctionBids } from "@/hooks/useAuctionBids";
import { useCart, type CartItem } from "@/hooks/useCart";

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
  const images = useMemo(() => {
    const arr = [item.product_image].filter(Boolean) as string[];
    return arr;
  }, [item.product_image]);

  const [imgIndex, setImgIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const goPrev = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setImgIndex((i) => (i + 1) % images.length);

  return (
    <Card
      className={`overflow-hidden transition-colors ${isSelected ? "border-primary ring-1 ring-primary" : ""}`}
    >
      <div className="relative aspect-[65/35] overflow-hidden bg-muted">
        <div className="absolute top-2 left-2 z-10 bg-background/90 rounded-md p-1">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
        </div>
        {images.length > 0 && (
          <img
            src={images[imgIndex]}
            alt={item.product_title}
            className="w-full h-full object-cover"
          />
        )}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full h-7 w-7 flex items-center justify-center shadow"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full h-7 w-7 flex items-center justify-center shadow"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-background/70 rounded-full px-2 py-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => setImgIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIndex ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        {/* 1. Seller profile */}
        {item.seller_name && (
          <button
            type="button"
            onClick={onSellerClick}
            className="flex items-center gap-2 group w-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm bg-muted">
                {item.seller_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary group-hover:underline">
              {item.seller_name}
            </span>
          </button>
        )}

        {/* 2. Description / title */}
        <h3 className="font-semibold text-foreground text-sm line-clamp-2">
          {item.product_title}
        </h3>

        {/* 3. Amount */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-secondary">
            {item.product_currency}
            {Number(item.product_price).toLocaleString()}
          </span>
          {item.product_original_price && (
            <span className="text-xs text-muted-foreground line-through">
              {item.product_currency}
              {Number(item.product_original_price).toLocaleString()}
            </span>
          )}
        </div>

        {/* 4. Quantity */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Qty</span>
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onQtyChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onQtyChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* 5. Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Remove
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onBuy}
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

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
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <Button
                onClick={handleBuySelected}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy ({selectedIds.size}) · {selectedCurrency}{selectedTotal.toLocaleString()}
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (selectedIds.size === cartItems.length && cartItems.length > 0) {
                  setSelectedIds(new Set());
                } else {
                  setSelectedIds(new Set(cartItems.map((i) => i.id)));
                }
              }}
            >
              {selectedIds.size === cartItems.length && cartItems.length > 0 ? "Deselect All" : "Select"}
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="w-4 h-4" />
              Friends
            </Button>
          </div>
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

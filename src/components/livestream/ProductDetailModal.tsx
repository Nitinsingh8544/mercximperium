import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Truck, ShieldCheck, RotateCcw, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  sellerName?: string;
  sellerAvatar?: string;
}

const sizes = ["S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Black", value: "bg-black" },
  { name: "White", value: "bg-white border border-border" },
  { name: "Navy", value: "bg-blue-900" },
  { name: "Red", value: "bg-red-600" },
  { name: "Grey", value: "bg-gray-400" },
];

const ProductDetailModal = ({ isOpen, onClose, product, sellerName = "Seller", sellerAvatar }: ProductDetailModalProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = async () => {
    const result = await addToCart({
      product_title: product.title,
      product_image: product.image,
      product_price: product.price,
      product_original_price: product.originalPrice,
      product_currency: product.currency,
      quantity,
      seller_name: sellerName,
    });

    if (!result.error) {
      toast({ title: "Added to cart!", description: `${product.title} x${quantity} added to your cart.` });
    } else {
      toast({ title: "Error", description: "Please sign in to add items to cart.", variant: "destructive" });
    }
  };

  const handleBuyNow = () => {
    toast({ title: "Order placed!", description: `You purchased ${product.title} for ${product.currency}${product.price.toLocaleString()}.` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-6 flex flex-col items-center bg-muted/30">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-background">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground leading-tight">{product.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Sold by <span className="text-primary font-medium">{sellerName}</span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="h-3.5 w-3.5 fill-muted text-muted" />
                <span className="text-xs text-muted-foreground ml-1">(128)</span>
              </div>
            </div>

            <Separator />

            <div>
              {discount > 0 && (
                <Badge variant="destructive" className="mb-2 text-xs">Limited time deal</Badge>
              )}
              <div className="flex items-baseline gap-2">
                {discount > 0 && <span className="text-destructive font-medium text-sm">-{discount}%</span>}
                <span className="text-2xl font-bold text-foreground">{product.currency}{product.price.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  M.R.P.: <span className="line-through">{product.currency}{product.originalPrice.toLocaleString()}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
            </div>

            <Separator />

            {/* Color selector */}
            <div>
              <span className="text-sm font-medium text-foreground">Color: <span className="font-normal text-muted-foreground">{selectedColor}</span></span>
              <div className="flex items-center gap-2 mt-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-7 h-7 rounded-full ${color.value} ${selectedColor === color.name ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""} transition-all`}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <span className="text-sm font-medium text-foreground">Size:</span>
              <div className="flex items-center gap-2 mt-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center text-center gap-1 p-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-2">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">10 days Returnable</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-2">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Top Brand</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground font-medium">Quantity:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-border rounded-md px-2 py-1 text-sm bg-background text-foreground"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;

import { useState, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Truck, ShieldCheck, RotateCcw, Heart, ChevronLeft, ChevronRight } from "lucide-react";
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

const colorVariants = [
  {
    name: "Black",
    swatch: "bg-black",
    image: null as string | null,
  },
  {
    name: "White",
    swatch: "bg-white border border-border",
    image: null as string | null,
  },
  {
    name: "Navy",
    swatch: "bg-blue-900",
    image: null as string | null,
  },
  {
    name: "Red",
    swatch: "bg-red-600",
    image: null as string | null,
  },
  {
    name: "Grey",
    swatch: "bg-gray-400",
    image: null as string | null,
  },
];

// Simulated stock per variant combo
const getStockForVariant = (color: string, size: string): number => {
  const hash = (color.length * 7 + size.length * 13) % 20;
  if (hash < 3) return 0;
  return hash;
};

const ProductDetailModal = ({ isOpen, onClose, product, sellerName = "Seller", sellerAvatar }: ProductDetailModalProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  // Generate multiple product images (simulating different angles)
  const productImages = [
    product.image,
    product.image.replace("w=200", "w=400"),
    product.image.replace("w=200", "w=600"),
  ];

  // Generate variant images based on color
  const variantImages = colorVariants.map((c) => ({
    ...c,
    image: product.image + `&sat=${c.name === "Black" ? "-100" : c.name === "Navy" ? "50" : "0"}`,
  }));

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const stock = getStockForVariant(selectedColor, selectedSize);
  const maxQuantity = Math.min(stock, 5);

  const handleAddToCart = async () => {
    if (stock === 0) {
      toast({ title: "Out of stock", description: "This variant is currently unavailable.", variant: "destructive" });
      return;
    }
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
    if (stock === 0) {
      toast({ title: "Out of stock", description: "This variant is currently unavailable.", variant: "destructive" });
      return;
    }
    toast({ title: "Order placed!", description: `You purchased ${product.title} for ${product.currency}${product.price.toLocaleString()}.` });
    onClose();
  };

  const prevImage = () => setCurrentImageIndex((i) => (i > 0 ? i - 1 : productImages.length - 1));
  const nextImage = () => setCurrentImageIndex((i) => (i < productImages.length - 1 ? i + 1 : 0));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: Image section */}
          <div className="p-6 flex flex-col items-center bg-muted/30">
            {/* Main image with nav arrows */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-background">
              <img src={productImages[currentImageIndex]} alt={product.title} className="w-full h-full object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
              {productImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Variant thumbnails */}
            <div className="mt-3 w-full">
              <p className="text-xs text-muted-foreground mb-2">Variants</p>
              <div className="relative group/variants">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1" id="variant-scroll">
                  {variantImages.map((v, idx) => (
                    <button
                      key={v.name}
                      className={`shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                        selectedColor === v.name ? "border-primary" : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => {
                        setSelectedColor(v.name);
                        setQuantity(1);
                      }}
                    >
                      <div className={`w-full h-full ${v.swatch} flex items-center justify-center`}>
                        <span className="text-[8px] font-medium" style={{ color: v.name === "Black" || v.name === "Navy" ? "white" : "black" }}>{v.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
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
                {colorVariants.map((color) => (
                  <button
                    key={color.name}
                    className={`w-7 h-7 rounded-full ${color.swatch} ${selectedColor === color.name ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""} transition-all`}
                    onClick={() => { setSelectedColor(color.name); setQuantity(1); }}
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
                    onClick={() => { setSelectedSize(size); setQuantity(1); }}
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

            {/* Quantity - dynamic based on stock */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground font-medium">Quantity:</span>
              {stock === 0 ? (
                <span className="text-sm text-destructive font-medium">Out of Stock</span>
              ) : (
                <>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-border rounded-md px-2 py-1 text-sm bg-background text-foreground"
                  >
                    {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">({stock} available)</span>
                </>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <Button
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                onClick={handleAddToCart}
                disabled={stock === 0}
              >
                Add to Cart
              </Button>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={handleBuyNow}
                disabled={stock === 0}
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

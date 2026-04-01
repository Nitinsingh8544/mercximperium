import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Minus, Plus } from "lucide-react";
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

// Multi-angle images per product category (based on keywords in title)
const getProductImages = (product: Product): string[] => {
  const t = product.title.toLowerCase();
  if (t.includes("shoe") || t.includes("sneaker") || t.includes("air max") || t.includes("high top") || t.includes("running")) {
    return [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    ];
  }
  if (t.includes("hoodie") || t.includes("sweat")) {
    return [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500",
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500",
    ];
  }
  if (t.includes("t-shirt") || t.includes("tee")) {
    return [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    ];
  }
  if (t.includes("jacket") || t.includes("windbreaker")) {
    return [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500",
    ];
  }
  if (t.includes("watch") || t.includes("chronograph")) {
    return [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500",
    ];
  }
  if (t.includes("necklace") || t.includes("bracelet") || t.includes("jewelry") || t.includes("pearl")) {
    return [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
    ];
  }
  if (t.includes("book") || t.includes("novel") || t.includes("poetry") || t.includes("vinyl")) {
    return [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500",
    ];
  }
  if (t.includes("dumbbell") || t.includes("resistance") || t.includes("yoga") || t.includes("skipping") || t.includes("gym")) {
    return [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500",
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
    ];
  }
  if (t.includes("mouse") || t.includes("keyboard") || t.includes("headset") || t.includes("mousepad") || t.includes("gaming") || t.includes("earbuds")) {
    return [
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
      "https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=500",
    ];
  }
  if (t.includes("canvas") || t.includes("art") || t.includes("sculpture") || t.includes("watercolor") || t.includes("print")) {
    return [
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
    ];
  }
  if (t.includes("pant") || t.includes("jogger") || t.includes("cargo")) {
    return [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500",
    ];
  }
  return [
    product.image.replace("w=200", "w=500"),
    product.image.replace("w=200", "w=600"),
    product.image.replace("w=200", "w=700"),
  ];
};

// Color variants with multiple images per variant
const getColorVariants = (product: Product) => {
  const t = product.title.toLowerCase();
  const base = product.image.replace("w=200", "w=500");

  if (t.includes("shoe") || t.includes("sneaker") || t.includes("air max") || t.includes("high top") || t.includes("running")) {
    return [
      { name: "Black", swatch: "bg-black", thumb: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200", images: [
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
      ]},
      { name: "White", swatch: "bg-white border border-border", thumb: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=200", images: [
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
        "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=500",
      ]},
      { name: "Navy", swatch: "bg-blue-900", thumb: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200", images: [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500",
      ]},
      { name: "Red", swatch: "bg-red-600", thumb: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500",
        "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500",
      ]},
      { name: "Grey", swatch: "bg-gray-400", thumb: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200", images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      ]},
    ];
  }
  if (t.includes("hoodie") || t.includes("sweat")) {
    return [
      { name: "Black", swatch: "bg-black", thumb: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200", images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500",
      ]},
      { name: "White", swatch: "bg-white border border-border", thumb: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=200", images: [
        "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500",
        "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500",
      ]},
      { name: "Navy", swatch: "bg-blue-900", thumb: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=200", images: [
        "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      ]},
    ];
  }
  if (t.includes("t-shirt") || t.includes("tee")) {
    return [
      { name: "Black", swatch: "bg-black", thumb: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200", images: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      ]},
      { name: "White", swatch: "bg-white border border-border", thumb: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200", images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
      ]},
      { name: "Navy", swatch: "bg-blue-900", thumb: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200", images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
      ]},
      { name: "Red", swatch: "bg-red-600", thumb: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200", images: [
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500",
      ]},
    ];
  }
  // Default
  return [
    { name: "Black", swatch: "bg-black", thumb: base.replace("w=500", "w=200"), images: [base, base.replace("w=500", "w=600")] },
    { name: "White", swatch: "bg-white border border-border", thumb: base.replace("w=500", "w=200"), images: [base.replace("w=500", "w=600"), base.replace("w=500", "w=700")] },
    { name: "Navy", swatch: "bg-blue-900", thumb: base.replace("w=500", "w=200"), images: [base, base.replace("w=500", "w=700")] },
    { name: "Red", swatch: "bg-red-600", thumb: base.replace("w=500", "w=200"), images: [base.replace("w=500", "w=700"), base] },
    { name: "Grey", swatch: "bg-gray-400", thumb: base.replace("w=500", "w=200"), images: [base, base.replace("w=500", "w=600")] },
  ];
};
const getStockForVariant = (color: string, size: string): number => {
  const hash = (color.length * 7 + size.length * 13) % 20;
  if (hash < 3) return 0;
  return hash;
};

const ProductDetailModal = ({ isOpen, onClose, product, sellerName = "Seller", sellerAvatar }: ProductDetailModalProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const variantImages = getColorVariants(product);
  const selectedVariant = variantImages.find(v => v.name === selectedColor) || variantImages[0];
  const productImages = selectedVariant.images;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const stock = getStockForVariant(selectedColor, selectedSize);
  const maxQuantity = stock;

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
    onClose();
    navigate("/checkout", {
      state: {
        title: product.title,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        currency: product.currency,
        quantity,
        sellerName,
        color: selectedColor,
        size: selectedSize,
      },
    });
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
            </div>

            {/* Image dots below main image */}
            {productImages.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {productImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === idx ? "bg-primary scale-125" : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}

            {/* Variant thumbnails */}
            <div className="mt-3 w-full">
              <p className="text-xs text-muted-foreground mb-2">Variants</p>
              <div className="relative group/variants">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1" id="variant-scroll">
                  {variantImages.map((v) => (
                    <button
                      key={v.name}
                      className={`shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all relative ${
                        selectedColor === v.name ? "border-primary" : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => {
                        setSelectedColor(v.name);
                        setQuantity(1);
                        setCurrentImageIndex(0);
                      }}
                    >
                      <img src={v.thumb} alt={v.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 text-[7px] font-medium text-center bg-black/50 text-white py-0.5">{v.name}</span>
                    </button>
                  ))}
                </div>
                {variantImages.length > 3 && (
                  <div className="flex justify-center gap-1.5 mt-2">
                    {variantImages.map((v, idx) => (
                      <button
                        key={v.name}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          selectedColor === v.name ? "bg-primary scale-125" : "bg-muted-foreground/40"
                        }`}
                        onClick={() => {
                          setSelectedColor(v.name);
                          setQuantity(1);
                          document.getElementById("variant-scroll")?.children[idx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                        }}
                      />
                    ))}
                  </div>
                )}
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
              <span className="text-2xl font-bold text-foreground">{product.currency}{product.price.toLocaleString()}</span>
            </div>

            <Separator />

            {/* Color selector */}
            <div>
              <span className="text-sm font-medium text-foreground">Color: <span className="font-normal text-muted-foreground">{selectedColor}</span></span>
              <div className="flex items-center gap-2 mt-2">
                {variantImages.map((color) => (
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

            {/* Removed trust badges section */}

            <Separator />

            {/* Quantity - dynamic based on stock */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground font-medium">Quantity:</span>
              {stock === 0 ? (
                <span className="text-sm text-destructive font-medium">Out of Stock</span>
              ) : (
                <>
                  <div className="flex items-center border border-border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium text-foreground">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                      disabled={quantity >= maxQuantity}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
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

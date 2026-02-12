export interface StreamData {
  id: number;
  host: string;
  hostAvatar?: string;
  title: string;
  streamTitle: string;
  streamDate: string;
  viewers: number;
  image: string;
  products: {
    id: number;
    image: string;
    title: string;
    price: number;
    originalPrice: number;
    currency: string;
  }[];
}

export const allStreams: StreamData[] = [
  {
    id: 1,
    host: "sneakerhub",
    title: "Premium Sneakers Drop 🔥",
    streamTitle: "From Chill to Sharp: Everyday Fashion Edit",
    streamDate: "Streamed live 2 days ago",
    viewers: 177,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", title: "Premium Running Shoes - Limited Edition", price: 2499, originalPrice: 5999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=200", title: "Classic Sneakers - All Colors", price: 1899, originalPrice: 3499, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200", title: "Urban Street Sneakers", price: 1064, originalPrice: 3799, currency: "₹" },
      { id: 4, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200", title: "Retro High Tops - Classic", price: 1599, originalPrice: 2999, currency: "₹" },
      { id: 5, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200", title: "Air Max Limited Release", price: 3299, originalPrice: 6999, currency: "₹" },
    ],
  },
  {
    id: 2,
    host: "streetwearking",
    title: "Limited Edition Streetwear",
    streamTitle: "Street Style Drop: Exclusive Pieces",
    streamDate: "Streamed live 5 hours ago",
    viewers: 291,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200", title: "Nobero Printed Hoodies | 280 GSM Rich Cotton", price: 1064, originalPrice: 3799, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200", title: "Cotton Regular Fit Typography T-Shirt", price: 404, originalPrice: 799, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200", title: "Men's Sweatpants - Slim Fit", price: 895, originalPrice: 3199, currency: "₹" },
      { id: 4, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200", title: "Oversized Jacket - Urban Edition", price: 1799, originalPrice: 4299, currency: "₹" },
      { id: 5, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200", title: "Graphic Print Tee - Limited", price: 599, originalPrice: 1299, currency: "₹" },
    ],
  },
  {
    id: 3,
    host: "collectibles_pro",
    title: "Rare Collectibles + Giveaway",
    streamTitle: "Unboxing Rare Finds: Collector's Dream",
    streamDate: "Streamed live 1 day ago",
    viewers: 122,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200", title: "Vintage Watch - Gold Edition", price: 4999, originalPrice: 9999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200", title: "Classic Pocket Watch", price: 2499, originalPrice: 5999, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200", title: "Rare Book First Edition", price: 1899, originalPrice: 3999, currency: "₹" },
      { id: 4, image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200", title: "Original Art Print - Signed", price: 3499, originalPrice: 7999, currency: "₹" },
    ],
  },
  {
    id: 4,
    host: "fashionfinds",
    title: "Designer Fashion Sale 🛍️",
    streamTitle: "Designer Deals: Up to 70% Off Today!",
    streamDate: "Live now",
    viewers: 94,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200", title: "Designer Hoodie - Premium", price: 1564, originalPrice: 4799, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200", title: "Designer T-Shirt - Luxury Line", price: 804, originalPrice: 1999, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200", title: "Designer Joggers", price: 1295, originalPrice: 3999, currency: "₹" },
    ],
  },
  {
    id: 5,
    host: "vintagevault",
    title: "Vintage Treasures Collection",
    streamTitle: "Vintage Vault: Timeless Pieces",
    streamDate: "Streamed live 3 days ago",
    viewers: 135,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200", title: "Vintage Chronograph Watch", price: 5999, originalPrice: 12999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200", title: "Antique Gold Necklace", price: 3499, originalPrice: 7999, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200", title: "Rare Vinyl Collection", price: 999, originalPrice: 2499, currency: "₹" },
    ],
  },
  {
    id: 6,
    host: "urbanstyle",
    title: "Urban Style Essentials",
    streamTitle: "Urban Essentials: Must-Have Streetwear",
    streamDate: "Streamed live 6 hours ago",
    viewers: 88,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200", title: "Urban Jacket - Windbreaker", price: 1299, originalPrice: 2999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200", title: "Street Graphic Hoodie", price: 899, originalPrice: 1999, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200", title: "Cargo Pants - Olive", price: 1099, originalPrice: 2499, currency: "₹" },
    ],
  },
  {
    id: 7,
    host: "techgadgets",
    title: "Latest Tech Gadgets 📱",
    streamTitle: "Tech Unboxing: Newest Gadgets of 2026",
    streamDate: "Streamed live 1 hour ago",
    viewers: 203,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200", title: "Wireless Earbuds Pro", price: 1999, originalPrice: 4999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200", title: "Gaming Mouse RGB", price: 799, originalPrice: 1999, currency: "₹" },
    ],
  },
  {
    id: 8,
    host: "jewelryqueen",
    title: "Handmade Jewelry Collection",
    streamTitle: "Handcrafted Jewelry: Artisan Pieces",
    streamDate: "Streamed live 4 days ago",
    viewers: 156,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200", title: "Pearl Necklace - Handcrafted", price: 2999, originalPrice: 6999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200", title: "Silver Bracelet Set", price: 1499, originalPrice: 3499, currency: "₹" },
    ],
  },
];

export const getStreamById = (id: number): StreamData | undefined => {
  return allStreams.find((stream) => stream.id === id);
};

export const getDefaultStream = (): StreamData => {
  return allStreams[1]; // streetwearking as default (matches current UI)
};

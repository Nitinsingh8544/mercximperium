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
  {
    id: 9,
    host: "booklover",
    title: "Rare Book Finds 📚",
    streamTitle: "Rare Books: First Editions & Signed Copies",
    streamDate: "Streamed live 2 days ago",
    viewers: 67,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200", title: "First Edition Classic Novel", price: 1899, originalPrice: 3999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200", title: "Signed Author Collection", price: 2499, originalPrice: 5499, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=200", title: "Vintage Poetry Anthology", price: 799, originalPrice: 1599, currency: "₹" },
    ],
  },
  {
    id: 10,
    host: "fitnessgear",
    title: "Premium Gym Equipment",
    streamTitle: "Fitness Essentials: Home Gym Setup",
    streamDate: "Live now",
    viewers: 189,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200", title: "Adjustable Dumbbell Set", price: 3999, originalPrice: 7999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=200", title: "Resistance Bands Pro Kit", price: 699, originalPrice: 1499, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=200", title: "Yoga Mat Premium", price: 999, originalPrice: 2199, currency: "₹" },
      { id: 4, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200", title: "Skipping Rope Speed Pro", price: 499, originalPrice: 999, currency: "₹" },
    ],
  },
  {
    id: 11,
    host: "artcollector",
    title: "Original Art Pieces 🎨",
    streamTitle: "Art Auction: Original Paintings & Prints",
    streamDate: "Streamed live 1 day ago",
    viewers: 112,
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200", title: "Abstract Canvas - Large", price: 4999, originalPrice: 9999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200", title: "Watercolor Landscape Print", price: 1299, originalPrice: 2999, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200", title: "Modern Sculpture - Desktop", price: 2499, originalPrice: 5499, currency: "₹" },
    ],
  },
  {
    id: 12,
    host: "gamingzone",
    title: "Gaming Setup Sale",
    streamTitle: "Ultimate Gaming: Peripherals & Accessories",
    streamDate: "Streamed live 3 hours ago",
    viewers: 245,
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800",
    products: [
      { id: 1, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200", title: "RGB Gaming Mouse", price: 799, originalPrice: 1999, currency: "₹" },
      { id: 2, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200", title: "Mechanical Keyboard RGB", price: 2499, originalPrice: 4999, currency: "₹" },
      { id: 3, image: "https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=200", title: "Gaming Headset 7.1 Surround", price: 1499, originalPrice: 3499, currency: "₹" },
      { id: 4, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200", title: "Gaming Mousepad XL", price: 599, originalPrice: 1299, currency: "₹" },
    ],
  },
];

// Product data for recommended streams
export const recommendedStreamData: StreamData[] = [
  { id: 101, host: "luxuryfinds", title: "Luxury Bags & Accessories 👜", streamTitle: "Luxury Bags: Designer Collection", streamDate: "Live now", viewers: 312, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200", title: "Designer Leather Tote", price: 4999, originalPrice: 9999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200", title: "Premium Crossbody Bag", price: 2999, originalPrice: 5999, currency: "₹" },
  ]},
  { id: 102, host: "plantparadise", title: "Indoor Plants Collection 🌿", streamTitle: "Green Living: Indoor Plant Guide", streamDate: "Live now", viewers: 145, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200", title: "Monstera Deliciosa", price: 799, originalPrice: 1499, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200", title: "Snake Plant - Large", price: 599, originalPrice: 1199, currency: "₹" },
  ]},
  { id: 103, host: "audiophile", title: "Premium Headphones Sale 🎧", streamTitle: "Audio Gear: Premium Headphones", streamDate: "Live now", viewers: 198, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200", title: "Studio Monitor Headphones", price: 3499, originalPrice: 6999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200", title: "Wireless ANC Earbuds", price: 1999, originalPrice: 3999, currency: "₹" },
  ]},
  { id: 104, host: "watchcollector", title: "Vintage Watch Showcase ⌚", streamTitle: "Watch Showcase: Vintage & Luxury", streamDate: "Live now", viewers: 267, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200", title: "Vintage Chronograph", price: 7999, originalPrice: 14999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=200", title: "Classic Dress Watch", price: 4999, originalPrice: 9999, currency: "₹" },
  ]},
  { id: 105, host: "homechef", title: "Kitchen Essentials Deal 🍳", streamTitle: "Kitchen Deals: Chef's Essentials", streamDate: "Live now", viewers: 89, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200", title: "Cast Iron Skillet Set", price: 1999, originalPrice: 3999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=200", title: "Chef's Knife - Japanese Steel", price: 2499, originalPrice: 4999, currency: "₹" },
  ]},
  { id: 106, host: "skateshop", title: "Skateboard Gear Drop 🛹", streamTitle: "Skate Gear: Boards & Accessories", streamDate: "Live now", viewers: 176, image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=200", title: "Pro Skateboard Complete", price: 2999, originalPrice: 5999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1564429238961-441ea5765924?w=200", title: "Skateboard Wheels Set", price: 799, originalPrice: 1499, currency: "₹" },
  ]},
  { id: 107, host: "perfumery", title: "Fragrance Collection 🌸", streamTitle: "Fragrances: Luxury & Niche Scents", streamDate: "Live now", viewers: 134, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200", title: "Luxury Eau de Parfum", price: 3999, originalPrice: 7999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1594035910387-fea081da28f5?w=200", title: "Niche Fragrance Set", price: 2499, originalPrice: 4999, currency: "₹" },
  ]},
  { id: 108, host: "cameragear", title: "Photography Equipment 📷", streamTitle: "Camera Gear: Pro Equipment Sale", streamDate: "Live now", viewers: 221, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200", title: "Mirrorless Camera Body", price: 49999, originalPrice: 79999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=200", title: "50mm Prime Lens", price: 12999, originalPrice: 24999, currency: "₹" },
  ]},
  { id: 109, host: "vinylshop", title: "Rare Vinyl Records 🎵", streamTitle: "Vinyl Shop: Rare & Classic Records", streamDate: "Live now", viewers: 93, image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=200", title: "Classic Rock Vinyl LP", price: 1499, originalPrice: 2999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200", title: "Jazz Collection Box Set", price: 2999, originalPrice: 5999, currency: "₹" },
  ]},
  { id: 110, host: "sneakerhead", title: "Exclusive Sneaker Drops 👟", streamTitle: "Sneaker Drops: Exclusive Releases", streamDate: "Live now", viewers: 345, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", title: "Limited Edition Runner", price: 5999, originalPrice: 11999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200", title: "Retro Basketball Shoes", price: 3999, originalPrice: 7999, currency: "₹" },
  ]},
];

// Product data for explore streams
export const exploreStreamData: StreamData[] = [
  { id: 201, host: "beautybliss", title: "Skincare Routine Essentials 💄", streamTitle: "Skincare Live: Glow Up Routine", streamDate: "Live now", viewers: 234, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200", title: "Vitamin C Serum", price: 899, originalPrice: 1799, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=200", title: "Hydrating Face Mask Set", price: 599, originalPrice: 1199, currency: "₹" },
  ]},
  { id: 202, host: "outdooradv", title: "Camping Gear Mega Sale ⛺", streamTitle: "Outdoor Adventure: Camping Essentials", streamDate: "Live now", viewers: 178, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200", title: "4-Person Tent Pro", price: 4999, originalPrice: 9999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=200", title: "Camping Stove Portable", price: 1499, originalPrice: 2999, currency: "₹" },
  ]},
  { id: 203, host: "petparadise", title: "Pet Accessories Showcase 🐕", streamTitle: "Pet Paradise: Accessories & Toys", streamDate: "Live now", viewers: 145, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200", title: "Premium Dog Harness", price: 999, originalPrice: 1999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=200", title: "Interactive Pet Toy Set", price: 699, originalPrice: 1399, currency: "₹" },
  ]},
  { id: 204, host: "homedesign", title: "Home Decor Inspiration 🏠", streamTitle: "Home Decor: Interior Design Ideas", streamDate: "Live now", viewers: 198, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200", title: "Modern Table Lamp", price: 1499, originalPrice: 2999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200", title: "Decorative Throw Pillows Set", price: 899, originalPrice: 1799, currency: "₹" },
  ]},
  { id: 205, host: "musicstore", title: "Guitar Collection Sale 🎸", streamTitle: "Music Store: Guitar Collection", streamDate: "Live now", viewers: 167, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200", title: "Acoustic Guitar - Beginner", price: 3999, originalPrice: 7999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=200", title: "Guitar Strings Premium Set", price: 499, originalPrice: 999, currency: "₹" },
  ]},
  { id: 206, host: "coffeelover", title: "Specialty Coffee Beans ☕", streamTitle: "Coffee Corner: Specialty Beans", streamDate: "Live now", viewers: 89, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200", title: "Single Origin Coffee Beans", price: 699, originalPrice: 1299, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200", title: "Pour Over Coffee Kit", price: 1499, originalPrice: 2999, currency: "₹" },
  ]},
  { id: 207, host: "toyworld", title: "Collectible Figures Drop 🎮", streamTitle: "Toy World: Collectible Figures", streamDate: "Live now", viewers: 312, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200", title: "Anime Figure - Limited Edition", price: 2499, originalPrice: 4999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200", title: "Action Figure Box Set", price: 1999, originalPrice: 3999, currency: "₹" },
  ]},
  { id: 208, host: "plantmom", title: "Rare Plant Collection 🌱", streamTitle: "Plant Mom: Rare Indoor Plants", streamDate: "Live now", viewers: 134, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800", products: [
    { id: 1, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200", title: "Rare Philodendron", price: 1999, originalPrice: 3999, currency: "₹" },
    { id: 2, image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200", title: "Ceramic Plant Pot Set", price: 799, originalPrice: 1599, currency: "₹" },
  ]},
];

// Combined lookup across all stream data
const allStreamData = [...allStreams, ...recommendedStreamData, ...exploreStreamData];

export const getStreamById = (id: number): StreamData | undefined => {
  return allStreamData.find((stream) => stream.id === id);
};

export const getDefaultStream = (): StreamData => {
  return allStreams[1]; // streetwearking as default (matches current UI)
};

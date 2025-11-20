import shoppingBag from "@/assets/shopping-bag.png";
import shoppingCart from "@/assets/shopping-cart.png";
import giftBox from "@/assets/gift-box.png";
import storefront from "@/assets/storefront.png";

const AnimatedItems = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <img
        src={shoppingBag}
        alt=""
        className="absolute top-20 right-32 w-32 h-32 opacity-95 animate-float drop-shadow-2xl"
      />
      <img
        src={shoppingCart}
        alt=""
        className="absolute top-48 right-16 w-36 h-36 opacity-90 animate-float-delayed drop-shadow-2xl"
      />
      <img
        src={giftBox}
        alt=""
        className="absolute bottom-40 right-40 w-28 h-28 opacity-95 animate-float drop-shadow-2xl"
      />
      <img
        src={storefront}
        alt=""
        className="absolute bottom-20 right-20 w-40 h-40 opacity-85 animate-float-delayed drop-shadow-2xl"
      />
    </div>
  );
};

export default AnimatedItems;
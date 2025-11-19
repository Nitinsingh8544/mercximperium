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
        className="absolute top-20 right-32 w-24 h-24 opacity-90 animate-float"
      />
      <img
        src={shoppingCart}
        alt=""
        className="absolute top-48 right-16 w-28 h-28 opacity-80 animate-float-delayed"
      />
      <img
        src={giftBox}
        alt=""
        className="absolute bottom-40 right-40 w-20 h-20 opacity-90 animate-float"
      />
      <img
        src={storefront}
        alt=""
        className="absolute bottom-20 right-20 w-32 h-32 opacity-75 animate-float-delayed"
      />
    </div>
  );
};

export default AnimatedItems;
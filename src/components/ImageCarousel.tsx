import { useState, useEffect } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const images = [hero1, hero2, hero3];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto h-[200px] sm:h-[250px] md:h-[288px]">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Shopping showcase ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-700 ease-out ${
            index === currentIndex 
              ? "opacity-100 translate-x-0 scale-100" 
              : index < currentIndex
              ? "opacity-0 -translate-x-full scale-95"
              : "opacity-0 translate-x-full scale-95"
          }`}
        />
      ))}
      
      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 w-2 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

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
    <div className="relative w-full max-w-lg mx-auto h-[280px] sm:h-[320px] md:h-[360px] perspective-1000">
      {/* Multi-frame overlapping effect */}
      <div className="relative w-full h-full">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + images.length) % images.length;
          const isNext = index === (currentIndex + 1) % images.length;
          
          return (
            <div
              key={index}
              className={`absolute transition-all duration-700 ease-out ${
                isActive 
                  ? "w-[70%] h-[85%] top-[7.5%] left-[15%] z-30 opacity-100 scale-100 rotate-0" 
                  : isPrev
                  ? "w-[65%] h-[80%] top-[10%] left-[5%] z-20 opacity-70 scale-95 -rotate-6"
                  : isNext
                  ? "w-[65%] h-[80%] top-[10%] right-[5%] z-20 opacity-70 scale-95 rotate-6"
                  : "w-[60%] h-[75%] top-[12.5%] left-[20%] z-10 opacity-0 scale-90"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image}
                alt={`Shopping showcase ${index + 1}`}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl shadow-2xl border-4 border-white/90 cursor-pointer"
              />
            </div>
          );
        })}
      </div>
      
      {/* Carousel indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-muted-foreground/50 w-2 hover:bg-muted-foreground/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

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
    <div className="relative w-full max-w-md mx-auto">
      {/* Mobile phone frame with premium styling */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-20" />
        
        {/* Screen container with mobile aspect ratio */}
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[9/19.5] bg-black shadow-inner">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Shopping showcase ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                index === currentIndex 
                  ? "opacity-100 translate-x-0" 
                  : index < currentIndex
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            />
          ))}
          
          {/* Screen overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          
          {/* Carousel indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/40 w-1.5 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Phone button */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
};

export default ImageCarousel;

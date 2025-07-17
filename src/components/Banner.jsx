import { useEffect, useState } from "react";

function Banner() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506765515384-028b60a970df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
          transform: `translateY(${offsetY * 0.5}px)`,
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)"
        }}
      ></div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">Our Ideas</h1>
      </div>
    </section>
  );
}

export default Banner;

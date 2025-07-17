import { useState, useEffect } from "react";
import axios from "axios";

function Banner() {
  const [offsetY, setOffsetY] = useState(0);
  const [bannerUrl, setBannerUrl] = useState("");

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        const res = await axios.get("/api/ideas", {
          params: {
            "page[number]": 1,
            "page[size]": 1,
            append: ["medium_image"],
            sort: "-published_at"
          }
        });

        const idea = res.data.data?.[0];
        const url = idea?.medium_image?.[0]?.url;
        const fallback = "https://www.flyhpa.com/files/2017/07/2017.07.06-06.53-flyhpa-595e871fc6722.jpg";

        if (!url || url.includes("assets.suitdev.com")) {
            console.log("Using fallback banner:", fallback);
            setBannerUrl(fallback);
        } else {
            console.log("Using real image:", url);
            setBannerUrl(url);
        }

    } catch (err) {
        console.error("Failed to load banner image", err);
      }
    };

    fetchBannerImage();
  }, []);

  return (
    <section className="relative h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: `url(${bannerUrl})`,
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

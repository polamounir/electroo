import brand1 from "../../assets/images/svgs/logo1.svg";
import brand2 from "../../assets/images/svgs/logo2.svg";
import brand3 from "../../assets/images/svgs/logo3.svg";
import brand4 from "../../assets/images/svgs/logo4.svg";
import brand5 from "../../assets/images/svgs/logo5.svg";

import b1 from "../../assets/images/cat/b1.webp";
import b2 from "../../assets/images/cat/b2.webp";
import b3 from "../../assets/images/cat/b3.webp";
import b4 from "../../assets/images/cat/b4.webp";
import b5 from "../../assets/images/cat/b5.webp";
import b6 from "../../assets/images/cat/b6.webp";
import b7 from "../../assets/images/cat/b7.webp";

import "./slide.css";

export default function BrandSlider() {
  const items = [
    { brand: b1, name: "Brand 1" },
    { brand: b2, name: "Brand 2" },
    { brand: b3, name: "Brand 3" },
    { brand: b4, name: "Brand 4" },
    { brand: b5, name: "Brand 5" },
    { brand: b6, name: "Brand 6" },
    { brand: b7, name: "Brand 7" },
    { brand: b3, name: "Brand 9" },
    { brand: b4, name: "Brand 8" },
    { brand: b1, name: "Brand 11" },
    { brand: b2, name: "Brand 22" },
    { brand: b3, name: "Brand 33" },
    { brand: b4, name: "Brand 44" },
    { brand: b5, name: "Brand 55" },
    { brand: b6, name: "Brand 66" },
    { brand: b7, name: "Brand 77" },
    { brand: b3, name: "Brand 99" },
    { brand: b4, name: "Brand 88" },
  ];

  return (
    <div className="bg-black">
      <div className="slider">
        <div className="slider-track">
          {items.map((item, index) => (
            <div key={`first-${index}`} className="slide">
              <img src={item.brand} alt={item.name} className="h-[100px]" />
            </div>
          ))}
          {/* ------------------------------------- */}
          {items.map((item, index) => (
            <div key={`second-${index}`} className="slide">
              <img src={item.brand} alt={item.name} className="h-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

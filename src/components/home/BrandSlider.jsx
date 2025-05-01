import brand1 from "../../assets/images/svgs/logo1.svg";
import brand2 from "../../assets/images/svgs/logo2.svg";
import brand3 from "../../assets/images/svgs/logo3.svg";
import brand4 from "../../assets/images/svgs/logo4.svg";
import brand5 from "../../assets/images/svgs/logo5.svg";
import "./slide.css";

export default function BrandSlider() {
  const items = [
    { brand: brand1, name: "Brand 1" },
    { brand: brand2, name: "Brand 2" },
    { brand: brand3, name: "Brand 3" },
    { brand: brand4, name: "Brand 4" },
    { brand: brand5, name: "Brand 5" },
    { brand: brand1, name: "Brand 11" },
    { brand: brand2, name: "Brand 22" },
    { brand: brand3, name: "Brand 33" },
    { brand: brand4, name: "Brand 44" },
    { brand: brand5, name: "Brand 55" },

  ];

  return (
    <div className="bg-black">
      <div className="slider">
        <div className="slider-track">

          {items.map((item, index) => (
            <div key={`first-${index}`} className="slide">
              <img src={item.brand} alt={item.name} className="h-[80px]" />
            </div>
          ))}
          {/* ------------------------------------- */}
          {items.map((item, index) => (
            <div key={`second-${index}`} className="slide">
              <img src={item.brand} alt={item.name} className="h-[80px]" />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

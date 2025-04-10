import { BsCartPlus } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
export default function ProductCard({ product }) {
  const { title, images, discountPercentage, discountedPrice, price, id } =
    product;
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
      <div className="absolute top-4 end-4 bg-red-500 text-white text-sm px-2 py-1 rounded">
        %30
      </div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[200px] overflow-hidden rounded-lg ">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full aspect-square"
            width={100}
            height={100}
          />
        </div>
      </div>

      <div className="text-gray-700 text-sm mb-2 truncate">
        {/* ساعات رجالية الأعمال ساعة معصم فاخرة حزام من الجلد.... */}
        {title}
      </div>
      <div className="text-yellow-400 mb-2 flex ">
        <GoStarFill />
        <GoStarFill />
        <GoStarFill />
        <GoStarFill />
        <GoStarFill />
      </div>
      <div className="flex justify-between gap-3 ">
        <div>
          {/* <div className="text-gray-500 line-through text-sm">EGP 95.00</div> */}
          <div className="text-gray-800 text-lg font-bold"> {price} جنيه</div>
        </div>
        <div className="flex ">
          <div className="mt-4  text-teal-500 text-2xl border-2 border-teal-500 rounded-full p-2">
            <BsCartPlus />
          </div>
        </div>
      </div>
    </div>
  );
}

import { BsCartPlus } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
export default function ProductCard() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
      <div className="absolute top-4 end-4 bg-red-500 text-white text-sm px-2 py-1 rounded">
        %30
      </div>
      <div className="my-4">
        <img
          src="https://placehold.co/200x200"
          alt="ساعة معصم فاخرة بحزام من الجلد"
          className="w-full h-auto"
        />
      </div>
      <div className="text-gray-700 text-sm mb-2">
        ساعات رجالية الأعمال ساعة معصم فاخرة حزام من الجلد....
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
          <div className="text-gray-500 line-through text-sm">EGP 95.00</div>
          <div className="text-gray-800 text-lg font-bold">EGP 79.50</div>
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

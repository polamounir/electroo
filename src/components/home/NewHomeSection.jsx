import React from "react";
import { BsCartPlus } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import NewProductCard from "../ui/NewProductCard";

export default function NewHomeSection({
  title,
  products,
  loading,
  error,
  more,
}) {
  return (
    <div>
      <div className="py-15 text-center text-3xl md:text-5xl ">
        <h2 className="title text-2xl lg:text-4xl">{title}</h2>
      </div>

      <div className="w-full bg-[#fafafa] py-15">
        <div className="w-full lg:w-[100%] m-auto shadow-none">
          <div className="slider-container">
            {products === 0 && (
              <div className="text-center text-2xl py-10">لا توجد منتجات</div>
            )}
            {!loading && (
              <div
                aria-label={"products placeholder slider"}
                className="flex justify-center flex-wrap items-start gap-4 p-2  lg:px-20 mt-10  "
              >
                {products?.data?.items &&
                  products.data.items.length > 0 &&
                  products.data.items.map((product, index) => (
                    <div key={index}>
                      <NewProductCard product={product} />
                    </div>
                  ))}
              </div>
            )}

            {error && (
              <div className="text-center text-2xl py-10">
                حدث خطأ ما, حاول مرة اخرى
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-5 show-more-box">
          <Link
            to={`${more}`}
            className="bg-white px-20 py-2 rounded-full border border-gray-400 "
          >
            المزيد
            <span>
              <IoArrowBack />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

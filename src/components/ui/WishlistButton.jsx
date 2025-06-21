import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const WishlistButton = ({ product }) => {
  const productId = product?.id;
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const found = storedWishlist.some((item) => item.id === productId);
    setIsWishlisted(found);
  }, [productId]);

  const toggleWishlist = () => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = storedWishlist.some((item) => item.id === productId);
    let updatedWishlist;

    if (exists) {
      updatedWishlist = storedWishlist.filter((item) => item.id !== productId);
      setIsWishlisted(false);
    } else {
      updatedWishlist = [...storedWishlist, product];
      setIsWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <button
      onClick={toggleWishlist}
      aria-label="Toggle wishlist"
      className="text-xl p-1 transition-colors duration-3000 hover:scale-110 "
    >
      {isWishlisted ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-black" />
      )}
    </button>
  );
};

export default WishlistButton;

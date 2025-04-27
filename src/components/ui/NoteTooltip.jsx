import React, { useEffect, useState } from "react";

const NoteTooltip = ({ message , classes }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(false);
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`absolute -top-3 start-[90%] bg-teal-600 text-white p-3  shadow-lg ${classes}`}>
      <div className="flex items-center justify-between relative">
        <span className="text-sm text-nowrap px-5">{message}</span>
        <button
          className="items-center justify-center bg-teal-500 w-5 h-5 rounded-full border-none text-white  cursor-pointer hover:text-red-400 absolute -top-4 -end-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default NoteTooltip;

import React from "react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="mb-4 md:mb-0">
          <h1 className="ar-font-s text-3xl font-bold text-white">
            إلكـــــــترو
          </h1>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-right md:gap-20">
          <div>
            <h6 className="text-gray-400 mb-1">الفئات</h6>
            <ul className="text-sm">
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gray-300">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-gray-300">
                  سياسات الشحن
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div dir="rtl">
              <h6 className="text-gray-400 mb-1">تواصل معنا:</h6>
              <p className="text-sm">
                <a
                  href="mailto:support@electro.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  support@electro.com
                </a>
              </p>
              <p className="text-sm mt-1">رقم الهاتف:</p>
              <p className="text-sm">
                <a href="tel:01234567890" className="hover:text-gray-300">
                  01234567890
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-right">
          <h6 className="text-gray-400 mb-2">تابعنا على:</h6>
          <div className="flex space-x-3 text-xl">
            <Link to="#" className="hover:opacity-75">
              <FaFacebookF />
            </Link>
            <Link to="#" className="hover:opacity-75">
              <FaWhatsapp />
            </Link>
            <Link to="#" className="hover:opacity-75">
              <IoChatbubbleEllipsesOutline />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-500 text-xs">
        © 2025 إلكــترو. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { Outlet } from "react-router-dom";

import React from "react";
import FloatingChatMenu from "../components/ui/FloatingChatMenu";
const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <FloatingChatMenu />
      <Footer />
    </div>
  );
};

export default MainLayout;

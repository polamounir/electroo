// import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { RxColorWheel } from "react-icons/rx";
import ChatBot from "./ChatBot";
// import ChatPopup from "./ChatPopup";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import {
  openChatBot,
  openSpinModel,
  // openChatPopup,
  // toggleMenu,
  selectActiveChat,
  // selectIsMenuOpen,
} from "../../app/slices/chatSlice";
import NoteTooltip from "./NoteTooltip";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FloatingChatMenu() {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  // const isMenuOpen = useSelector(selectIsMenuOpen);

  // const handleToggleMenu = () => {
  //   dispatch(toggleMenu());
  // };

  // const handleOpenChatPopup = () => {
  //   dispatch(openChatPopup());
  // };
  const handleOpenChatBot = () => {
    dispatch(openChatBot());
  };
  const handleOpenSpinModel = () => {
    dispatch(openSpinModel());
  };

  return (
    <div className={`chat-container`}>
      {/* <button className="floating-menu-button" onClick={handleToggleMenu}> */}
      <div className="floating-menu-button-container"></div>
      <div className="floating-menu-button-container">
        <div className=" relative">
          <button
            className="floating-menu-button"
            onClick={handleOpenSpinModel}
          >
            <RxColorWheel className="text-3xl" />
          </button>
        </div>
        <div className=" relative">
          <button className="floating-menu-button" onClick={handleOpenChatBot}>
            <RiRobot2Line className="text-3xl" />
          </button>
          <NoteTooltip
            message="ابدأ المحادثة مع المساعد الذكي"
            classes="chat-tooltip"
          />
        </div>
      </div>

      {/* Render the active chat component */}
      {activeChat === "bot" && <ChatBot />}
      {/* {activeChat === "popup" && <ChatPopup />} */}
    </div>
  );
}

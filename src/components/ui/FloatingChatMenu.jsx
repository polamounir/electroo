import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import ChatBot from "./ChatBot";
// import ChatPopup from "./ChatPopup";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import {
  openChatBot,
  // openChatPopup,
  // toggleMenu,
  selectActiveChat,
  // selectIsMenuOpen,
} from "../../app/slices/chatSlice";
import NoteTooltip from "./NoteTooltip";

export default function FloatingChatMenu() {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  // const isMenuOpen = useSelector(selectIsMenuOpen);

  // const handleToggleMenu = () => {
  //   dispatch(toggleMenu());
  // };

  const handleOpenChatBot = () => {
    dispatch(openChatBot());
  };

  // const handleOpenChatPopup = () => {
  //   dispatch(openChatPopup());
  // };

  return (
    <div className="chat-container">
      {/* Floating Menu Button */}
      {/* <button className="floating-menu-button" onClick={handleToggleMenu}> */}
      <button className="floating-menu-button" onClick={handleOpenChatBot}>
        <RiRobot2Line className="text-2xl" />
      </button>
      <NoteTooltip
        message="ابدأ المحادثة مع المساعد الذكي"
        classes="chat-tooltip
      "
      />

      {/* Render the active chat component */}
      {activeChat === "bot" && <ChatBot />}
      {/* {activeChat === "popup" && <ChatPopup />} */}
    </div>
  );
}

import { RiRobot2Line } from "react-icons/ri";
import { RxColorWheel } from "react-icons/rx";
import ChatBot from "./ChatBot";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import {
  openChatBot,
  openSpinModel,
  selectActiveChat,
} from "../../app/slices/chatSlice";
import NoteTooltip from "./NoteTooltip";
import { useLocation } from "react-router-dom";

export default function FloatingChatMenu() {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  const location = useLocation();

  // Check if current path is either "/admin" or "/supplier"
  const hiddenPaths = ["/admin", "/supplier"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const handleOpenChatBot = () => {
    dispatch(openChatBot());
  };
  const handleOpenSpinModel = () => {
    dispatch(openSpinModel());
  };

  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("accessToken");

  return (
    <div className={`chat-container`}>
      <div className="floating-menu-button-container"></div>
      <div className="floating-menu-button-container">
        {user && token && user.role === "User" && (
          <div className=" relative">
            <button
              className="floating-menu-button"
              onClick={handleOpenSpinModel}
            >
              <RxColorWheel className="text-3xl" />
            </button>
          </div>
        )}

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

      {activeChat === "bot" && <ChatBot />}
    </div>
  );
}

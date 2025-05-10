import ChatBody from "./ChatBody";
import ChatsMenu from "./ChatsMenu";

export default function SupplierChatLayout() {
  
  return (
    <div className="bg-gray-50 rounded-xl shadow-xl shadow-black/10 overflow-hidden">
      {/* <Outlet /> */}
      <div className="grid grid-cols-12">
        <ChatBody />
        <ChatsMenu />
      </div>
    </div>
  );
}

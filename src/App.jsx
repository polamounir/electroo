import { Provider } from "react-redux";
import "./App.css";
import AppRoutes from "./router/AppRoutes";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ChatBot />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

import { Provider } from "react-redux";
import "./App.css";
import AppRoutes from "./router/AppRoutes";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FloatingChatMenu from "./components/ui/FloatingChatMenu";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <FloatingChatMenu />
        
        {/* <ReactQueryDevtools initialIsOpen={false} />   */}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

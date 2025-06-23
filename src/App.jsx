import { Provider } from "react-redux";
import "./App.css";
import AppRoutes from "./router/AppRoutes";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import FloatingChatMenu from "./components/ui/FloatingChatMenu";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_ID}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;

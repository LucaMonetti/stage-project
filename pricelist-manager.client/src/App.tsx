import "./App.css";
import { RouterProvider } from "react-router";
import routes from "./config/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthenticationProvider from "./components/Authentication/AuthenticationProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <RouterProvider router={routes} />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}

export default App;

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { AppQueryClientProvider } from "./providers/QueryClientProvider.jsx";
import { Toaster } from "./components/ui/toaster.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <BrowserRouter>
          <AppQueryClientProvider>
            <AuthProvider>
              <App />
              <Toaster />
            </AuthProvider>
          </AppQueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import CustomQueryClientProvider from "./components/CustomQueryClientProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomQueryClientProvider>
      <App />
    </CustomQueryClientProvider>
  </StrictMode>
);

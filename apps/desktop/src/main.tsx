import React, { StrictMode, Suspense } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "~/routeTree.gen";
import { TRPCProvider } from "~/trpc";

import "../node_modules/@acme/ui/styles/globals.css"; // Hack for now
import { ThemeProvider } from "@acme/ui/theme";
import { register } from "@tauri-apps/plugin-deep-link";

// Create a new router instance
const router = createRouter({ routeTree });

register("acme"); 

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TRPCProvider>
          <RouterProvider router={router} />
        </TRPCProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}

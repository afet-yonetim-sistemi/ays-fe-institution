import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./i18n";
import Loading from "@/components/loading";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);

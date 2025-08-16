import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BoilerplateApp from "./BoilerplateApp";
import "./index.css";

// Initialize the 2D Platformer Boilerplate
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoilerplateApp />
  </StrictMode>
);
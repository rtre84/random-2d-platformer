import { createRoot } from "react-dom/client";
import BoilerplateApp from "./BoilerplateApp";
import "./index.css";

// Switch between original complex version and clean boilerplate
// import App from "./App"; // Original complex version with existing features
// import BoilerplateApp from "./BoilerplateApp"; // Clean boilerplate version

createRoot(document.getElementById("root")!).render(<BoilerplateApp />);

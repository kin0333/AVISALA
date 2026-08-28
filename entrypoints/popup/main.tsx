import { createRoot } from "react-dom/client"
import "../../assets/styles.css"
import { PopupApp } from "./App"

const root = document.getElementById("root")!
createRoot(root).render(<PopupApp />)

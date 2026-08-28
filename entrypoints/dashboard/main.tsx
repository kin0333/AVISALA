import { createRoot } from "react-dom/client"
import "../../assets/styles.css"
import { DashboardApp } from "./App"

const root = document.getElementById("root")!
createRoot(root).render(<DashboardApp />)

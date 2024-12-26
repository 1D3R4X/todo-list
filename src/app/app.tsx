import { ThemeProvider } from "./providers/theme-provider";
import { router } from "./providers/router";
import { RouterProvider } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

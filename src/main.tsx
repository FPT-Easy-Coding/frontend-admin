import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
// Supports weights 300-800
import "@fontsource-variable/open-sans";
const theme = {
  fontFamily: "Open Sans Variable, Helvetica, sans-serif",
  headings: {
    fontFamily: "Open Sans Variable, sans-serif",
  },
};
ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider defaultColorScheme="light" theme={theme}>
    <ModalsProvider>
      <App />
    </ModalsProvider>
  </MantineProvider>
);

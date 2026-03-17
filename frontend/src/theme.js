import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#ffffff", // White
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
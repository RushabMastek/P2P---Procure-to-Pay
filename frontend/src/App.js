import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyToken from "./pages/VerifyToken";
import Login from "./pages/login";
import Register from "./pages/VendorCreation";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/verify" element={<VerifyToken />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
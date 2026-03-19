import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react"; // Add to existing useState import
import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledEmail = location.state?.email || "";
  const successMessage = location.state?.message || "";

  const [form, setForm] = useState({
    email: prefilledEmail,
    password: "",
  });

  

  // const navigate = useNavigate();

  useEffect(() => {
  // Check if user completed OTP verification
    const otpVerified = localStorage.getItem("otpVerified");
    const verifiedEmail = localStorage.getItem("verifiedEmail");
    
    if (!otpVerified || verifiedEmail !== prefilledEmail) {
      alert("Please complete OTP verification first");
      navigate("/verify");
    }
    
    if (successMessage) {
    alert(successMessage);
  }
  }, [navigate, prefilledEmail, successMessage]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/login",
        form
      );

      if (res.data.token) {
        // Store token and email in localStorage
        console.log("Login successful, token received:", JSON.stringify(res.data));
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', res.data.user.Email);
        
        // Clear OTP verification flags
        localStorage.removeItem("otpVerified");
        localStorage.removeItem("verifiedEmail");
        localStorage.removeItem("email");
        
        // Show success message
        alert("Login Successful!");
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login Failed. Please check your credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Vendor Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              type="submit"
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
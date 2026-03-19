import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;
  const status = location.state?.status; // 'login' or 'register'

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      alert("Invalid access. Please start from the verification link.");
      navigate("/verify");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP input (only numbers, max 6 digits)
  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/verify-otp",
        { email, otp }
      );

      if (res.data.success) {
        setSuccess("OTP verified successfully! Redirecting...");
        
        // Store verification flag
        localStorage.setItem("otpVerified", "true");
        localStorage.setItem("verifiedEmail", email);
        
        setTimeout(() => {
          if (res.data.status === "login") {
            navigate("/login", { state: { email } });
          } else {
            navigate("/register", { state: { email } });
          }
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/resend-otp",
        { email }
      );

      if (res.data.success) {
        setSuccess("New OTP has been sent to your email!");
        setTimer(600); // Reset timer
        setCanResend(false);
        setOtp("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Verify Your Identity
          </Typography>
          
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            We've sent a 6-digit OTP to<br />
            <strong>{email}</strong>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={handleOTPChange}
              placeholder="000000"
              inputProps={{
                maxLength: 6,
                style: { textAlign: "center", fontSize: "24px", letterSpacing: "8px" },
              }}
              margin="normal"
              required
              disabled={loading}
              autoFocus
            />

            <Box sx={{ mt: 1, mb: 2, textAlign: "center" }}>
              <Typography variant="caption" color="textSecondary">
                {timer > 0 ? (
                  <>OTP expires in: <strong>{formatTime(timer)}</strong></>
                ) : (
                  <span style={{ color: "red" }}>OTP has expired</span>
                )}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading || otp.length !== 6}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Verify OTP"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="medium"
              onClick={handleResend}
              disabled={!canResend || loading}
            >
              {canResend ? "Resend OTP" : `Resend available in ${formatTime(timer)}`}
            </Button>
          </form>

          <Typography variant="caption" display="block" align="center" sx={{ mt: 3 }} color="textSecondary">
            Didn't receive the code? Check your spam folder or click Resend OTP
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default OTPVerification;
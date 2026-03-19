import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function VerifyToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      alert("Invalid link");
      return;
    }

    axios
      .get(`https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/verify-token?token=${token}`)
      .then((res) => {
        const { status, email, requireOTP, message } = res.data;
        
        localStorage.setItem("email", email);

        // Navigate to OTP verification page
        if (requireOTP) {
          navigate("/verify-otp", { state: { email, status } });
        } else {
          // Fallback if OTP is not required
          if (status === "login") {
            navigate("/login", { state: { email } });
          } else if (status === "register") {
            navigate("/register", { state: { email } });
          } else {
            alert("Unauthorized");
          }
        }
      })
      .catch(() => {
        alert("Invalid or expired link");
      });
  }, []);

  return <h2>Verifying token...</h2>;
}

export default VerifyToken;
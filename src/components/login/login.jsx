import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiBaseUrl from "../../constants/globaldata";
import loader from "../../assets/images/loader.gif";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpButtonDisable, setOtpButtonDisable] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const otpInputs = useRef([]);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      const token = Cookies.get("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}verify/`, {
          headers: {
            Authorization: token,
            'bypass-tunnel-reminder': "true"
          }
        });

        if (response.status === 200) {
          navigate('/dashboard');
        }
      } catch (error) {
        setLoading(false);
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const emailData = { email: email };

    axios
      .post(
        `${apiBaseUrl}auth/login/`,
        emailData,
        {
          headers: {
            'bypass-tunnel-reminder': "true"
          }
        }
      )
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          setStep(2);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error('There was an error sending the email!');
        setLoading(false);
      });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    
    newOtp[index] = value.replace(/[^0-9]/g, '');
    
    setOtp(newOtp);

    if (value>=0 && index < 5) {
      otpInputs.current[index + 1].focus();
    }

    setOtpButtonDisable(newOtp.some(digit => digit === ''));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      otpInputs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to previous input on left arrow
      otpInputs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      // Move to next input on right arrow
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setOtpButtonDisable(newOtp.some(digit => digit === ''));
    if (pastedData.length === 6) {
      otpInputs.current[5].focus();
    } else {
      otpInputs.current[pastedData.length].focus();
    }
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const otpValue = otp.join("");

    const otpData = {
      email: email,
      otp: otpValue
    };

    axios
      .post(
        `${apiBaseUrl}auth/verify-otp/`,
        otpData,
        {
          headers: {
            'bypass-tunnel-reminder': "true"
          }
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          const accessToken = res.data["access_token"];
          Cookies.set('access_token', accessToken, { expires: 1 });
          toast.success("Login Successful");
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 400) {
            toast.error("OTP Invalid !");
          } else {
            toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
          }
        } else if (error.request) {
          toast.error('No response received from the server.');
        } else {
          toast.error('There was an error verifying the OTP!');
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 position-relative">
      <ToastContainer />
      {loading && (
        <div className="loader-overlay d-flex justify-content-center align-items-center">
          <img src={loader} alt="Loading..." className="loader-img" />
        </div>
      )}
      <div className="card shadow-sm p-4">
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="login-form">
            <h3 className="text-center mb-4">Login</h3>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="login-form">
            <h3 className="text-center mb-4">Enter OTP</h3>
            <div className="d-flex justify-content-between mb-3 otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpInputs.current[index] = el}
                  type="text"
                  maxLength="1"
                  className="form-control text-center otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={otpButtonDisable}>Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
}